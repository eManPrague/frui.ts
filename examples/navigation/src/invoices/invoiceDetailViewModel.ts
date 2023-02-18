import type { IViewModel, NavigationContext } from "@frui.ts/views";
import { makeObservable, observable, runInAction } from "mobx";

type ParamsScheme = Record<"invoiceId", string>;

export default class InvoiceDetailViewModel implements IViewModel<ParamsScheme> {
  @observable
  id = -1;

  constructor() {
    makeObservable(this);
  }

  onNavigate({ params }: NavigationContext<ParamsScheme>) {
    runInAction(() => {
      this.id = +params.invoiceId;
    });
  }
}
