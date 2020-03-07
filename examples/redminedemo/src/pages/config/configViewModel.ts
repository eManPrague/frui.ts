import { autorun, observable } from "mobx";

export default class ConfigViewModel {
  @observable configuration: IConfigurationModel = {
    url: localStorage.getItem("apiUrl") || "https://redmine.anon.eman.cz",
    accessToken: localStorage.getItem("apiToken") || "",
  };

  private disposeAutorun = autorun(() => {
    const { url, accessToken } = this.configuration;

    localStorage.setItem("apiUrl", url);
    localStorage.setItem("apiToken", accessToken);

    (window as any).apiUrl = url;
    (window as any).apiToken = accessToken;
  });

  dispose() {
    console.log("disposing configViewModel");
    this.disposeAutorun();
  }
}

export interface IConfigurationModel {
  accessToken: string;
  url: string;
}
