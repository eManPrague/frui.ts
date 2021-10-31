import React from "react";
import type { ErrorBoundaryProps } from "./errorBoundary";
import ErrorBoundary from "./errorBoundary";
import useScreenLifecycle from "./useScreenLifecycle";
import { getView, tryGetView } from "./viewLocator";

interface ViewProps {
  vm?: unknown;
  context?: string;
  useLifecycle?: boolean;
}

const PureView: React.FunctionComponent<ViewProps> = props => {
  const { vm, children, context, useLifecycle } = props;

  if (!vm) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  const vmConstructor = (vm as Record<string, any>).constructor;
  const FoundView = children === undefined ? getView(vmConstructor, context) : tryGetView(vmConstructor, context);

  if (!FoundView) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  if (useLifecycle) {
    useScreenLifecycle(vm);
  }

  return <FoundView vm={vm} />;
};

PureView.displayName = "View";

const ViewWithErrorBoundary: React.FunctionComponent<ViewProps & ErrorBoundaryProps> = props => {
  const { onError, onReset, fallback, ...rest } = props;

  return (
    <ErrorBoundary onError={onError} onReset={onReset} fallback={fallback}>
      <PureView {...rest} />
    </ErrorBoundary>
  );
};

ViewWithErrorBoundary.displayName = "View.ErrorBoundary";

const View = PureView as React.FunctionComponent<ViewProps> & { ErrorBoundary: typeof ViewWithErrorBoundary };
View.ErrorBoundary = ViewWithErrorBoundary;

export default View;
