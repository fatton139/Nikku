import { OnMessageState } from "../state";

export interface HasAction {
    setCustomActionFunction(state: OnMessageState, args: string[]): Promise<void>;
}
