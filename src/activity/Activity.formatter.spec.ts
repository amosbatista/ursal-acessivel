import { ActivytyFormater } from "./Activity.formatter";
import { IActivity } from "./IActivity";
import { DATE_FORMAT_SYSTEM, DATE_FORMAT_VIEW } from "./dateFormat.const";

describe('Activity formatter', () => {

  beforeAll(() => {
      jest.clearAllMocks();
  });

  it('deve refceber uma timeline e gera uma cópia formatada', () => {
    const formatMock = jest.fn().mockReturnValue('01/01/2024 12:01:1221');

    const dateLibFormatMock = jest.fn(() => ({
      format: formatMock
    }));

    const activityFormatter = new ActivytyFormater(dateLibFormatMock);

    const activity: IActivity = {
      today: {
          TimelineReadingErrors: 0,
          AcessibilityFailedPosts: 0,
          PostSendErrors: 0,
          LastActivity: '2025-05-13'
      },
      allTime: {
          TimelineReadingErrors: 0,
          AcessibilityFailedPosts: 0,
          PostSendErrors: 0,
          StartedAt: '1998-01-01'
      }
    };

    expect(activityFormatter.format(activity)).toEqual({
      today: {
          TimelineReadingErrors: 0,
          AcessibilityFailedPosts: 0,
          PostSendErrors: 0,
          LastActivity: '01/01/2024 12:01:1221'
      },
      allTime: {
          TimelineReadingErrors: 0,
          AcessibilityFailedPosts: 0,
          PostSendErrors: 0,
          StartedAt: '01/01/2024 12:01:1221'
      }
    });

    expect(formatMock).toBeCalledWith(DATE_FORMAT_VIEW)
    expect(dateLibFormatMock).nthCalledWith(1, '1998-01-01', DATE_FORMAT_SYSTEM);
    expect(dateLibFormatMock).nthCalledWith(2, '2025-05-13', DATE_FORMAT_SYSTEM);
  });
});