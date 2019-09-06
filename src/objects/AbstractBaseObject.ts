import { ObjectConstructorData } from "./ObjectConstructorData";

export default abstract class AbstractBaseObject {

    private readonly name: string;

    public constructor(data: ObjectConstructorData) {
        this.name = data.name;
    }

    public getName(): string {
        return this.name;
    }

}
