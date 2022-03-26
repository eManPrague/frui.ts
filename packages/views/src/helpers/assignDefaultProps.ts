import type React from "react";

export default function assignDefaultProps<TControl extends React.ElementType>(
  control: TControl,
  props: Partial<React.ComponentPropsWithoutRef<TControl>>
) {
  const controlWithDefaultProps = control as { defaultProps?: Partial<React.ComponentPropsWithoutRef<TControl>> };
  if (controlWithDefaultProps.defaultProps) {
    Object.assign(controlWithDefaultProps.defaultProps, props);
  } else {
    controlWithDefaultProps.defaultProps = props;
  }
}
