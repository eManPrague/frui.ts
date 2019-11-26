# `@frui.ts/datascreens`

This package contains base classes for data-centric view models.

- `FilteredListViewModel`
- `ListViewModel`
- `DetailViewModel`

## `FilteredListViewModel`

This base class contains several core properties and functions:

- `pagingFilter: IPagingFilter` - contains information about the actual page and sorting
- `filter: TFilter` - observable object for binding UI filter form to
- `appliedFilter` - commited filter that should be used when loading data

- `loadData(): Promise | void` - loads actual data based on `pagingFilter` and `appliedFilter`

- `resetFilter(filter: TFilter): void` - applies default values to the filter object

The reason for two properties for filter is that if a user changes a filter/search field without commiting the filter by clicking a Load/Search button, changing actual page should load the data with the original filter values, not the current work-in-progress one.

There are also helper functions that cover often used combinations:

- `applyFilterAndLoad()` - used for the Filter/Search/Load button
- `resetFilterAndLoad()` - used for the Reset button

## Usage

```
// TODO: DEMONSTRATE API
```
