export interface ICommand {
    command: string;
    action: () => boolean;
}
