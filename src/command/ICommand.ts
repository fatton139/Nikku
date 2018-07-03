import { FortniteBotAction } from "../action/FortniteBotAction";

export interface ICommand {
    command?: string;
    accessLevel: number;
    action: FortniteBotAction;
}
