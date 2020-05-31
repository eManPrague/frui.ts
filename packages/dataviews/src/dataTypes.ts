import { ReactNode } from "react";
import { IPagingFilter } from "@frui.ts/data";

export type PropertyKey<TItem> = keyof TItem & (string | number);

export interface ColumnDefinition<TItem, TProperty extends PropertyKey<TItem> = PropertyKey<TItem>> {
  title?: ReactNode;
  property?: TProperty;
  sortable?: boolean;

  // you can use either headerStyle and pass CSS styles, or provide headerFormatter to override the whole node
  headerStyle?: React.CSSProperties;
  headerFormatter?: (column: ColumnDefinition<TItem, TProperty>, key: React.Key) => ReactNode;

  // you can either use valueFormatter to format the value displayed, or cellFormatter to override the whole node
  valueFormatter?: (
    value: TItem[TProperty] | any | undefined, // if we remove any, TS is not able to infer type when multiple columns definitions are defined next to each other :-(
    item: TItem,
    column: ColumnDefinition<TItem, TProperty>
  ) => ReactNode;
  cellStyle?: React.CSSProperties;
  cellFormatter?: (
    value: TItem[TProperty] | any | undefined,
    item: TItem,
    column: ColumnDefinition<TItem, TProperty>,
    key: React.Key
  ) => ReactNode;
}

export interface PropsWithColumns<TItem> {
  columns: ColumnDefinition<TItem>[];
}

export interface PropsWithItems<TItem> {
  items: TItem[];
  itemKey: keyof TItem;
}

export interface DataTablePropsBase<TItem> extends PropsWithColumns<TItem>, PropsWithItems<TItem> {
  pagingFilter?: IPagingFilter;
  onColumnSort?: (column: ColumnDefinition<TItem>) => any;
}
