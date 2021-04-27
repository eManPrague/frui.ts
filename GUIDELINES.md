# Guidelines

## General

- Design the app and logic from ViewModels, not Views. It means that you should first build the application structure in terms of view models.

## How to create a two-way binding component

First, write a controlled react-only component, preferrably using hooks. If you need to use a local state that should be derived from props, use the following pattern:

```tsx
// inside RawTags.tsx

const [displayText, setDisplayText] = useState(""); // local state for the component that depends on 'props.values'

useEffect(() => {
  const stringValue = props.values?.join(", ") ?? "";
  setDisplayText(stringValue); // update the local state when props change
}, [props.values]);
```

Then just wrap the component inside a binding wrapper, preferably using the ´useBinding´ hook. If you need to pass an observable array, don’t forget to slice it.

```tsx
// insinde Tags.tsx

export interface TagsProps<
  TTarget,
  TProperty extends BindingProperty<TTarget>,
  TItem>
  extends IBindingProps<TTarget, TProperty> {
  readOnly?: boolean;
}

function TagsImpl<TTarget, TProperty extends BindingProperty<TTarget>, TItem>(props: TagsProps<TTarget, TProperty, TItem>) {
  const { target, property, onValueChanged, ...otherProps } = props;
  const [value, setValue] = useBinding(props);

  return <RawTags {...otherProps} values={value?.slice()} onChange={setValue} />;
}

export const Tags = observer(TagsImpl as any) as typeof TagsImpl;
```
