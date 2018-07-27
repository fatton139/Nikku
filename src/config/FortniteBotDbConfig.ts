export class FortniteBotDbConfig {
    /**
     * The url to the database
     */
    public readonly url: string;

    /**
     * @classdesc Initial configuration for databases.
     * @param host - The host string of the database.
     */
    constructor(host: string) {
        this.url = host + "fortniteBotDb";
    }
}
