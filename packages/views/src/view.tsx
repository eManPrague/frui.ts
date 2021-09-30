import { isActivatable, isDeactivatable } from "@frui.ts/screens";
import * as React from "react";
import useScreenLifecycle from "./useScreenLifecycle";
import { getView, tryGetView } from "./viewLocator";

interface ViewProps {
  vm: any;
  context?: string;
  useLifecycle?: boolean;
  fallbackMode?: "message" | "children";
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ViewState {
  hasError: boolean;
}

export class ViewWithErrorBoundary extends React.PureComponent<ViewProps, ViewState> {
  static displayName = "View.ErrorBoundary";

  static defaultProps: Partial<ViewProps> = {
    fallbackMode: "children",
  };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  componentDidMount() {
    this.tryActivateViewModel();
  }

  componentDidUpdate(prevProps: ViewProps) {
    if (prevProps.vm !== this.props.vm) {
      this.tryActivateViewModel();
    }
  }

  componentWillUnmount() {
    if (this.props.useLifecycle) {
      const { vm } = this.props;
      if (vm && isDeactivatable(vm)) {
        vm.deactivate(true);
      }
    }
  }

  render() {
    if (this.state?.hasError) {
      return <p>Something went wrong :-(</p>;
    }

    const { vm, context, fallbackMode, children } = this.props;

    if (!vm) {
      return <React.Fragment>{children}</React.Fragment>;
    }

    const FoundView = fallbackMode ? tryGetView(vm.constructor, context) : getView(vm.constructor, context);

    if (!FoundView) {
      return fallbackMode === "message" ? (
        <p>Could not find a view for {vm.constructor.name}</p>
      ) : (
        <React.Fragment>{children}</React.Fragment>
      );
    }

    return <FoundView vm={vm} />;
  }

  protected tryActivateViewModel() {
    if (this.props.useLifecycle) {
      const { vm } = this.props;
      if (vm && isActivatable(vm)) {
        vm.activate();
      }
    }
  }
}

const View: React.FunctionComponent<ViewProps> & { ErrorBoundary: typeof ViewWithErrorBoundary } = ({
  vm,
  context,
  useLifecycle,
  fallbackMode,
  children,
}) => {
  if (!vm) {
    return <React.Fragment />;
  }

  const FoundView = fallbackMode ? tryGetView(vm.constructor, context) : getView(vm.constructor, context);

  if (!FoundView) {
    if (fallbackMode === "message") {
      return <span>Could not find a view for {vm.constructor.name}</span>;
    } else if (fallbackMode === "children" && children) {
      return <React.Fragment>{children}</React.Fragment>;
    } else {
      return null;
    }
  }

  if (!!useLifecycle) {
    useScreenLifecycle(vm);
  }
  return <FoundView vm={vm} />;
};

View.ErrorBoundary = ViewWithErrorBoundary;

export default View;
