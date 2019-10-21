export interface ISelectItem {
  value: string | number;
  label: string;
}

export type ViewComponent<TViewModel> = React.FunctionComponent<{ vm: TViewModel }>;
