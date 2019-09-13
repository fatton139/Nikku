import * as Nikku from "./core";

/**
 * Exports here are made available to users and/or external APIs.
 * Standard users should avoid direct imports from the inner codebase.
 */

export const start = (initializer: Nikku.CoreInitializer): void => {
    new Nikku.NikkuCore(initializer).startMainProcesses();
};

export type CoreInitializerT = Nikku.CoreInitializer;
