import ScreenBase from "../../src/structure/screenBase";

type func = () => void;

export default class TestScreen extends ScreenBase {
  activated = 0;
  initialized = 0;
  deactivated = 0;

  stopOnActivate = false;
  stopOnDeactivate = false;

  private activateResolves: func[] = [];
  private deactivateResolves: func[] = [];

  onActivate() {
    this.activated++;

    if (this.stopOnActivate) {
      return new Promise(resolve => {
        this.activateResolves.push(resolve);
      });
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
      return new Promise(resolve => {
        this.deactivateResolves.push(resolve);
      });
    } else {
      return undefined;
    }
  }

  finishActivate() {
    const toCall = this.activateResolves;
    this.activateResolves = [];

    toCall.forEach(x => x());
  }

  finishDeactivate() {
    const toCall = this.deactivateResolves;
    this.deactivateResolves = [];

    toCall.forEach(x => x());
  }
}
