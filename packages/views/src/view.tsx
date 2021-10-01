import * as React from "react";
import ErrorBoundary, { ErrorBoundaryProps } from "./errorBoundary";
import useScreenLifecycle from "./useScreenLifecycle";
import { getView, tryGetView } from "./viewLocator";

interface ViewProps {
  vm: any;
  context?: string;
  useLifecycle?: boolean;
  fallbackMode?: "message" | "children";
}

const PureView: React.FunctionComponent<ViewProps> = props => {
  const { vm, children, fallbackMode, useLifecycle } = props;
  const FoundView = findView(props);

  if (!FoundView) {
    return fallbackMode === "message" ? (
      <span>Could not find a view for {vm.constructor.name}</span>
    ) : (
      <React.Fragment>{children}</React.Fragment>
    );
  }

  if (!!useLifecycle) {
    useScreenLifecycle(vm);
  }

  return <FoundView vm={vm} />;
};

export class ViewWithErrorBoundary extends React.PureComponent<ViewProps & ErrorBoundaryProps> {
  static displayName = "View.ErrorBoundary";

  static defaultProps: Partial<ViewProps> = {
    fallbackMode: "children",
  };

  render() {
    const { onError, onReset, fallback, ...rest } = this.props;

    return (
      <ErrorBoundary onError={onError} onReset={onReset} fallback={fallback}>
        <PureView {...rest} />
      </ErrorBoundary>
    );
  }
}

function findView(props: ViewProps) {
  const { vm, fallbackMode, context } = props;

  if (!vm) {
    return null;
  }

  return fallbackMode ? tryGetView(vm.constructor, context) : getView(vm.constructor, context);
}

const View: React.FunctionComponent<ViewProps> & { ErrorBoundary: typeof ViewWithErrorBoundary } = PureView as any;

View.ErrorBoundary = ViewWithErrorBoundary;

export default View;
