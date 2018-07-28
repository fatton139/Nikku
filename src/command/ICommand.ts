import { FortniteBotAction } from "../action/FortniteBotAction";

/**
 * Interface for all fortniteBot commands.
 */
export interface ICommand {
    /**
     * The name of the command.
     */
    command?: string;

    /**
     * The access level required to execute the command.
     */
    accessLevel: number;

    /**
     * An action to invoke when the command is called.
     */
    action: FortniteBotAction;
}
