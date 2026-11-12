import { MastodonAuthService } from './MastodonAuth.service';
import { IMastodonAuthData, IMastodonAuthStore } from './MastodonAuth.store';

class MemoryAuthStore implements IMastodonAuthStore {
  data: IMastodonAuthData | null = null;

  async Load(): Promise<IMastodonAuthData | null> {
    return this.data;
  }

  async Save(data: IMastodonAuthData): Promise<void> {
    this.data = { ...data };
  }
}

describe('MastodonAuthService', () => {
  it('registra o aplicativo e gera a URL de autorização', async () => {
    const store = new MemoryAuthStore();
    const httpClient = {
      post: jest.fn().mockResolvedValue({
        data: { client_id: 'client-id', client_secret: 'client-secret' },
      }),
    };
    const service = new MastodonAuthService('mastodon.example', store, httpClient);

    const url = await service.PrepareAuthorization();

    expect(httpClient.post).toHaveBeenCalledWith(
      'https://mastodon.example/api/v1/apps',
      expect.objectContaining({
        redirect_uris: ['urn:ietf:wg:oauth:2.0:oob'],
        scopes: 'profile read:statuses write:statuses',
      }),
    );
    expect(url).toContain('https://mastodon.example/oauth/authorize?');
    expect(url).toContain('client_id=client-id');
    expect(store.data?.clientSecret).toBe('client-secret');
  });

  it('troca o código, valida a conta e persiste o token', async () => {
    const store = new MemoryAuthStore();
    store.data = {
      instanceUrl: 'https://mastodon.example',
      clientId: 'client-id',
      clientSecret: 'client-secret',
      redirectUri: 'urn:ietf:wg:oauth:2.0:oob',
      scope: 'profile read:statuses write:statuses',
    };
    const httpClient = {
      post: jest.fn().mockResolvedValue({
        data: {
          access_token: 'user-token',
          token_type: 'Bearer',
          scope: 'profile read:statuses write:statuses',
          created_at: 123,
        },
      }),
      get: jest.fn().mockResolvedValue({ data: { acct: 'robo' } }),
    };
    const service = new MastodonAuthService('https://mastodon.example/', store, httpClient);

    const account = await service.CompleteAuthorization('one-time-code');

    expect(account).toBe('robo');
    expect(httpClient.post.mock.calls[0][1]).toContain('code=one-time-code');
    expect(httpClient.get).toHaveBeenCalledWith(
      'https://mastodon.example/api/v1/accounts/verify_credentials',
      { headers: { Authorization: 'Bearer user-token' } },
    );
    expect(store.data?.accessToken).toBe('user-token');
    expect(service.GetAccessToken()).toBe('user-token');
  });

  it('interrompe a inicialização quando o token foi revogado', async () => {
    const store = new MemoryAuthStore();
    store.data = {
      instanceUrl: 'https://mastodon.example',
      clientId: 'client-id',
      clientSecret: 'client-secret',
      redirectUri: 'urn:ietf:wg:oauth:2.0:oob',
      scope: 'profile read:statuses write:statuses',
      accessToken: 'revoked-token',
    };
    const httpClient = {
      get: jest.fn().mockRejectedValue({ response: { status: 401 } }),
    };
    const service = new MastodonAuthService('mastodon.example', store, httpClient);

    await expect(service.Initialize()).rejects.toThrow('revogado ou é inválido');
  });
});
