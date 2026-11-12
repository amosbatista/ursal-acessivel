import axios from 'axios';
import { IAccessTokenProvider } from './AccessTokenProvider';
import {
  IMastodonAuthData,
  IMastodonAuthStore,
  MastodonAuthFileStore,
} from './MastodonAuth.store';

interface IMastodonAccount {
  acct?: string;
  username?: string;
}

interface IMastodonToken {
  access_token: string;
  token_type: string;
  scope: string;
  created_at: number;
}

class MastodonAuthService implements IAccessTokenProvider {
  static readonly REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';
  static readonly SCOPES = 'profile read:statuses write:statuses';

  private authData: IMastodonAuthData | null = null;
  private readonly instanceUrl: string;

  constructor(
    instanceUrl = process.env.INSTANCE_URL || '',
    private store: IMastodonAuthStore = new MastodonAuthFileStore(),
    private httpClient: any = axios,
  ) {
    this.instanceUrl = MastodonAuthService.NormalizeInstanceUrl(instanceUrl);
  }

  async PrepareAuthorization(): Promise<string> {
    this.EnsureInstanceUrl();
    let authData = await this.store.Load();

    if (!authData || authData.instanceUrl !== this.instanceUrl) {
      const response = await this.httpClient.post(`${this.instanceUrl}/api/v1/apps`, {
        client_name: 'Robô Acessível',
        redirect_uris: [MastodonAuthService.REDIRECT_URI],
        scopes: MastodonAuthService.SCOPES,
      });

      authData = {
        instanceUrl: this.instanceUrl,
        clientId: response.data.client_id,
        clientSecret: response.data.client_secret,
        redirectUri: MastodonAuthService.REDIRECT_URI,
        scope: MastodonAuthService.SCOPES,
      };
      await this.store.Save(authData);
    }

    const query = new URLSearchParams({
      client_id: authData.clientId,
      redirect_uri: authData.redirectUri,
      response_type: 'code',
      scope: authData.scope,
    });

    return `${this.instanceUrl}/oauth/authorize?${query.toString()}`;
  }

  async CompleteAuthorization(code: string): Promise<string> {
    const authData = await this.store.Load();
    if (!authData || authData.instanceUrl !== this.instanceUrl) {
      throw new Error('Credenciais do aplicativo Mastodon não encontradas. Inicie novamente a autenticação.');
    }

    const form = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code.trim(),
      client_id: authData.clientId,
      client_secret: authData.clientSecret,
      redirect_uri: authData.redirectUri,
      scope: authData.scope,
    });
    const response = await this.httpClient.post(
      `${this.instanceUrl}/oauth/token`,
      form.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    const token = response.data as IMastodonToken;
    const account = await this.VerifyToken(token.access_token);

    this.authData = {
      ...authData,
      accessToken: token.access_token,
      tokenType: token.token_type,
      scope: token.scope,
      createdAt: token.created_at,
      account: account.acct || account.username,
    };
    await this.store.Save(this.authData);

    return this.authData.account || 'conta autenticada';
  }

  async Initialize(): Promise<string> {
    this.EnsureInstanceUrl();
    const authData = await this.store.Load();
    if (!authData?.accessToken || authData.instanceUrl !== this.instanceUrl) {
      throw new Error('Token do Mastodon não encontrado. Execute "npm run mastodon:auth".');
    }

    const account = await this.VerifyToken(authData.accessToken);
    this.authData = {
      ...authData,
      account: account.acct || account.username,
    };
    return this.authData.account || 'conta autenticada';
  }

  GetAccessToken(): string {
    if (!this.authData?.accessToken) {
      throw new Error('Token do Mastodon ainda não foi carregado.');
    }
    return this.authData.accessToken;
  }

  private async VerifyToken(accessToken: string): Promise<IMastodonAccount> {
    try {
      const response = await this.httpClient.get(
        `${this.instanceUrl}/api/v1/accounts/verify_credentials`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      return response.data as IMastodonAccount;
    }
    catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('O token do Mastodon foi revogado ou é inválido. Execute "npm run mastodon:auth" novamente.');
      }
      throw new Error(`Não foi possível validar a autenticação do Mastodon: ${error.message || 'erro desconhecido'}`);
    }
  }

  private EnsureInstanceUrl(): void {
    if (!this.instanceUrl) {
      throw new Error('A variável INSTANCE_URL não foi configurada.');
    }
  }

  private static NormalizeInstanceUrl(instanceUrl: string): string {
    const trimmedUrl = instanceUrl.trim().replace(/\/$/, '');
    if (!trimmedUrl) {
      return '';
    }
    return /^https?:\/\//i.test(trimmedUrl) ? trimmedUrl : `https://${trimmedUrl}`;
  }
}

export { MastodonAuthService };
