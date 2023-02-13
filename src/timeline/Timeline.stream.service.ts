import { Subject } from 'rxjs';
import WebSocket from 'ws';

class TimelineStreamService {
  MastodomTimeline$ = new Subject<any>();
  pingTimeout: any

  constructor (
    //private mastodonConnection: any
    
  ){}

   async heartbeat() {
    clearTimeout(this.pingTimeout);
  
    // Use `WebSocket#terminate()`, which immediately destroys the connection,
    // instead of `WebSocket#close()`, which waits for the close timer.
    // Delay should be equal to the interval at which your server
    // sends out pings plus a conservative assumption of the latency.
    this.pingTimeout = setTimeout(() => {
      this.pingTimeout.terminate();
    }, 30000 + 1000);
  }
  
  
  
  Connect () {

    try{
      const wb = new WebSocket('wss://ursal.zone/api/v1/streaming/public/local', {
        headers: {
          Authorization: 'Bearer NGNCoXx5Pm7GxM_1wpHTrNRZrdRlMvAMrudEzMdH5hc'
        }
      })

      wb.on('error', console.error);
      wb.on('open', this.heartbeat);
      wb.on('ping', this.heartbeat);
      wb.on('close', () => {
        clearTimeout(this.pingTimeout);
      });
      
      wb.onopen = (e) => {
        console.log("conectado")
        wb.send("public:local");
      }
      wb.on('public:local', (test: any) => {
        console.log("recebido", test)
      })


      setTimeout(() => {
        wb.send("public:local");
  
        console.log("enviado")
      }, 5*1000)

      console.log("iniciado")
    }
    catch(e){
      console.log(e)
    }


    
    

    
  }
  
}

export { TimelineStreamService }