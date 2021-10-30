import type { IPagingFilter } from "@frui.ts/data";

import type { ReactNode } from "react";
import type React from "react";

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

  // you can use either headerClassName and pass CSS class, or provide headerFormatter to override the whole node
  headerClassName?: string;
  headerFormatter?: (props: ColumnRenderProps<TItem, TContext, TProperty> & KeyRenderProps) => ReactNode;

  // you can either use valueFormatter to format the value displayed, or cellFormatter to override the whole node
  valueFormatter?: (props: ValueRenderProps<TItem, TContext, TProperty>) => ReactNode;
  cellClassName?: string;
  cellFormatter?: (props: ValueRenderProps<TItem, TContext, TProperty> & KeyRenderProps) => ReactNode;
  cellProps?: (props: ValueRenderProps<TItem, TContext, TProperty>) => any;
}

export interface ResponsiveColumnDefinition<TItem, TContext> extends ColumnDefinition<TItem, TContext> {
  responsiveTitle?: string | false;
  responsiveTitleFactory?: (context: TContext) => string;
  responsiveVisible?: boolean;
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
  id?: string;
  pagingFilter?: IPagingFilter;
  onColumnSort?: (column: ColumnDefinition<TItem, TContext>) => any;
  displayHeader?: boolean;
}
