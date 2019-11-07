import { OnMessageState } from "../state";

export interface HasAction {
    onAction(state: OnMessageState, args: string[]): Promise<void>;
}
