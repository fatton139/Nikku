import { OnMessageState } from "../state";

export interface HasTrigger {
    setCustomTriggerFunction(state: OnMessageState, args: string[]): Promise<boolean>;
}
