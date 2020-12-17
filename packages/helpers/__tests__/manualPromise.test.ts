import ManualPromise from "../src/manualPromise";

describe("ManualPromise", () => {
  test("inner promise is not resolved until resolve() is called", async () => {
    let called = false;

    const promise = new ManualPromise();
    const handler = promise.promise.then(() => (called = true));

    expect(called).toBeFalsy();

    promise.resolve();
    await handler;
    expect(called).toBeTruthy();
  });

  test("inner promise is not resolved until reject() is called", async () => {
    let error = "";

    const promise = new ManualPromise();
    const handler = promise.promise.catch(e => (error = e));

    expect(error).toBe("");

    promise.reject("test");
    await handler;
    expect(error).toBe("test");
  });

  describe("status", () => {
    it("is 'new' when created", () => {
      const promise = new ManualPromise();
      expect(promise.status).toBe("new");
    });

    it("is 'resolved' when resolved", () => {
      const promise = new ManualPromise();

      promise.resolve();
      expect(promise.status).toBe("resolved");
    });

    it("is 'rejected' when rejected", () => {
      const promise = new ManualPromise();
      promise.promise.catch(x => x);

      promise.reject("Error");
      expect(promise.status).toBe("rejected");
    });
  });
});
