export interface ISelectItem {
  value: string | number;
  label: string;
}

export type View<TViewModel> = React.FunctionComponent<{ vm: TViewModel }>;
