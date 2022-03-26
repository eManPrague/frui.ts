import "./style.css";
import { isSet } from "@frui.ts/helpers";

const app = document.querySelector<HTMLDivElement>("#app")!;

debugger;
if (isSet({})) {
  console.log("isSet");
}

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`;
