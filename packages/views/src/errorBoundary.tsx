import * as React from "react";

export type FallbackRender = (errorData: {
  error: Error;
  errorInfo: React.ErrorInfo | null;
  resetError(): void;
}) => React.ReactElement;

export interface ErrorBoundaryProps {
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Called if resetError() is called from the fallback render props function  */
  onReset?(error: Error | null, errorInfo: React.ErrorInfo | null): void;
  fallback?: React.ReactElement | FallbackRender;
}

interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

const INITIAL_STATE = {
  errorInfo: null,
  error: null,
};

export default class ErrorBoundary extends React.PureComponent<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = INITIAL_STATE;

  public resetErrorBoundary: () => void = () => {
    const { onReset } = this.props;
    const { error, errorInfo } = this.state;
    if (onReset) {
      onReset(error, errorInfo);
    }
    this.setState(INITIAL_STATE);
  };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);

    this.setState({ error, errorInfo });
  }

  render() {
    const { fallback, children } = this.props;
    const { error, errorInfo } = this.state;

    if (error) {
      let element: React.ReactElement | undefined;
      if (typeof fallback === "function") {
        element = fallback({ error, errorInfo, resetError: this.resetErrorBoundary });
      } else {
        element = fallback;
      }

      if (React.isValidElement(element)) {
        return element;
      }

      if (fallback) {
        console.warn("fallback did not produce a valid ReactElement");
      }

      // Fail gracefully if no fallback provided or is not valid
      return <p>Something went wrong :-(</p>;
    }

    return <React.Fragment>{children}</React.Fragment>;
  }
}
