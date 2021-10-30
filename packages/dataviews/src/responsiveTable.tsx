import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import DataList from "./dataList";
import type { DataTableProps } from "./dataTable";
import DataTable from "./dataTable";
import type { ResponsiveColumnDefinition } from "./dataTypes";
import { combineClassNames } from "@frui.ts/helpers";

function getWidth() {
  return document.body.clientWidth || document.documentElement.clientWidth || window.innerWidth;
}

export type ViewMode = "table" | "list";

export interface ResponsiveTableProps<TItem, TContext> extends DataTableProps<TItem, TContext> {
  columns: ResponsiveColumnDefinition<TItem, TContext>[];
  widthBreakpoint: number;
  listModeClassName?: string;
  onModeChanged?: (mode: ViewMode) => void;
}

const defaultProps: Omit<Partial<ResponsiveTableProps<any, any>>, "id" | "columns" | "context"> = {
  widthBreakpoint: 576,
  listModeClassName: "table-list-view",
};

function ResponsiveTableImpl<TItem, TContext>({
  widthBreakpoint,
  listModeClassName,
  onModeChanged,
  ...restProps
}: ResponsiveTableProps<TItem, TContext>) {
  const [mode, setMode] = useState<ViewMode>("table");

  useEffect(() => {
    const resizeHandler = () => {
      const newMode: ViewMode = getWidth() < widthBreakpoint ? "list" : "table";
      if (newMode !== mode) {
        onModeChanged?.(newMode);
        setMode(newMode);
      }
    };

    resizeHandler();
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  });

  if (mode === "list") {
    return <DataList {...restProps} className={combineClassNames(restProps.className, listModeClassName)} />;
  } else {
    return <DataTable {...restProps} />;
  }
}

ResponsiveTableImpl.defaultProps = defaultProps;
const ResponsiveTable = observer(ResponsiveTableImpl) as typeof ResponsiveTableImpl;

export default ResponsiveTable;
