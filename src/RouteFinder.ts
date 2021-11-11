import {RouteFinderStatus} from "./RouteFinderStatus";
import {RouteFinderErrorMessage} from "./RouteFinderErrorMessage";

class RouteFinder{
    hostname: string;
    status: RouteFinderStatus;
    constructor(hostname: string) {
        this.hostname = hostname;
        this.status = RouteFinderStatus.BeforeStart;
    }

    start(){
        if(this.status !== RouteFinderStatus.BeforeStart){
            throw new Error(RouteFinderErrorMessage.AlreadyStarted);
        }
        this.status = RouteFinderStatus.Start;
    }


    end() {
        if(this.status === RouteFinderStatus.End){
            throw new Error(RouteFinderErrorMessage.AlreadyEnded);
        }
        if(this.status !== RouteFinderStatus.Start){
            throw new Error(RouteFinderErrorMessage.NotStarted);
        }
        this.status = RouteFinderStatus.End;
    }
}

export default RouteFinder;