import { bound } from "@frui.ts/helpers";
import { ScreenBase } from "@frui.ts/screens";
import DemoRepository from "repositories/demoRepository";

export default class DemoViewModel extends ScreenBase {
  constructor(private repository: DemoRepository) {
    super();
    this.navigationName = "module";
    this.nameValue = "First Frui.ts module";
  }

  @bound
  async loadData() {
    const data = await this.repository.fetchData();

    alert(data);
  }
}
