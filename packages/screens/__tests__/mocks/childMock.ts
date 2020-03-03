import ScreenBase from "../../src/structure/screenBase";

export default class ChildMock extends ScreenBase {
  calls: Record<string, number> = {};
  isCloseAllowed = true;

  activate() {
    this.logCall("activate");
    return super.activate();
  }

  deactivate(close: boolean) {
    this.logCall("deactivate");
    return super.deactivate(close);
  }

  canDeactivate() {
    this.logCall("canDeactivate");
    return Promise.resolve(this.isCloseAllowed);
  }

  private logCall(name: string) {
    if (this.calls[name]) {
      this.calls[name]++;
    } else {
      this.calls[name] = 1;
    }
  }
}
