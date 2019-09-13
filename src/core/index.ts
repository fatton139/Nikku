import { NikkuCore } from "./NikkuCore";
import { EventCore as eventCore } from "./EventCore";
import { DatabaseCore as databaseCore } from "./DatabaseCore";

export { core, NikkuCore } from "./NikkuCore";
export { EventCore } from "./EventCore";
export { DatabaseCore } from "./DatabaseCore";

export namespace Nikku {
    export type Core = NikkuCore;
    export type EventCore = eventCore;
    export type DatabaseCore = databaseCore;
}
