import { ManualPromise } from "@frui.ts/helpers";
import ScreenBase from "../../src/structure/screenBase";

export default class TestScreen extends ScreenBase {
  activated = 0;
  initialized = 0;
  deactivated = 0;

  stopOnActivate = false;
  stopOnDeactivate = false;

  private _activatePromise = new ManualPromise<any>();
  private _deactivatePromise = new ManualPromise<any>();

  onActivate() {
    this.activated++;

    if (this.stopOnActivate) {
      return this._activatePromise.promise;
    } else {
      return undefined;
    }
  }
  onInitialize() {
    this.initialized++;
  }
  onDeactivate() {
    this.deactivated++;

    if (this.stopOnDeactivate) {
      return this._deactivatePromise.promise;
    } else {
      return undefined;
    }
  }

  finishActivate() {
    this._activatePromise.resolve(undefined);
    this._activatePromise = new ManualPromise<any>();
  }

  finishDeactivate() {
    this._deactivatePromise.resolve(undefined);
    this._deactivatePromise = new ManualPromise<any>();
  }
}
