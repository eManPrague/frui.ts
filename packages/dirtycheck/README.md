# `@frui.ts/dirtycheck`

Dirty checking is based on the idea that dirty flag of a particular property of an entity can be handled as a computed value comparing the current value of the property with the value at the time of dirty check initialization. Dirty watcher is thus just a factory that is able to generate such computed properties.

This feature is usually used to indicate which UI fields have been changed during the current session and have not been saved yet.

A dirty checker not only maintains information about whether an entity is dirty, but also if the dirty flag should be displayed to the user (the `isDirtyFlagVisible` property). For example, you don't want to display dirty flags when creating a new entity. You can set the `isDirtyFlagVisible` property when instantiating / attaching a watcher or anytime later. The visibility is also turned on when `checkDirtyChanges()` is called for the first time.

## AutomaticDirtyWatcher

Dirty watcher that automatically observes target entity and handles respective dirty flags.

### Usage

```ts
// direct usage
const target = { firstName: "John" };
const watcher = new AutomaticDirtyWatcher(target, false);

let isTargetDirty = watcher.isDirty; // false
let isPropertyDirty = watcher.dirtyProperties.firstName; // false

target.firstName = "Jane";

isTargetDirty = watcher.isDirty; // true
isPropertyDirty = watcher.dirtyProperties.firstName; // true

watcher.reset();

isTargetDirty = watcher.isDirty; // false
isPropertyDirty = watcher.dirtyProperties.firstName; // false
```

```ts
// with helpers
import {
  attachAutomaticDirtyWatcher,
  isDirty,
  hasVisibleDirtyChanges,
  checkDirtyChanges,
  resetDirty
} from "@frui.ts/dirtycheck";

const target = { firstName: "John" };
attachAutomaticDirtyWatcher(target);

// you can also use:
// const target = attachAutomaticDirtyWatcher({ firstName: "John" });

let dirty = isDirty(target); // false
dirty = isDirty(target, "firstName"); // false

let dirtyDisplayed = hasVisibleDirtyChanges(target); // false

target.firstName = "Jane";

dirty = isDirty(target); // true
dirty = isDirty(target, "firstName"); // true
dirtyDisplayed = hasVisibleDirtyChanges(target); // false!! - the entity is dirty but it is not indicated yet (e.g., UI for new entities)

dirty = checkDirtyChanges(target); // true - sets isDirtyFlagVisible to true and returns isDirty value

dirtyDisplayed = hasVisibleDirtyChanges(target); // true

resetDirty(target);

dirty = isDirty(target); // false
dirty = isDirty(target, "firstName"); // false
dirtyDisplayed = hasVisibleDirtyChanges(target); // false
```

## ManualDirtyWatcher

Implements the interface `IDirtyWatcher` but you have to manually set dirty flags on properties.

### Usage

```ts
// direct usage
const target = { firstName: "John" };
const watcher = new ManualDirtyWatcher(target, false);

watcher.setDirty("firstName");

let isTargetDirty = watcher.isDirty; // true
let isPropertyDirty = watcher.dirtyProperties.firstName; // true

watcher.reset();

isTargetDirty = watcher.isDirty; // false
isPropertyDirty = watcher.dirtyProperties.firstName; // false
```

```ts
// with helpers
import {
  attachManualDirtyWatcher,
  isDirty,
  hasVisibleDirtyChanges,
  setDirty,
  checkDirtyChanges,
  resetDirty
} from "@frui.ts/dirtycheck";

const target = { firstName: "John" };
attachManualDirtyWatcher(target);

// you can also use:
// const target = attachManualDirtyWatcher({ firstName: "John" });

let dirty = isDirty(target); // false
dirty = isDirty(target, "firstName"); // false

let dirtyDisplayed = hasVisibleDirtyChanges(target); // false

setDirty(target, target, "firstName");

dirty = isDirty(target); // true
dirty = isDirty(target, "firstName"); // true
dirtyDisplayed = hasVisibleDirtyChanges(target); // false!! - the entity is dirty but we don't want to indicate that (e.g., UI for new entities)

dirty = checkDirtyChanges(target); // true - it enables the visibility of dirty changes and returns isDirty value

dirtyDisplayed = hasVisibleDirtyChanges(target); // true

resetDirty(target);

dirty = isDirty(target); // false
dirty = isDirty(target, "firstName"); // false
dirtyDisplayed = hasVisibleDirtyChanges(target); // false

```
