import { Subject } from 'rxjs';
import WebSocket from 'ws';

class TimelineStreamService {
  MastodomTimeline$ = new Subject<any>();


  constructor (
    private mastodonConnection = new WebSocket('ws://ursal.zone/api/v1/streaming/public/local', {
      headers: {
        Authorization: 'Bearer NGNCoXx5Pm7GxM_1wpHTrNRZrdRlMvAMrudEzMdH5hc'
      }
    })
  ) {
    this.mastodonConnection.on('open', () => {
      console.log("conectado")
    })
    this.mastodonConnection.on('public:local', (test: any) => {
      console.log("recebido", test)
    })

    console.log("iniciado")
  }
  
}

export { TimelineStreamService }