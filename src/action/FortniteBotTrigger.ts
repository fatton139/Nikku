import { FortniteBotAction } from "./FortniteBotAction";

export class FortniteBotTrigger extends FortniteBotAction {
    public constructor(trigger: () => boolean) {
        super(0, trigger);
    }
    public execute(): boolean {
        return super.execute(null, null);
    }
}
