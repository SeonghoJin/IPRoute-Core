import {expect} from "chai";
import {Hop, iptrace, RouteFinderStatus} from '../src';
import {describe} from "mocha";

describe("iptrace test", () => {

    it("application test",(done) => {
        const iptraceInstance = iptrace("localhost");
        expect(iptraceInstance.status).to.be.equal(RouteFinderStatus.BeforeStart);
        iptraceInstance.onHop((hop : Hop) => {
            expect(iptraceInstance.status).to.be.equal(RouteFinderStatus.Start);
            expect(hop.hop).to.be.equal(1);
            expect(hop.ip.address).to.be.equal('127.0.0.1');
        }).onDestination((destination => {
            expect(destination.ip.address).to.be.equal('127.0.0.1');
        })).onClose(() => {
            expect(iptraceInstance.status).to.be.equal(RouteFinderStatus.End);
            done();
        }).start();
    })
})