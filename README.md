<img src="logomanual/color/fruits_logo_horizontal_color.svg" alt="logo" height="100" />

Frui.ts is a frontend framework using [MVVM](https://en.wikipedia.org/wiki/Model-view-viewmodel) design pattern for clean separation of concerns and long-term maintainability.

It allows **ViewModel-first** approach, which enables automated testing of complex workflows on the ViewModel level with no need to simulate actual user interaction with the UI.

This framework is designed to support both small and large applications with SOLID codebase. It is built on top of the [React](https://reactjs.org/) library, using [MobX](https://mobx.js.org/) and written in the modern TypeScript language.

You can read our [business overview](OVERVIEW.md) or jump to the [documentation](#quick-documentation-links).

> ## Please note that this is legacy documentation for v0.x versions. Check the master branch for the latest information.

# Quick documentation links

- [Guidelines](GUIDELINES.md)
- [Troubleshooting](TROUBLE.md)
- [API client](packages/apiclient/README.md)
- [CRA template](packages/cra-template/README.md)
- [Data](packages/data/README.md)
- [Data Screens](packages/datascreens/README.md)
  - [DetailViewModel](packages/datascreens/README.md#detailviewmodel)
  - [ListViewModel](packages/datascreens/README.md#listviewmodel)
  - [FilteredListViewModel](packages/datascreens/README.md#filteredlistviewmodel)
- [Data Views](packages/dataviews/README.md)
- [Dirty Check](packages/dirtycheck/README.md)
  - [AutomaticDirtyWatcher](packages/dirtycheck/README.md#automaticdirtywatcher)
  - [ManualDirtyWatcher](packages/dirtycheck/README.md#manualdirtywatcher)
- [Generator](packages/generator/README.md)
  - [Inversify configuration](packages/generator/README.md#inversify-configuration)
  - [Views registration](packages/generator/README.md#views-registration)
  - [OpenApi entities](packages/generator/README.md#openapi-entities)
- [Helpers](packages/helpers/README.md)
- [Screens](packages/screens/README.md)
  - [Busywatcher](packages/screens/README.md#busywatcher)
  - [Navigation overview](packages/screens/README.md#navigation)
  - [Router](packages/screens/README.md#4-generate-local-navigation-links)
  - [UrlNavigationAdapter](packages/screens/README.md#urlnavigationadapter)
  - [View models](packages/screens/README.md#screens)
- [Validation](packages/validation/README.md)
  - [AutomaticEntityValidator](packages/validation/README.md#automaticentityvalidator)
  - [ManualEntityValidator](packages/validation/README.md#manualentityvalidator)
- [Views](packages/views/README.md)
  - [BindingComponent](packages/views/README.md#bindingcomponent)
  - [View discovery](packages/views/README.md#view-discovery)

# Why should you use Frui.ts?

Because you can write this:

`model.ts` - define your model or entities, define validation rules

```ts
interface ICustomer {
  id: number;
  firstName: string;
  lastName: string;
  categoryId: number;
}

const CustomerValidationRules = {
  firstName: { maxLength: 35 },
  lastName: { required: true, maxLength: 35 },
  categoryId: { required: true },
};
```

`viewModel.ts` - write only the code that actually makes sense

```ts
class CustomerViewModel {
  categories = [
    { id: 1, name: "Premium" },
    { id: 2, name: "Standard" },
  ];

  @observable customer: ICustomer;

  constructor(private customerId, private repository: ICustomersRepository) {}

  async onInitialize() {
    this.customer = await this.repository.loadCustomer(this.customerId);
    attachAutomaticValidator(this.customer, CustomerValidationRules);
  }

  get canSave() {
    return isValid(this.customer);
  }

  @action.bound
  async save() {
    await this.repository.updateCustomer(this.customerId, this.customer);
  }
}
```

`view.tsx` - declare how the VM should be presented

```tsx
const customerView: ViewComponent<CustomerViewModel> = observer(({ vm }) => (
  <form>
    {/* Note the two-way binding here, autocomplete works for 'target' and 'property' properties */}
    <Input target={vm.customer} property="firstName" label="First name" />
    <Input target={vm.customer} property="lastName" label="Last name" />
    <Select
      target={vm.customer}
      property="categoryId"
      label="Category"
      items={vm.categories}
      keyProperty="id"
      textProperty="name"
      mode="key"
    />

    {/* The button will be enabled/disabled as the input values change */}
    <Button onClick={vm.save} disabled={!vm.canSave}>
      Save
    </Button>
  </form>
));

registerView(customerView, CustomerViewModel);
```

## Motivation

We were not happy with the currently popular event-sourced state management, and that logic is usually dependent on the presentation structure.
This is mainly caused by the nature of the applications that we usually develop: **data-driven admin solutions** with server backends.

From our point of view, using event-sourced state management such as Redux for the presentation layer is usually quite complex, makes the application hard to reason about, and requires a significant amount of boilerplate code. For example, take a simple master-detail screen with an edit form and validation - the code necessary for this ordinary scenario was a big issue for us. That's why we embrace the MVVM model, where ViewModels handle the presentation state.
Please note that we are not against event sourcing, especially on the backend side. That is an entirely different story!

Even though the application logic is usually separated from the presentation part, there are still many places where it leaks to the view code (e.g., navigation/routing, validation, etc.). As we see it, existing solutions seem only to fix the symptoms, not the root cause. The cause is the View-first approach. If you start with views, you need to handle navigation, application structure, and so on in views, which should not be their responsibility. That's why we wanted to **start with ViewModels**, thus model the application from the logical point of view, and just after that project it to the actual user interface.

## Technical description

MVVM pattern heavily depends on data binding. One-way binding is quite usual in the web world, and we have decided to rely on [MobX](https://mobx.js.org/) with its observables and computed values for this purpose. Frui.ts also brings some custom features to make **two-way binding** possible.

The View part of MVVM should work only as a projection of data presented by the ViewModel, and thus we were looking for a markup framework with declarative syntax and strong IDE support. It might be surprising, but we have chosen [React](https://reactjs.org/). Mainly because it is widespread, has a strong community, there are many UI controls available, and it has great tooling support. However, React is used solely for the UI rendering part, there is no need for its advanced features such as Context, so it should be possible to replace it with any other framework.

Frui.ts is **UI framework agnostic** - you can use it with any UI framework (such as [React Bootstrap](https://react-bootstrap.github.io/) or [Material UI](https://material-ui.com/)) that supports React. It is also independent of backend or API structure. However, it brings some build-in support for REST API and Bootstrap.

# Modules

Frui.ts is not a platform like, e.g., Angular - it does not force you to do your work in one particular way. It is a set of tools and helpers you can use to simplify your job. It comprises of several modules that you can use **separately**.

**View models**

- [Screens](packages/screens/README.md) - components for application structure, navigation, etc. For example, `ScreenBase`, `ConductorSingleChild`, `Busywatcher`, `Router`.
- [Data Screens](packages/datascreens/README.md) - base classes for data-focused applications. For example, `FilteredListViewModel`, `DetailViewModel`.

**Views**

- [Views](packages/views/README.md) - components for binding UI to ViewModels. For example, `BindingComponent`, `View`.
- [Data](packages/data/README.md) - helper functions for rendering data. For example, `IPagingFilter`, `pageChangedHandler`.
- [Data Views](packages/dataviews/README.md) - higher-order components for displaying data. For example, `DataTable`, `DataRepeater`.

**Data**

- [API client](packages/apiclient/README.md) - abstraction over network calls and fluent request builder. For example, `FetchApiConnector`, `RestRequestBuilder`.

**Validation**

- [Validation](packages/validation/README.md) - standalone solution for MobX-based entity validation.
- [Dirty checking](packages/dirtycheck/README.md) - standalone solution for MobX-based dirty check flags.

**Helpers**

- [CRA template](packages/cra-template/README.md) - Create React App template
- [Generator](packages/generator/README.md) - code generator for saving time in typical scenarios.
- [Helpers](packages/helpers/README.md) - shared helper functions used on various places in Frui.ts. For example, `@bound`, `createMap`, `nameof`.

**UI components**

- [Bootstrap](packages/bootstrap/README.md) - UI components suporting two-way binding based on [React Bootstrap](https://react-bootstrap.github.io/), For example, `Input`, `Select`, `Check`, `ValidationControlBase`.
- [HTML controls](packages/htmlcontrols/README.md) - UI components suporting two-way binding based on plain HTML controls. For example, `Textbox`, `Checkbox`.

## Examples

- [Simple TODO list](examples/simpletodolist/README.md)
- [Complex application](examples/complexdemo/README.md)
