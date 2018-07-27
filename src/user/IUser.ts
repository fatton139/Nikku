/**
 * Base interface for a user.
 */
export interface IUser {
    /**
     * Id of the user.
     */
    readonly id: string;

    /**
     * Access level of the user.
     */
    accessLevel: number;

    /**
     * The name of the user.
     */
    name?: string;
}
