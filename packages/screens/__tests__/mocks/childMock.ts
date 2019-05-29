import Screen from "../../src/structure/screen";

export default class ChildMock extends Screen {
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

  canClose() {
    this.logCall("canClose");
    return Promise.resolve(this.isCloseAllowed);
  }

  private logCall(name: string) {
    if (this.calls[name]) {
      this.calls[name]++;
    }
    else {
      this.calls[name] = 1;
    }
  }
}
