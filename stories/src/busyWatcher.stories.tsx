import { BusyWatcher, watchBusy } from "@frui.ts/screens";
import { action, makeObservable } from "mobx";
import { storiesOf } from "@storybook/react";
import { Observer } from "mobx-react-lite";
import React from "react";

class DebugBusyWatcher extends BusyWatcher {
  debug() {
    return Array.from(this.busyCounter.entries()).map(([key, value]) => ({
      key,
      value,
    }));
  }
}

class TestViewModel {
  busyWatcher = new DebugBusyWatcher();

  constructor() {
    makeObservable(this);
  }

  @action.bound
  @watchBusy
  defaultAction() {
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  @action.bound
  @watchBusy("foo")
  fooAction() {
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  @action.bound
  @watchBusy("bar")
  barAction() {
    return new Promise(resolve => setTimeout(resolve, 2000));
  }
}

const vm = new TestViewModel();

storiesOf("BusyWatcher", module)
  .addDecorator(story => <Observer>{() => story()}</Observer>)
  .add("Screen lifecycle", () => (
    <table>
      <tr>
        <th>Default</th>
        <td>
          <button onClick={vm.defaultAction}>Busy</button>
        </td>
        <td>{vm.busyWatcher.isBusy ? "BUSY" : ""}</td>
      </tr>
      <tr>
        <th>Foo</th>
        <td>
          <button onClick={vm.fooAction}>Busy</button>
        </td>
        <td>{vm.busyWatcher.checkBusy("foo") ? "BUSY" : ""}</td>
      </tr>
      <tr>
        <th>Bar</th>
        <td>
          <button onClick={vm.barAction}>Busy</button>
        </td>
        <td>{vm.busyWatcher.checkBusy("bar") ? "BUSY" : ""}</td>
      </tr>
      <tr>
        <th>Debug</th>
        <td colSpan={2}>
          {vm.busyWatcher.debug().map(({ key, value }, i) => (
            <React.Fragment key={typeof key !== "symbol" ? key : i}>
              <strong>{key.toString()}:</strong>
              <span>{value}</span>{" "}
            </React.Fragment>
          ))}
        </td>
      </tr>
    </table>
  ));
