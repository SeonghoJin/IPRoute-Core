import {Hop, iptrace} from 'ip-trace'

const tracer = iptrace('naver.com');

const maxHop = 5;

tracer.onHop((hop: Hop) => {
    if(hop.hop > maxHop){
        tracer.end();
    }
    console.log(hop);
}).start();