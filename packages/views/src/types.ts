export interface ISelectItem {
  value: string | number;
  label: string;
}

export type ViewProps<TViewModel> = { vm: TViewModel };
export type ViewComponent<TViewModel> = React.FunctionComponent<ViewProps<TViewModel>>;
