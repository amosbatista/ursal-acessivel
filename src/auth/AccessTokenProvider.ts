interface IAccessTokenProvider {
  GetAccessToken(): string;
}

class MissingAccessTokenProvider implements IAccessTokenProvider {
  GetAccessToken(): string {
    throw new Error(
      'Autenticação do Mastodon não inicializada. Execute "npm run mastodon:auth" antes de iniciar o bot.'
    );
  }
}

export { IAccessTokenProvider, MissingAccessTokenProvider };
