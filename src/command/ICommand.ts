export interface ICommand {
    command?: string;
    accessLevel: number;
    action: () => boolean;
}
