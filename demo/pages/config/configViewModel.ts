import { autorun, observable } from "mobx";

export default class ConfigViewModel {
    @observable public configuration: IConfigurationModel = {
        accessToken: "",
        url: "https://redmine.dev.eman.cz",
    };

    private disposeAutorun = autorun(() => {
        (window as any).apiToken = this.configuration.accessToken;
        (window as any).apiUrl = this.configuration.url;
    });

    public dispose() {
// tslint:disable-next-line: no-console
        console.log("disposing configViewModel");
        this.disposeAutorun();
    }
}

export interface IConfigurationModel {
    accessToken: string;
    url: string;
}
