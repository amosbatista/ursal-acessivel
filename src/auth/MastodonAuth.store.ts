import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

interface IMastodonAuthData {
  instanceUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string;
  accessToken?: string;
  tokenType?: string;
  createdAt?: number;
  account?: string;
}

interface IMastodonAuthStore {
  Load(): Promise<IMastodonAuthData | null>;
  Save(data: IMastodonAuthData): Promise<void>;
}

class MastodonAuthFileStore implements IMastodonAuthStore {
  constructor(private fileName = process.env.MASTODON_AUTH_FILE || './data/mastodon-auth.json') {}

  async Load(): Promise<IMastodonAuthData | null> {
    try {
      const contents = await readFile(this.fileName, { encoding: 'utf8' });
      return JSON.parse(contents) as IMastodonAuthData;
    }
    catch (error: any) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async Save(data: IMastodonAuthData): Promise<void> {
    const directory = path.dirname(this.fileName);
    const temporaryFile = `${this.fileName}.tmp`;

    await mkdir(directory, { recursive: true });
    await writeFile(temporaryFile, JSON.stringify(data, null, 2), {
      encoding: 'utf8',
      mode: 0o600,
    });
    await rename(temporaryFile, this.fileName);
  }
}

export { IMastodonAuthData, IMastodonAuthStore, MastodonAuthFileStore };
