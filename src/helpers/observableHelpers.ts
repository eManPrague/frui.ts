import { extendObservable, isObservable, set } from "mobx";

export function ensureObservableProperty(target: any, property: string, value?: any) {
    if (!isObservable(target)) {
        extendObservable(target, {});
    }

    if (value !== undefined) {
        set(target, property, value);
    }
}
