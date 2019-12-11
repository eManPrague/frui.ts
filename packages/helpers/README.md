# `@frui.ts/helpers`

Helper functions for various use cases.

## `@bound`

A function decorator that binds context of the function to the parent class. This is useful for direct use of the function as event handler `<Xxx onClick={vm.decoratedFunction} />` so that new anonymous functions are not allocated for each render (compare to `<Xxx onClick={() => vm.decoratedFunction()} />`).

### Usage

```ts
// in view model
class MyViewModel {
  @bound someAction() {
    // you can safely use 'this' here
  }
}

// in view
<button onClick={vm.someAction} />
```

## `createMap`

Helper function for easily creating Maps.

### Usage

```ts
const items = [
  { id: 1, name: "One" },
  { id: 2, name: "Two" },
  { id: 3, name: "Three" },
];

// map of items by key
const itemsById = createMap(items, x => x.id); // Map<number, { id, name }>

// map of values by key
const namesById = createMap(items, x => x.id, x => x.name); // Map<number, string>
```

## `nameof`

Syntactic sugar for creating strings that are also a key of a type.

### Usage

```ts
this.pagingFilter.sortColumn = nameof<User>("login"); // the same as ="login", but checked on compile time that the class 'User' actually has a 'login' field
```
