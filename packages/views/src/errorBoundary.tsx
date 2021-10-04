import * as React from "react";

export type FallbackRender = (errorData: {
  error: Error;
  errorInfo: React.ErrorInfo | null;
  resetError(): void;
}) => React.ReactChild;

export interface ErrorBoundaryProps {
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Called if resetError() is called from the fallback render props function  */
  onReset?(error: Error | null, errorInfo: React.ErrorInfo | null): void;
  fallback?: React.ReactChild | FallbackRender;
}

interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

const INITIAL_STATE = Object.freeze({
  errorInfo: null,
  error: null,
});

export default class ErrorBoundary extends React.PureComponent<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = INITIAL_STATE;

  public resetErrorBoundary: () => void = () => {
    const { onReset } = this.props;

    if (onReset) {
      const { error, errorInfo } = this.state;
      onReset(error, errorInfo);
    }

    this.setState(INITIAL_STATE);
  };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);

    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.error) {
      const { error, errorInfo } = this.state;
      const { fallback } = this.props;
      const element =
        typeof fallback === "function" ? fallback({ error, errorInfo, resetError: this.resetErrorBoundary }) : fallback;

      if (React.isValidElement(element) || typeof element === "string") {
        return element;
      }

      if (fallback) {
        console.warn("fallback did not produce a valid ReactChild");
      }

      // Fail gracefully if no fallback provided or is not valid
      return <p>Something went wrong :-(</p>;
    }

    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}
