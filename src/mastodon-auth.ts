import 'dotenv/config';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { MastodonAuthService } from './auth/MastodonAuth.service';

const Authenticate = async (): Promise<void> => {
  const authService = new MastodonAuthService();
  const authorizationUrl = await authService.PrepareAuthorization();
  const terminal = createInterface({ input, output });

  try {
    console.log('\nAbra esta URL no navegador e autorize a conta do bot:\n');
    console.log(authorizationUrl);
    const code = await terminal.question('\nCole aqui o código exibido pelo Mastodon: ');
    if (!code.trim()) {
      throw new Error('O código de autorização não foi informado.');
    }

    const account = await authService.CompleteAuthorization(code);
    console.log(`\nAutenticação concluída para ${account}. O token foi salvo em data/mastodon-auth.json.\nExecute a aplicação normalmente.`);
  }
  finally {
    terminal.close();
  }
};

Authenticate().catch((error: any) => {
  console.error(`Falha na autenticação do Mastodon: ${error.message || 'erro desconhecido'}`);
  process.exitCode = 1;
});
