import { IPagingFilter } from "@frui.ts/data";
import { ReactNode } from "react";

export type PropertyKey<TItem> = keyof TItem & (string | number);

export interface KeyRenderProps {
  key: React.Key;
}

export interface ColumnRenderProps<TItem, TContext, TProperty extends PropertyKey<TItem>> {
  column: ColumnDefinition<TItem, TContext, TProperty>;
  context: TContext;
}

export interface ValueRenderProps<TItem, TContext, TProperty extends PropertyKey<TItem>>
  extends ColumnRenderProps<TItem, TContext, TProperty> {
  value?: TItem[TProperty] | any; // if we remove any, TS is not able to infer type when multiple columns definitions are defined next to each other :-(
  item: TItem;
}

export interface ColumnDefinition<TItem, TContext = any, TProperty extends PropertyKey<TItem> = PropertyKey<TItem>> {
  title?: ReactNode;
  titleFactory?: (context: TContext) => ReactNode;
  property?: TProperty;
  sortable?: boolean;

  // you can use either headerStyle and pass CSS styles, or provide headerFormatter to override the whole node
  headerStyle?: React.CSSProperties;
  headerFormatter?: (props: ColumnRenderProps<TItem, TContext, TProperty> & KeyRenderProps) => ReactNode;

  // you can either use valueFormatter to format the value displayed, or cellFormatter to override the whole node
  valueFormatter?: (props: ValueRenderProps<TItem, TContext, TProperty>) => ReactNode;
  cellStyle?: React.CSSProperties;
  cellFormatter?: (props: ValueRenderProps<TItem, TContext, TProperty> & KeyRenderProps) => ReactNode;
}

export interface PropsWithColumns<TItem, TContext> {
  columns: ColumnDefinition<TItem, TContext>[];
  context: TContext;
}

export interface PropsWithItems<TItem> {
  items: TItem[];
  itemKey: keyof TItem;
}

export interface DataTablePropsBase<TItem, TContext> extends PropsWithColumns<TItem, TContext>, PropsWithItems<TItem> {
  pagingFilter?: IPagingFilter;
  onColumnSort?: (column: ColumnDefinition<TItem, TContext>) => any;
  displayHeader?: boolean;
}
