## Installation
```
npm install ip-trace
```
## Start
```typescript
import {Hop, iptrace} from 'ip-trace'

const tracer = iptrace('naver.com');

const maxHop = 5;

tracer.onHop((hop: Hop) => {
    if(hop.hop >= maxHop){
        tracer.end();
    }
    /** result:
    * 192.168.0.1 14.376 ms
    * 123.100.176.1 9.364 ms
    * 119.77.96.53 11.235 ms
    * 119.77.96.33 7.958 ms
    * 123.111.216.229 7.674 ms
    */
    console.log(hop.ip.address + " " + hop.time);
}).onClose((msg) => {
    /** 
     *  result : null
     */
    console.log(msg);
}).start();
```



## Testing
```shell
npm run test
```

## To do
- [ ] support windows