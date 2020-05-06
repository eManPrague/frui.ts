import { registerView, ViewComponent } from "@frui.ts/views";
import { observer } from "mobx-react-lite";
import React from "react";
import InitializationService from "../services/initializationService";

const initializationView: ViewComponent<InitializationService> = observer(({ vm }) => {
  return (
    <div className="wrapper-spinner">
      <span className="sr-only">Loading...</span>
    </div>
  );
});

registerView(initializationView, InitializationService);
