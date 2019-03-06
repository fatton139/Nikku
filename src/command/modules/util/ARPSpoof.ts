import { AccessLevel } from "user/AccessLevel";
import ExecutableCommand from "command/ExecutableCommand";
import Action from "action/Action";
import OnMessageState from "state/OnMessageState";

const str = `In the first screen we can see we are initializing the ARP spoof to mimic \
the router- mimic the raspberry pi as the router and then sending packets back to the server and back to \
the victim. And then we are setting up the drift net and the URL snarf to capture the packets and display \
them in a readable format. As we can see the victim is browsing the BBC website homepage and then the URL \
snarfer is capturing all the information about the packets including the website they are visiting, \
the browser, the time and other useful information. So here we can see the information being recorded by \
the URL snarf as well as the image being detected by the drift net. As we can see the second part of the \
project is here where we have to input the hash and the hash type and it retrieves the information from a \
large database through an API and displays it to the screen and then we can verify it by using a MD5 \
hasher.`;

export default class ARPSpoof extends ExecutableCommand {
    public constructor() {
        super({
            commandString: "arpspoof",
            accessLevel: AccessLevel.UNREGISTERED,
            argLength: 0,
            description: "Alex Butler 102 Mitm Pi Project .",
        });
    }

    public setCustomAction(): Action {
        return new Action(async (state: OnMessageState) => {
            state.getHandle().channel.send(str);
            return true;
        });
    }
}
