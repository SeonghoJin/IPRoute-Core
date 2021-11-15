import {expect} from "chai";
import {WindowRouteFinderProcessFactory} from "../src/process/WindowRouteFinderProcessFactory";
import {ChildProcess} from "child_process";
import {platform} from "os";

describe('WindowRouterFinderProcessFactory test', () => {

    const os = platform();

    if(os !== 'win32'){
        return;
    }

    it("process 생성", () => {
        const processFactory = new WindowRouteFinderProcessFactory();
        const childProcess : ChildProcess = processFactory.createProcess('localhost');
        childProcess.on('error', (e: Error) => {
            console.error(e);
        })
    })

})








