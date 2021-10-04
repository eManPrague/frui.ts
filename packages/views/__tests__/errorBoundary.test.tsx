/**
 * @jest-environment jsdom
 */
import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { bound } from "@frui.ts/helpers";
import ErrorBoundary, { ErrorBoundaryProps } from "../src/errorBoundary";

function SimulateError({ title }: { title: string }): JSX.Element {
  throw new Error(title);
}

function Test(): JSX.Element {
  return <SimulateError title={"errorMessage"} />;
}

class TestApp extends React.Component<ErrorBoundaryProps, { error: boolean }> {
  state = {
    error: false,
  };

  @bound
  protected setError(error: boolean) {
    this.setState({ error });
  }

  render() {
    return (
      <ErrorBoundary
        {...this.props}
        onReset={(...args) => {
          this.setError(false);
          if (this.props.onReset) {
            this.props.onReset(...args);
          }
        }}>
        {this.state.error ? <Test /> : this.props.children}
        <button
          data-testid="raiseErrorBtn"
          onClick={() => {
            this.setError(true);
          }}>
          Raise error
        </button>
      </ErrorBoundary>
    );
  }
}

describe("ErrorBoundary", () => {
  it("renders a fallback component on error", () => {
    const { container } = render(
      <ErrorBoundary fallback={<h1>Error Component</h1>}>
        <Test />
      </ErrorBoundary>
    );
    expect(container.innerHTML).toBe("<h1>Error Component</h1>");
  });

  it("renders children correctly when there is no error", () => {
    const { container } = render(
      <ErrorBoundary fallback={<h1>Error Component</h1>}>
        <h1>children</h1>
      </ErrorBoundary>
    );

    expect(container.innerHTML).toBe("<h1>children</h1>");
  });

  it("renders 'Something went wrong :-(' if not given a valid `fallback` prop", () => {
    const renderResult = render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore Passing wrong type on purpose
      <ErrorBoundary fallback={{ wrong: "fallback" }}>
        <Test />
      </ErrorBoundary>
    );

    expect(renderResult.container.innerHTML).toBe("<p>Something went wrong :-(</p>");
  });

  it("renders a fallback string when error occur", () => {
    const renderResult = render(
      <ErrorBoundary fallback={"Error occur"}>
        <Test />
      </ErrorBoundary>
    );

    expect(renderResult.container.innerHTML).toBe("Error occur");
  });

  it("renders a fallback component when error occur", async () => {
    const { container } = render(
      <TestApp fallback={<p>You have hit an error</p>}>
        <h1>children</h1>
      </TestApp>
    );

    expect(container.innerHTML).toContain("<h1>children</h1>");

    const btn = screen.getByTestId("raiseErrorBtn");
    fireEvent.click(btn);

    expect(container.innerHTML).not.toContain("<h1>children</h1>");
    expect(container.innerHTML).toBe("<p>You have hit an error</p>");
  });

  it("renders fallback as function", async () => {
    let errorString = "";
    let componentStackString = "";
    const { container } = render(
      <TestApp
        fallback={({ error, errorInfo }) => {
          errorString = error.toString();
          componentStackString = errorInfo?.componentStack || "";
          return <div>Fallback here</div>;
        }}>
        <h1>children</h1>
      </TestApp>
    );

    expect(container.innerHTML).toContain("<h1>children</h1>");

    const btn = screen.getByTestId("raiseErrorBtn");
    fireEvent.click(btn);

    expect(container.innerHTML).not.toContain("<h1>children</h1>");
    expect(container.innerHTML).toBe("<div>Fallback here</div>");
    expect(errorString).toBe("Error: errorMessage");
    /*
       in SimulateError
       in Test
       in ErrorBoundary
       in TestApp
     */
    expect(componentStackString).toMatch(/\s*(in SimulateError)\s*(in Test)\s*(in ErrorBoundary)\s*(in TestApp)/g);
  });

  it("calls `componentDidCatch() when an error occurs`", () => {
    const mockOnError = jest.fn();
    render(
      <TestApp fallback={<p>You have hit an error</p>} onError={mockOnError}>
        <h1>children</h1>
      </TestApp>
    );

    expect(mockOnError).toHaveBeenCalledTimes(0);

    const btn = screen.getByTestId("raiseErrorBtn");
    fireEvent.click(btn);

    expect(mockOnError).toHaveBeenCalledTimes(1);
    expect(mockOnError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object));
  });
});
