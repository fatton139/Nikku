import { Message } from "discord.js";

import { CoreState, OnMessageState } from "../state";

export type UserSpecifiedFunction<T, S extends CoreState<Message> = OnMessageState> = (state: S, args: string[]) => T;

export type AsyncUserSpecifiedFunction<T, S extends CoreState<Message> = OnMessageState> = (
        state: S, args: string[],
    ) => Promise<T>;
