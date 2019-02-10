import { IObjectConstructorData } from "./IObjectConstructorData";

export default abstract class AbstractBaseObject {

    private readonly name: string;

    public constructor(data: IObjectConstructorData) {
        this.name = data.name;
    }

    public getName(): string {
        return this.name;
    }

}
