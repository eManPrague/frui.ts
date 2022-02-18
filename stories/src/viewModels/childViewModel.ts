import { ScreenBase, SimpleScreenNavigator } from "@frui.ts/screens";

export default class ChildViewModel extends ScreenBase<SimpleScreenNavigator<ChildViewModel, any>> {
  name: string;
  text: string;

  constructor(navigationName: string, name: string) {
    super();
    this.name = name;
    this.text = `This is content of Child View Model ${this.name}`;

    this.navigator = new SimpleScreenNavigator<ChildViewModel, any>(this, navigationName);

    this.events.on("onNavigate", context => console.log("onNavigate", this, context));
    this.events.on("onInitialize", context => console.log("onInitialize", this, context));
    this.events.on("onActivate", context => console.log("onActivate", this, context));
    this.events.on("onDeactivate", context => console.log("onDeactivate", this, context));
  }
}
