import { autorun, observable } from "mobx";

export default class ConfigViewModel {
    @observable public configuration: IConfigurationModel = {
        url: localStorage.getItem("apiUrl") || "https://redmine.dev.eman.cz",
        accessToken: localStorage.getItem("apiToken") || "",
    };

    private disposeAutorun = autorun(() => {
        const { url, accessToken } = this.configuration;

        localStorage.setItem("apiUrl", url);
        localStorage.setItem("apiToken", accessToken);

        (window as any).apiUrl = url;
        (window as any).apiToken = accessToken;
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
