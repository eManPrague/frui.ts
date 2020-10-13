# `@frui.ts/datascreens`

This package contains base classes for data-centric view models.

- `ListViewModel`
- `FilteredListViewModel`
- `DetailViewModel`

![Classes hierarchy](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/eManPrague/frui.ts/develop/packages/datascreens/classes.puml)

## `ListViewModel`

Base class for master lists in master-detail scenarios.

- `items` - read currently displayed data rows from here. You can also manually put the data there.
- `currentPaging` - paging information related to the data in `items`, usually used by a pager control
- `setData([items, paging])` - use this function to set `items` and `currentPaging` in one step.

#### Example

```ts
async loadData() {
  const data = await this.someRepository.getSomeData();
  this.setData(data);
}

// without async
loadData() {
  return this.someRepository.getSomeData().then(this.setData);
}

```

## `FilteredListViewModel`

This base class adds some filter-related logic on top of `ListViewModel`:

- `pagingFilter` - bind paging and sorting UI to this observable property
- `filter` - bind filter UI controls to this observable property

- `appliedFilter` - a snapshot of `filter` that should be used for loading new data
- `applyFilter()` - validates the current `filter` and if valid, resets dirty flags on it and stores a snapshot into `appliedFilter`
- `loadData()` - implement this function to load actual data based on `pagingFilter` and `appliedFilter` properties. Call this function when the user changes paging/sorting.

- `applyFilterAndLoad()` - bind 'search / filter' UI button to this function. It calls `applyFilter()` and `loadData()`.

- `resetFilterValues(filter)` - implement this function so that it applies default values to the filter passed as an argument. Note that this function should not have any side effects.
- `resetFilter()` - bind 'clear filter' UI button to this function. It calls `resetFilterValues(filter)` and `applyFilter()`.
- `resetFilterAndLoad()` - bind 'reset filter' UI button to this function. It calls `resetFilter()` and `loadData()`.

The reason for the two properties for a filter is that if a user changes a filter/search field without committing the filter by clicking a Load/Search button, changing the actual page should load the data with the original filter values, not the current work-in-progress one.

You don't need to initialize the filters manually. The constructor automatically creates default `pagingFilter` and calls `resetFilterValues(filter)`.

If needed, you can attach a validator to `filter` in the constructor. There is no filter validation by default.

#### Example

```html
<TextBox target="{vm.filter}" property="firstName" />
<button onClick="{vm.applyFilterAndLoad}">Load</button>
<button onClick="{vm.resetFilterAndLoad}">Reset</button>

<DataTable items="{vm.items}" />

<Pager itemsPerPage={vm.currentPaging.limit} totalItems={vm.currentPaging.totalItems}
activePage={Math.ceil(vm.currentPaging.offset / vm.currentPaging.limit) + 1} />
```

## `ContinuousListViewModel`

This base class updates the logic of `setData` to support appending the new data to the existing list of items.

TODO

## `DetailViewModel`

### Useful functionality

- `busyWatcher` - already initialized instance of `busyWatcher` for long-running process indication. It is automatically picked when using the `@watchBusy` decorator on class functions.
- `loadDetail()` - implement this function and return the detail entity for the view model. It is automatically called during view model initialize stage, and the returned value is assigned to the `item` property

- `item` - bind UI to this property containing the entity loaded by `loadDetail()`
- `setItem(item)` - call this helper function to manually set `item` later
