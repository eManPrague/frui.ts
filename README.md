# Frui.ts
Frui.ts is a frontend framework using [MVVM](https://en.wikipedia.org/wiki/Model-view-viewmodel) design pattern for clean separation of concerns and long-term maintainability.

It allows ViewModel-first approach, which enables automated testing of complex workflows on the ViewModel level with no need to simulate actual user interaction with the UI.

This framework is designed to support both small and large applications with SOLID codebase. It is built on top of the [React](https://reactjs.org/) library, using [MobX](https://mobx.js.org/) and written in the modern TypeScript language.

## Motivation
We were not happy with the currently popular event-sourced state management, and that logic is still usually dependant on the presentation structure.
This is mainly caused by the nature of the applications that we usually develop: data-driven admin solutions with server backends.

From our point of view, event-sourced state management such as Redux for the presentation layer is quite hard to understand, makes the application hard to reason about, and requires a significant amount of boilerplate code. Take, for example, a simple master-detail screen with an edit form with validation - the code necessary for this ordinary scenario was a big issue for us. That's why we embrace the MVVM model, where the presentation state is handled by the view models.
Please note that we are not against event sourcing, especially on the backend side. That is an entirely different story!

Even though the application logic is usually separated from the presentation part, there are still many places where it leaks to the view code (e.g., navigation/routing, validation, etc.). As we see it, the existing solutions seem only to fix the symptoms, not the root cause. The cause is the View-first approach. If you start with views, they need to handle navigation, application structure, and so on, which should not be the responsibility of the views. That's why we wanted to start with View models, model the application from the logical point of view, and just after that project it to the actual user interface.

## Technical description
MVVM pattern heavily depends on data binding. One-way binding is quite usual in the web world, and we have decided to rely on [MobX](https://mobx.js.org/) with its observables and computed values for this purpose. Frui.ts also brings some custom features to make two-way binding possible.

The View part of MVVM should work only as a projection of data presented by the ViewModel, and thus we were looking for a markup framework with declarative syntax and strong IDE support. It might be surprising, but we have chosen [React](https://reactjs.org/). Mainly because it is widespread, has a strong community, there are many UI controls available, and it has great tooling support. However, React is used solely for the UI rendering part, there is no need for its advanced features such as Context, so it should be possible to replace it with any other framework.

Frui.ts is UI framework agnostic - you can use it with any UI framework that supports React. It is also independent of backend or API structure. However, it brings some build-in support for REST API and Bootstrap.

# Modules
Frui.ts comprises of several modules that you can use separately.

**View models**
 - [Screens](packages/screens/README.md)
 - [Data Screens](packages/datascreens/README.md)

**Views**
 - [Views](packages/views/README.md)
 - [Data](packages/data/README.md)

**Data**
 - [API client](packages/apiclient/README.md)

**Validation**
 - [Validation](packages/validation/README.md)
 - [Dirty checking](packages/dirtycheck/README.md)

**Shared helpers**
 - [Helpers](packages/helpers/README.md)

**UI components**
 - [Bootstrap](packages/bootstrap/README.md)
 - [HTML controls](packages/htmlcontrols/README.md)

## Examples

 - [Simple TODO list](examples/simpletodolist/README.md)
 - Complex application (TODO)

## Guidelines

 - Design the logic from ViewModels.
 - Cookbook (TODO)
