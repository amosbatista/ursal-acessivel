import { firstValueFrom } from 'rxjs';
import { StatusService } from '../status/Status.service';
import { TimelineMastodonService } from '../timeline/Timeline.Mastodon.service';

const tokenProvider = { GetAccessToken: () => 'captured-token' };

describe('clientes Mastodon autenticados', () => {
  beforeEach(() => {
    process.env.INSTANCE_URL = 'mastodon.example';
  });

  it('usa o token capturado ao ler a timeline', async () => {
    const httpClient = {
      get: jest.fn().mockResolvedValue({
        data: [{
          id: '1',
          content: 'post',
          url: 'https://mastodon.example/@user/1',
          created_at: '2026-10-29T00:00:00Z',
          account: { id: '1', username: 'user' },
          media_attachments: [],
        }],
      }),
    };
    const service = new TimelineMastodonService(tokenProvider, httpClient);
    const result = firstValueFrom(service.timeline$);

    await service.LoadTimeline('0');
    await result;

    expect(httpClient.get).toHaveBeenCalledWith(
      'https://mastodon.example/api/v1/timelines/public',
      expect.objectContaining({
        headers: { Authorization: 'Bearer captured-token' },
      }),
    );
  });

  it('usa o token capturado ao publicar um status', async () => {
    const httpClient = {
      post: jest.fn().mockResolvedValue({ data: { id: '1' } }),
    };
    const service = new StatusService(tokenProvider, httpClient);

    await firstValueFrom(service.Post({ status: 'teste', visibility: 'direct' }));

    expect(httpClient.post).toHaveBeenCalledWith(
      'https://mastodon.example/api/v1/statuses',
      expect.objectContaining({ status: 'teste' }),
      { headers: { Authorization: 'Bearer captured-token' } },
    );
  });
});
