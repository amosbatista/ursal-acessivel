import { ActivityService } from "./Activity.service";
import { IActivity } from "./IActivity";
import { DATE_FORMAT_SYSTEM, DATE_FORMAT_VIEW } from "./dateFormat.const";

describe('Activity', () => {

    beforeAll(() => {
        jest.clearAllMocks();
    });

    it('deve iniciar uma atividade do zero quando iniciado', () => {
      const dateLibFormatMock = jest.fn().mockReturnValue('01/12/2025');
      const dateLibFactory = () => ({
        format: dateLibFormatMock
      });

      const activityService = new ActivityService(dateLibFactory);
      const actual:IActivity = activityService.Init();

      expect(dateLibFormatMock).toBeCalledWith(DATE_FORMAT_SYSTEM)
      expect(actual).toEqual({
        today: {
            TimelineReadingErrors: 0,
            AcessibilityFailedPosts: 0,
            PostSendErrors: 0,
            LastActivity: '01/12/2025'
        },
        allTime: {
            TimelineReadingErrors: 0,
            AcessibilityFailedPosts: 0,
            PostSendErrors: 0,
            StartedAt: '01/12/2025'
        }
      });
    });

    it('deve reiniciar uma atividade do zero quando carregado, reiniciando os contadores de hoje', () => {
      const dateLibFormatMock = jest.fn().mockReturnValue('01/12/2012');
      const dateLibFactory = () => ({
        format: dateLibFormatMock
      });

      const activityService = new ActivityService(dateLibFactory);

      const loaded: IActivity = {
        today: {
            TimelineReadingErrors: 100,
            AcessibilityFailedPosts: 50,
            PostSendErrors: 30,
            LastActivity: '01/12/2012'
        },
        allTime: {
            TimelineReadingErrors: 11245,
            AcessibilityFailedPosts: 12221,
            PostSendErrors: 12,
            StartedAt: '03/01/2012'
        }
      }
      const actual:IActivity = activityService.Load(loaded);

      expect(dateLibFormatMock).toBeCalledWith(DATE_FORMAT_SYSTEM)
      expect(actual).toEqual({
        today: {
            TimelineReadingErrors: 0,
            AcessibilityFailedPosts: 0,
            PostSendErrors: 0,
            LastActivity: '01/12/2012'
        },
        allTime: {
          TimelineReadingErrors: 11245,
          AcessibilityFailedPosts: 12221,
          PostSendErrors: 12,
          StartedAt: '03/01/2012'
        }
      });
    });

    it('deve registrar um novo post de erro de acessibilidade, no mesmo dia.', () => {
      const dateLibFactory = (() => ({
        format: jest.fn().mockReturnValue('03/01/2024'),
        diff: jest.fn().mockReturnValue(0)
      }));

      const initial = {
          today: {
              TimelineReadingErrors: 0,
              AcessibilityFailedPosts: 1,
              PostSendErrors: 0,
              LastActivity: '03/01/2024'
          },
          allTime: {
              TimelineReadingErrors: 3000,
              AcessibilityFailedPosts: 31,
              PostSendErrors: 10,
              StartedAt: '01/01/1998'
          }
      };
      
      const service = new ActivityService(dateLibFactory);
      service.Load(initial);

      const actual = service.RegisterNewAcessibilityFailedPost();

      expect(actual).toEqual({
        today: {
            TimelineReadingErrors: 0,
            AcessibilityFailedPosts: 1,
            PostSendErrors: 0,
            LastActivity: '03/01/2024'
        },
        allTime: {
            TimelineReadingErrors: 3000,
            AcessibilityFailedPosts: 32,
            PostSendErrors: 10,
            StartedAt: '01/01/1998'
        }
    });

    const secontActual = service.RegisterNewAcessibilityFailedPost();

      expect(secontActual).toEqual({
        today: {
            TimelineReadingErrors: 0,
            AcessibilityFailedPosts: 2,
            PostSendErrors: 0,
            LastActivity: '03/01/2024'
        },
        allTime: {
            TimelineReadingErrors: 3000,
            AcessibilityFailedPosts: 33,
            PostSendErrors: 10,
            StartedAt: '01/01/1998'
        }
      });
  });


  it('deve registrar um novo post de erro de acessibilidade, e zerar contadores de hoje, caso seja o dia seguinte.', () => {
    const dateLibFactory = (() => ({
      format: jest.fn().mockReturnValue('03/01/2004'),
      diff: jest.fn().mockReturnValue(1)
    }));

    const initial = {
        today: {
            TimelineReadingErrors: 10,
            AcessibilityFailedPosts: 5,
            PostSendErrors: 3,
            LastActivity: '03/01/2004'
        },
        allTime: {
            TimelineReadingErrors: 3000,
            AcessibilityFailedPosts: 31,
            PostSendErrors: 10,
            StartedAt: '01/01/1998'
        }
    };
    
    const service = new ActivityService(dateLibFactory);
    service.Load(initial);

    const actual = service.RegisterNewAcessibilityFailedPost();

    expect(actual).toEqual({
      today: {
          TimelineReadingErrors: 0,
          AcessibilityFailedPosts: 1,
          PostSendErrors: 0,
          LastActivity: '03/01/2004'
      },
      allTime: {
          TimelineReadingErrors: 3000,
          AcessibilityFailedPosts: 32,
          PostSendErrors: 10,
          StartedAt: '01/01/1998'
      }
    });

    const secondActual = service.RegisterNewAcessibilityFailedPost();

    expect(secondActual).toEqual({
      today: {
          TimelineReadingErrors: 0,
          AcessibilityFailedPosts: 1,
          PostSendErrors: 0,
          LastActivity: '03/01/2004'
      },
      allTime: {
          TimelineReadingErrors: 3000,
          AcessibilityFailedPosts: 33,
          PostSendErrors: 10,
          StartedAt: '01/01/1998'
      }
    });
  });

  it('deve registrar um novo erro de post no mesmo dia.', () => {
    const dateLibFactory = (() => ({
      format: jest.fn().mockReturnValue('14/02/2024'),
      diff: jest.fn().mockReturnValue(-1)
    }));

    const initial = {
        today: {
            TimelineReadingErrors: 10,
            AcessibilityFailedPosts: 5,
            PostSendErrors: 3,
            LastActivity: '03/01/2000'
        },
        allTime: {
            TimelineReadingErrors: 3000,
            AcessibilityFailedPosts: 31,
            PostSendErrors: 10,
            StartedAt: '01/01/1998'
        }
    };
    
    const service = new ActivityService(dateLibFactory);
    service.Load(initial);

    const actual = service.RegisterNewSendStatusError();

    expect(actual).toEqual({
      today: {
          TimelineReadingErrors: 0,
          AcessibilityFailedPosts: 0,
          PostSendErrors: 1,
          LastActivity: '14/02/2024'
      },
      allTime: {
          TimelineReadingErrors: 3000,
          AcessibilityFailedPosts: 31,
          PostSendErrors: 11,
          StartedAt: '01/01/1998'
      }
    });

    const secondActual = service.RegisterNewSendStatusError();

    expect(secondActual).toEqual({
      today: {
          TimelineReadingErrors: 0,
          AcessibilityFailedPosts: 0,
          PostSendErrors: 2,
          LastActivity: '14/02/2024'
      },
      allTime: {
          TimelineReadingErrors: 3000,
          AcessibilityFailedPosts: 31,
          PostSendErrors: 12,
          StartedAt: '01/01/1998'
      }
    });
  });

  it('deve registrar um novo erro de post no dia seguinte e zerar contadores de hoje, caso seja o dia seguinte.', () => {
    const dateLibFactory = (() => ({
      format: jest.fn().mockReturnValue('14/02/2024'),
      diff: jest.fn().mockReturnValue(1)
    }));

    const initial = {
        today: {
            TimelineReadingErrors: 10,
            AcessibilityFailedPosts: 5,
            PostSendErrors: 3,
            LastActivity: '03/01/2000'
        },
        allTime: {
            TimelineReadingErrors: 3000,
            AcessibilityFailedPosts: 31,
            PostSendErrors: 10,
            StartedAt: '01/01/1998'
        }
    };
    
    const service = new ActivityService(dateLibFactory);
    service.Load(initial);

    const actual = service.RegisterNewSendStatusError();

    expect(actual).toEqual({
      today: {
          TimelineReadingErrors: 0,
          AcessibilityFailedPosts: 0,
          PostSendErrors: 1,
          LastActivity: '14/02/2024'
      },
      allTime: {
          TimelineReadingErrors: 3000,
          AcessibilityFailedPosts: 31,
          PostSendErrors: 11,
          StartedAt: '01/01/1998'
      }
    });

    const second = service.RegisterNewSendStatusError();

    expect(second).toEqual({
      today: {
          TimelineReadingErrors: 0,
          AcessibilityFailedPosts: 0,
          PostSendErrors: 1,
          LastActivity: '14/02/2024'
      },
      allTime: {
          TimelineReadingErrors: 3000,
          AcessibilityFailedPosts: 31,
          PostSendErrors: 12,
          StartedAt: '01/01/1998'
      }
    });

});

it('deve registrar um novo erro de leitura timeline no mesmo dia.', () => {
  const dateLibFactory = (() => ({
    format: jest.fn().mockReturnValue('14/02/2024'),
    diff: jest.fn().mockReturnValue(-1)
  }));

  const initial = {
      today: {
          TimelineReadingErrors: 10,
          AcessibilityFailedPosts: 5,
          PostSendErrors: 3,
          LastActivity: '03/01/2000'
      },
      allTime: {
          TimelineReadingErrors: 3000,
          AcessibilityFailedPosts: 31,
          PostSendErrors: 10,
          StartedAt: '01/01/1998'
      }
  };
  
  const service = new ActivityService(dateLibFactory);
  service.Load(initial);

  const actual = service.RegisterNewTimelineReadError();

  expect(actual).toEqual({
    today: {
        TimelineReadingErrors: 1,
        AcessibilityFailedPosts: 0,
        PostSendErrors: 0,
        LastActivity: '14/02/2024'
    },
    allTime: {
        TimelineReadingErrors: 3001,
        AcessibilityFailedPosts: 31,
        PostSendErrors: 10,
        StartedAt: '01/01/1998'
    }
  });

  const secondActual = service.RegisterNewTimelineReadError();

  expect(secondActual).toEqual({
    today: {
        TimelineReadingErrors: 2,
        AcessibilityFailedPosts: 0,
        PostSendErrors: 0,
        LastActivity: '14/02/2024'
    },
    allTime: {
        TimelineReadingErrors: 3002,
        AcessibilityFailedPosts: 31,
        PostSendErrors: 10,
        StartedAt: '01/01/1998'
    }
  });
});

it('deve registrar um novo erro de leitura de timeline no dia seguinte e zerar contadores de hoje, caso seja o dia seguinte.', () => {
  const dateLibFactory = (() => ({
    format: jest.fn().mockReturnValue('14/02/2024'),
    diff: jest.fn().mockReturnValue(1)
  }));

  const initial = {
      today: {
          TimelineReadingErrors: 10,
          AcessibilityFailedPosts: 5,
          PostSendErrors: 3,
          LastActivity: '03/01/2000'
      },
      allTime: {
          TimelineReadingErrors: 3000,
          AcessibilityFailedPosts: 31,
          PostSendErrors: 10,
          StartedAt: '01/01/1998'
      }
  };
  
  const service = new ActivityService(dateLibFactory);
  service.Load(initial);

  const actual = service.RegisterNewTimelineReadError();

  expect(actual).toEqual({
    today: {
        TimelineReadingErrors: 1,
        AcessibilityFailedPosts: 0,
        PostSendErrors: 0,
        LastActivity: '14/02/2024'
    },
    allTime: {
        TimelineReadingErrors: 3001,
        AcessibilityFailedPosts: 31,
        PostSendErrors: 10,
        StartedAt: '01/01/1998'
    }
  });

  const second = service.RegisterNewTimelineReadError();

  expect(second).toEqual({
    today: {
        TimelineReadingErrors: 1,
        AcessibilityFailedPosts: 0,
        PostSendErrors: 0,
        LastActivity: '14/02/2024'
    },
    allTime: {
        TimelineReadingErrors: 3002,
        AcessibilityFailedPosts: 31,
        PostSendErrors: 10,
        StartedAt: '01/01/1998'
    }
  });

});

});
