import { NikkuCore } from "core/NikkuCore";
import { EventCore as eventCore } from "core/EventCore";
import { DatabaseCore as databaseCore } from "core/DatabaseCore";

export { core, NikkuCore } from "core/NikkuCore";
export { EventCore } from "core/EventCore";
export { DatabaseCore } from "core/DatabaseCore";

export namespace Nikku {
    export type Core = NikkuCore;
    export type EventCore = eventCore;
    export type DatabaseCore = databaseCore;
    export let coreInstance: Core = new NikkuCore();
}
