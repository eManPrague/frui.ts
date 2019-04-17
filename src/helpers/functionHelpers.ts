// tslint:disable-next-line: ban-types
export function bind<T>(func: T & Function, target: any): T {
    return func.bind(target);
}
