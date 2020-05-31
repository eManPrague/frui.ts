import { observer } from "mobx-react-lite";
import * as React from "react";
import { DataTablePropsBase } from "../dataTypes";
import TableHeader from "./tableHeader";
import TableRow from "./tableRow";

export interface DataTableProps<TItem> extends DataTablePropsBase<TItem> {
  className?: string;

  headerRowClassName?: string;
  headerCellClassName?: string;
}

function dataTable<TItem>(props: DataTableProps<TItem>) {
  return (
    <table className={props.className}>
      <thead>
        <TableHeader
          columns={props.columns}
          pagingFilter={props.pagingFilter}
          onColumnSort={props.onColumnSort}
          className={props.headerRowClassName}
          cellClassName={props.headerCellClassName}
        />
      </thead>
      <tbody>
        {props.items?.map(item => (
          <TableRow key={String(item[props.itemKey])} item={item} columns={props.columns} />
        ))}
      </tbody>
    </table>
  );
}

const DataTable = observer(dataTable) as typeof dataTable;
export default DataTable;
