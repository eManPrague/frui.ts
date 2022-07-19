<img src="logomanual/color/fruits_logo_horizontal_color.svg" alt="logo" height="100" />

Frui.ts is a frontend framework using [MVVM](https://en.wikipedia.org/wiki/Model-view-viewmodel) design pattern for clean separation of concerns and long-term maintainability.

It allows **ViewModel-first** approach, which enables automated testing of complex workflows on the ViewModel level with no need to simulate actual user interaction with the UI.

This framework is designed to support both small and large applications with SOLID codebase. It is built on top of the [React](https://reactjs.org/) library, using [MobX](https://mobx.js.org/) and written in the modern TypeScript language.

> ## Jump to the [wiki](https://github.com/eManPrague/frui.ts/wiki) for detailed documentation.

> ## Looking for v0.x documentation? Check the [legacy](https://github.com/eManPrague/frui.ts/tree/legacy) branch.

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
