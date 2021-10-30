import { observer } from "mobx-react-lite";
import React from "react";
import type { ResponsiveColumnDefinition } from ".";
import "./responsiveTableHeaders.scss";

/*
Responsive table headers HOWTO:
 0. Customize the breakpoint for collpased view in both ./responsiveTableHeaders.scss and ResponsiveTableHeaders.defaultProps.
 1. Wrap the <DataTable> inside <ResponsiveTableHeaders id="someID" columns={columns} context={tableContext}>
 2. Use `responsiveTitle` or `responsiveTitleFactory` to customize label used in the collapsed view
 3. Use `cellClassName: "responsive-hidden"` on a column you want to hide in the collapsed view
 4. Use `cellClassName: "responsive-no-label"` on a column you want to be displayed without a label (and with full width)
 5. Use `className="btn-responsive-block"` on a button to be displayed as block only within the collapsed view
*/

export interface ResponsiveTableHeadersProps<TItem, TContext> {
  id: string;
  columns: ResponsiveColumnDefinition<TItem, TContext>[];
  context: TContext;

  className?: string;
  mediaQuery?: string;
}

const defaultProps: Omit<Partial<ResponsiveTableHeadersProps<any, any>>, "id" | "columns" | "context"> = {
  mediaQuery: "@media only screen and (max-width: 576px) ",
};

function getStyleWithHeaders(id: string, headers: string[], mediaQuery?: string) {
  const headerStyles = headers
    .map((label, index) => `#${id} td:nth-of-type(${index + 1})::before { content: "${headers[index]}"; }`)
    .join(" ");

  return mediaQuery ? `${mediaQuery} { ${headerStyles} }` : headerStyles;
}

function responsiveTableHeaders<TItem, TContext>(props: React.PropsWithChildren<ResponsiveTableHeadersProps<TItem, TContext>>) {
  const columnHeaders: string[] = props.columns.map(column =>
    column.responsiveTitle === false
      ? ""
      : column.responsiveTitleFactory?.(props.context) ??
        column.responsiveTitle ??
        column.titleFactory?.(props.context)?.toString() ??
        column.title?.toString() ??
        ""
  );

  return (
    <>
      <style
        scoped
        dangerouslySetInnerHTML={{
          __html: getStyleWithHeaders(props.id, columnHeaders),
        }}
      />
      {props.children && (
        <div className={props.className} id={props.id}>
          {props.children}
        </div>
      )}
    </>
  );
}

responsiveTableHeaders.defaultProps = defaultProps;
const ResponsiveTableHeaders = observer(responsiveTableHeaders) as typeof responsiveTableHeaders;

export default ResponsiveTableHeaders;
