export default function bound(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const fn = descriptor.value;

  if (typeof fn !== "function") {
      throw new Error(`@bound decorator can only be applied to methods not: ${typeof fn}`);
  }

  // In IE11 calling Object.defineProperty has a side-effect of evaluating the
  // getter for the property which is being replaced. This causes infinite
  // recursion and an "Out of stack space" error.
  let definingProperty = false;

  return {
      configurable: true,
      get() {
          if (definingProperty || this === target.prototype || this.hasOwnProperty(propertyKey)) {
              return fn;
          }

          const boundFn = fn.bind(this);
          definingProperty = true;
          Object.defineProperty(this, propertyKey, {
              value: boundFn,
              configurable: true,
              writable: true,
          });
          definingProperty = false;
          return boundFn;
      },
  };
}
