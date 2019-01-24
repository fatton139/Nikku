export interface ICoreState<T> {
    getHandle(): T;
    setHandle(obj: T): void;
}
