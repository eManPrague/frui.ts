import { useViewModel } from "@frui.ts/views";
import { Observer } from "mobx-react-lite";
import React from "react";
import SettingsViewModel from "./settingsViewModel";

export function Settings() {
  const { vm } = useViewModel(() => new SettingsViewModel(), {}, []);

  return (
    <p>
      <Observer>{() => <span>{vm.text}</span>}</Observer>
    </p>
  );
}
