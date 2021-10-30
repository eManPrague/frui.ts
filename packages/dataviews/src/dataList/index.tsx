import { observer } from "mobx-react-lite";
import React from "react";
import type { DataTableProps } from "../dataTable";
import type { ResponsiveColumnDefinition } from "../dataTypes";
import DataListRow from "./dataListRow";

export interface DataListProps<TItem, TContext> extends DataTableProps<TItem, TContext> {
  columns: ResponsiveColumnDefinition<TItem, TContext>[];
}

const defaultProps: Omit<Partial<DataListProps<any, any>>, "id" | "columns" | "context"> = {};

function DataListImpl<TItem, TContext>(props: DataListProps<TItem, TContext>) {
  return (
    <table id={props.id} className={props.className}>
      {props.items.map(item => (
        <DataListRow key={String(item[props.itemKey])} item={item} columns={props.columns} context={props.context} />
      ))}
    </table>
  );
}

DataListImpl.defaultProps = defaultProps;
const DataList = observer(DataListImpl) as typeof DataListImpl;

export default DataList;
