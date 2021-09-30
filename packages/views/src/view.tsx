import { isActivatable, isDeactivatable } from "@frui.ts/screens";
import * as React from "react";
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

export default class View extends React.PureComponent<ViewProps, ViewState> {
  static defaultProps: Partial<ViewProps> = {
    fallbackMode: "children",
  };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  protected runActivate() {
    if (this.props.useLifecycle) {
      const { vm } = this.props;
      if (vm && isActivatable(vm)) {
        vm.activate();
      }
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  componentDidMount() {
    this.runActivate();
  }

  componentDidUpdate(prevProps: ViewProps) {
    if (prevProps.vm !== this.props.vm) {
      this.runActivate();
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
}
