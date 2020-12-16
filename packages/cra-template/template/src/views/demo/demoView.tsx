import { registerView, ViewComponent } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import React from "react";
import DemoViewModel from "../../viewModels/demo/demoViewModel";

const ModuleView: ViewComponent<DemoViewModel> = observer(({ vm }) => {
  return (
    <>
      <h1>{vm.name}</h1>
      <p>Happy hacking with Frui.ts</p>
      <button onClick={() => vm.loadData()}>Say Hi!</button>
    </>
  );
});

registerView(ModuleView, DemoViewModel);
