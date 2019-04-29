import { computed, observable } from "mobx";
import FilteredListViewModel from "./filteredListViewModel";
import { IDetailViewModel } from "./types";

export default abstract class ListDetailViewModel<TEntity, TFilter, TDetail extends IDetailViewModel>
  extends FilteredListViewModel<TEntity, TFilter> {
  @observable public detail: TDetail;

  @computed public get hasDetail() {
    return !!this.detail;
  }
}
