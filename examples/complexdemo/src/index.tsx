import "reflect-metadata";
import { runApp } from "./app";
import createContainer from "./di.config";
import * as serviceWorker from "./serviceWorker";
import "./views";

const container = createContainer();
runApp(container);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
