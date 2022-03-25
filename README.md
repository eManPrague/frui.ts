<img src="logomanual/color/fruits_logo_horizontal_color.svg" alt="logo" height="100" />

Frui.ts is a frontend framework using [MVVM](https://en.wikipedia.org/wiki/Model-view-viewmodel) design pattern for clean separation of concerns and long-term maintainability.

It allows **ViewModel-first** approach, which enables automated testing of complex workflows on the ViewModel level with no need to simulate actual user interaction with the UI.

This framework is designed to support both small and large applications with SOLID codebase. It is built on top of the [React](https://reactjs.org/) library, using [MobX](https://mobx.js.org/) and written in the modern TypeScript language.

> ## Jump to the [wiki](https://github.com/eManPrague/frui.ts/wiki) for detailed documentation.

---

# Why should you use Frui.ts?

Because you structure you application into Models, Views, and ViewModels:

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

# Modules

Frui.ts is a set of tools and helpers you can use to simplify your job. It consist of several packages that you can use **separately**. Togheter they creates MVVM framework for build frontend web applications with no pain.

## View models

The working or business logic layer. In this point is no matter what you use for render. We recommend to use React, but door are open to use other frameworks like Vue.

- [Screens](https://github.com/eManPrague/frui.ts/tree/develop/packages/screens/README.md) - components for application structure, navigation, etc. For example, `ScreenBase`, `ConductorSingleChild`, `Busywatcher`, `Router`.
- [Data Screens](https://github.com/eManPrague/frui.ts/tree/develop/packages/datascreens/README.md) - base classes for data-focused applications. For example, `FilteredListViewModel`, `DetailViewModel`.

## Views

- [Views](https://github.com/eManPrague/frui.ts/tree/develop/packages/views/README.md) - components for binding UI to ViewModels. For example, `BindingComponent`, `View`.
- [Data](https://github.com/eManPrague/frui.ts/tree/develop/packages/data/README.md) - helper functions for rendering sorted and filtered data. For example, `IPagingFilter`, `pageChangedHandler`, `setSort`.
- [Data Views](https://github.com/eManPrague/frui.ts/tree/develop/packages/dataviews/README.md) - higher-order components for displaying data. For example, `DataTable`, `DataRepeater`.

## Data

- [API client](https://github.com/eManPrague/frui.ts/tree/develop/packages/apiclient/README.md) - abstraction over network calls and fluent request builder. For example, `FetchApiConnector`, `RestRequestBuilder`.

## Validation

- [Validation](https://github.com/eManPrague/frui.ts/tree/develop/packages/validation/README.md) - standalone solution for MobX-based entity validation.
- [Dirty checking](https://github.com/eManPrague/frui.ts/tree/develop/packages/dirtycheck/README.md) - standalone solution for MobX-based dirty check flags.

## Helpers

- [CRA template](https://github.com/eManPrague/frui.ts/tree/develop/packages/cra-template/README.md) - Create React App template
- [Generator](https://github.com/eManPrague/frui.ts/tree/develop/packages/generator/README.md) - code generator for saving time in typical scenarios.
- [Helpers](https://github.com/eManPrague/frui.ts/tree/develop/packages/helpers/README.md) - shared helper functions used on various places in Frui.ts. For example, `@bound`, `createMap`, `nameof`.

## UI components

- [Bootstrap](https://github.com/eManPrague/frui.ts/tree/develop/packages/bootstrap/README.md) - UI components suporting two-way binding based on [React Bootstrap](https://react-bootstrap.github.io/), For example, `Input`, `Select`, `Check`, `ValidationControlBase`.
- [HTML controls](https://github.com/eManPrague/frui.ts/tree/develop/packages/htmlcontrols/README.md) - UI components suporting two-way binding based on plain HTML controls. For example, `Textbox`, `Checkbox`.
