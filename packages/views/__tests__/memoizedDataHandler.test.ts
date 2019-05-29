import createMemoizedHandler from "../src/memoizedDataHandler";

const testEvent = {
  currentTarget: {
    dataset: { somedatakey: "foobar" },
  },
};

const somedatakeyHandler = createMemoizedHandler("somedatakey");

describe("memoizedDataHandler", () => {
  it("sends the specified 'data-' attribute to the wrapped function", () => {
    let handledValue: string;
    const innerHandler = (value: string) => {
      handledValue = value;
    };

    const wrappedHandler = somedatakeyHandler(innerHandler);
    wrappedHandler.call(undefined, testEvent);
    expect(handledValue).toBe("foobar");
  });
  it("memoizes the function creation so that it is memory-safe to call the inferred handler function from React component", () => {
    const innerHandler = (value: string) => true;

    const wrappedHandler1 = somedatakeyHandler(innerHandler);
    const wrappedHandler2 = somedatakeyHandler(innerHandler);

    expect(wrappedHandler1).toBe(wrappedHandler2);
  });
});
