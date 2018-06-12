import { Client } from "discord.js";

export class FortniteBotEventCore {
    private client: Client;
    public constructor(client: Client) {
        this.client = client;
    }
    public listen() {
        return;
    }
    public clearClient() {
        this.client = null;
    }
}
