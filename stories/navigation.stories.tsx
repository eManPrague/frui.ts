import ConductorOneChildActive from "@src/lifecycle/conductorOneChildActive";
import View from "@src/views/view";
import { storiesOf } from "@storybook/react";
import { Observer } from "mobx-react-lite";
import * as React from "react";
import AllChildrenActiveViewModel from "./viewModels/allChildrenActiveViewModel";
import OneChildActiveViewModel from "./viewModels/oneChildActiveViewModel";
import SingleChildViewModel from "./viewModels/singleChildViewModel";
import "./views/childView";

// tslint:disable: jsx-no-lambda
storiesOf("Navigation", module)
  .add("Path", () => {
    const rootViewModel = new ConductorOneChildActive<any>();
    rootViewModel.navigationName = "";

    const module1 = new SingleChildViewModel();
    module1.name = "Module 1";
    module1.navigationName = "ModuleOne";
    const module2 = new OneChildActiveViewModel();
    module2.name = "Module 2";
    module2.navigationName = "ModuleTwo";
    const module3 = new AllChildrenActiveViewModel();
    module3.name = "Module 3";
    module3.navigationName = "ModuleThree";

    rootViewModel.items.push(module1, module2, module3);
    rootViewModel.activate();

    return <div>
      <h2>Demo navigation</h2>
      <Observer>{() =>
        <React.Fragment>
          {rootViewModel.items.map(x => <button key={x.name} onClick={() => rootViewModel.activateItem(x)}>{x.name}</button>)}
        </React.Fragment>}
      </Observer>

      <Observer>{() => !rootViewModel.activeItem ? null :
        <div>
          <h3>{rootViewModel.activeItem.name}</h3>
          <View vm={rootViewModel.activeItem} />
        </div>
      }</Observer>
    </div>;
  });
