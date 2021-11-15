import {expect} from "chai";
import {Hop, iptrace, RouteFinderStatus} from '../src';
import {describe} from "mocha";
import {Destination} from "../src/index";

describe("iptrace test", () => {

    it("application test",(done) => {
        const iptraceInstance = iptrace("localhost");
        expect(iptraceInstance.status).to.be.equal(RouteFinderStatus.BeforeStart);
        iptraceInstance.onHop((hop : Hop) => {
            expect(iptraceInstance.status).to.be.equal(RouteFinderStatus.Start);
            expect(hop.hop).to.be.equal(1);
            expect(hop.ip.address).to.be.equal('127.0.0.1');
        }).onFindDestinationIP((destination => {
            expect(destination.ip.address).to.be.equal('127.0.0.1');
        })).onClose(() => {
            expect(iptraceInstance.status).to.be.equal(RouteFinderStatus.End);
            done();
        }).start();
    });

    it("application test2", (done) => {
        const iptraceInstance = iptrace("localhost");

        let hopCount = 0;
        let destinationCount = 0;
        let destination : Destination | null = null;

        iptraceInstance.onHop((hop) => {
            hopCount++;
        }).onFindDestinationIP((_destination) => {
            destinationCount++;
            destination = _destination;
        }).onClose(() => {
            expect(hopCount).equal(1);
            expect(destinationCount).equal(1);
            done();
        }).onDestination((_destination) => {
            expect(destination?.ip).to.be.equal(_destination.ip);
        }).start();
    })
})