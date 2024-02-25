import { ActivityService } from "./Activity.service";
import { IActivity } from "./IActivity";

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

      expect(dateLibFormatMock).toBeCalledWith(activityService.DATE_FORMAT_VIEW)
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

      expect(dateLibFormatMock).toBeCalledWith(activityService.DATE_FORMAT_VIEW)
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

    /*
    it.skip('deve iniciar uma atividade do zero', () => {
        const expected = {
            today: {
                TimelineReadingErrors: 12,
                AcessibilityFailedPosts: 1,
                PostSendErrors: 1,
                LastActivity: '23423423'
            },
            allTime: {
                TimelineReadingErrors: 1121,
                AcessibilityFailedPosts: 112,
                PostSendErrors: 11,
                StartedAt: '23423423'
            }
        };
        const actual$ = (0, rxjs_1.of)(expected);
        const expected$ = new rxjs_1.Subject();
        const saveDataMock = jest.fn();
        const factory = () => ({
            LoadData: jest.fn(),
            SaveData: saveDataMock,
            LoadedData$: actual$,
            SavedData$: expected$
        });
        const momentFactory = (() => ({
            format: jest.fn().mockReturnValue('1231231231')
        }));
        const service = new Activity_1.default(factory, momentFactory);
        service.Init();
        expected$.subscribe({
            next: () => {
                expect(saveDataMock).lastCalledWith({
                    today: {
                        TimelineReadingErros: 0,
                        AcessibilityFailedPosts: 0,
                        PostSendErrors: 0,
                        LastActivity: '1231231231'
                    },
                    allTime: {
                        TimelineReadingErros: 0,
                        AcessibilityFailedPosts: 0,
                        PostSendErrors: 0,
                        StartedAt: '1231231231'
                    }
                });
            }
        });
    });
    it.skip('deve registrar um novo post de erro de acessibilidade, no mesmo dia.', () => {
        const initial = {
            today: {
                TimelineReadingErrors: 0,
                AcessibilityFailedPosts: 0,
                PostSendErrors: 0,
                LastActivity: '1111111'
            },
            allTime: {
                TimelineReadingErrors: 300,
                AcessibilityFailedPosts: 3,
                PostSendErrors: 0,
                StartedAt: '1111111'
            }
        };
        const initial$ = (0, rxjs_1.of)(initial);
        const actual$ = new rxjs_1.Subject();
        const factory = () => ({
            LoadData: jest.fn(),
            SaveData: jest.fn(),
            LoadedData$: initial$,
            SavedData$: actual$
        });
        const momentFactory = (() => ({
            format: jest.fn().mockReturnValue('234234'),
            diff: jest.fn().mockReturnValue(0)
        }));
        const service = new Activity_1.default(factory, momentFactory);
        actual$.subscribe({
            next: (expected) => {
                expect(expected).toEqual({
                    today: {
                        TimelineReadingErros: 0,
                        AcessibilityFailedPosts: 1,
                        PostSendErrors: 0
                    },
                    allTime: {
                        TimelineReadingErros: 0,
                        AcessibilityFailedPosts: 4,
                        PostSendErrors: 0,
                        StartedAt: '1111111'
                    }
                });
            }
        });
        service.RegisterNewAcessibilityFailedPost();
    });
    it.skip('deve registrar um novo post de erro de acessibilidade, num outro dia.', () => {
        const initial = {
            today: {
                TimelineReadingErrors: 12,
                AcessibilityFailedPosts: 1,
                PostSendErrors: 1,
                LastActivity: '1111111'
            },
            allTime: {
                TimelineReadingErrors: 300,
                AcessibilityFailedPosts: 3,
                PostSendErrors: 0,
                StartedAt: '1111111'
            }
        };
        const initial$ = (0, rxjs_1.of)(initial);
        const actual$ = new rxjs_1.Subject();
        const factory = () => ({
            LoadData: jest.fn(),
            SaveData: jest.fn(),
            LoadedData$: initial$,
            SavedData$: actual$
        });
        const momentFactory = (() => ({
            format: jest.fn().mockReturnValue('025151515'),
            diff: jest.fn().mockReturnValue(1)
        }));
        const service = new Activity_1.default(factory, momentFactory);
        actual$.subscribe({
            next: (expected) => {
                expect(expected).toEqual({
                    today: {
                        TimelineReadingErros: 0,
                        AcessibilityFailedPosts: 1,
                        PostSendErrors: 0,
                        StartedAt: '0'
                    },
                    allTime: {
                        TimelineReadingErros: 0,
                        AcessibilityFailedPosts: 3,
                        PostSendErrors: 0,
                        StartedAt: '025151515'
                    }
                });
            }
        });
        initial$.subscribe({ next: () => {
                console.log('fazendo');
                service.RegisterNewAcessibilityFailedPost();
            } });
    });
    it.skip('deve registrar um novo erro timeline, no mesmo dia.', () => {
        const initial = {
            today: {
                TimelineReadingErrors: 665,
                AcessibilityFailedPosts: 121,
                PostSendErrors: 1,
                LastActivity: '234234234'
            },
            allTime: {
                TimelineReadingErrors: 12312312,
                AcessibilityFailedPosts: 1122,
                PostSendErrors: 121,
                StartedAt: '0221'
            }
        };
        const initial$ = (0, rxjs_1.of)(initial);
        const actual$ = new rxjs_1.Subject();
        const factory = () => ({
            LoadData: jest.fn(),
            SaveData: jest.fn(),
            LoadedData$: initial$,
            SavedData$: actual$
        });
        const momentFactory = (() => ({
            format: jest.fn().mockReturnValue('1231231312'),
            diff: jest.fn().mockReturnValue(0)
        }));
        const service = new Activity_1.default(factory, momentFactory);
        service.Init();
        actual$.subscribe({
            next: (expected) => {
                expect(expected).toEqual({
                    today: {
                        TimelineReadingErros: 0,
                        AcessibilityFailedPosts: 1,
                        PostSendErrors: 0,
                        StartedAt: '025151515'
                    },
                    allTime: {
                        TimelineReadingErros: 0,
                        AcessibilityFailedPosts: 4,
                        PostSendErrors: 0,
                        StartedAt: '025151515'
                    }
                });
            }
        });
        service.RegisterNewTimelineReadError();
    });
    */
});
