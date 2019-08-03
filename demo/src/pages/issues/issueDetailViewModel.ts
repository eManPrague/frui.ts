import { IDetailViewModel } from "@frui.ts/datascreens";
import { Screen } from "@frui.ts/screens";

export default class IssueDetailViewModel extends Screen implements IDetailViewModel {
  isCreating: boolean;
  isEditing: boolean;
}
