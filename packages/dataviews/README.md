# `@frui.ts/dataViews`

View components for data display

`DataRepeater` - generic structure for rendering data in a grid format. It supports sorting by column and custom value formatters as well.

`DataTable` - similar to DataRepeater, but renders ordinary html `<table>` by default.

## Example

```tsx
// in your View
import { ColumnDefinition, DataTable } from "@frui.ts/dataviews";

const tableColumns: ColumnDefinition<MyEntity, MyContext>[] = [
  {
    title: "id",
    property: "id",
    valueFormatter: x => `(${x.value})`
  },
  {
    titleFactory: (context) => {context.localize("name")},
    property: "name",
    sortable: true,
  }
];

...

<DataTable items={vm.items} itemKey="id" columns={tableColumns} context={vm} />

```

You can check [ColumnDefinition](./src/dataTypes.ts) for more details.

## Styles

You can also use default CSS styles for table column headers supporting sorting:

```tsx
import "@frui.ts/dataviews/styles/sorting-header.scss";
```
