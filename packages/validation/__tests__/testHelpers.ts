/* eslint-disable sonarjs/no-duplicate-string */
import type { AggregatedValidationResult, EntityValidator, ValidationResult } from "../src/types";

export function expectValid(results: Iterable<ValidationResult> | undefined) {
  if (results) {
    const array: ValidationResult[] = Array.isArray(results) ? results : Array.from(results);
    expect(array.every(x => x.isValid)).toBeTruthy();
  }
}

export function expectInvalid(results: Iterable<ValidationResult> | undefined) {
  expect(results).toBeDefined();
  const array = !results || Array.isArray(results) ? (results as ValidationResult[]) : Array.from(results);
  const isValid = array.every(x => x.isValid);
  if (isValid) {
    expect(array).toContainEqual<Partial<ValidationResult>>({ isValid: false });
  }
}

/** Cretes core tests for arbitrary validator.
 * Validate on entity with property 'firstName' */
export function testCoreValidatorFunctions<TEntity extends { firstName: string } = any>(
  validValidator: () => EntityValidator<TEntity>,
  invalidValidator: () => EntityValidator<TEntity>,
  emptyValidator: () => EntityValidator<TEntity>
) {
  const getValidator = (args: { state: string; isEnabled: boolean; isVisible: boolean }) => {
    let validator: EntityValidator<TEntity>;
    switch (args.state) {
      case "valid":
        validator = validValidator();
        break;
      case "invalid":
        validator = invalidValidator();
        break;
      case "empty":
        validator = emptyValidator();
        break;
      default:
        throw new Error(`Unknown validator state '${args.state}'`);
    }

    validator.isEnabled = args.isEnabled;
    validator.isVisible = args.isVisible;
    return validator;
  };

  describe("getAllResults", () => {
    test.each`
      state        | isEnabled | isVisible | results
      ${"valid"}   | ${false}  | ${false}  | ${"no"}
      ${"valid"}   | ${false}  | ${true}   | ${"no"}
      ${"valid"}   | ${true}   | ${false}  | ${"some"}
      ${"valid"}   | ${true}   | ${true}   | ${"some"}
      ${"invalid"} | ${false}  | ${false}  | ${"no"}
      ${"invalid"} | ${false}  | ${true}   | ${"no"}
      ${"invalid"} | ${true}   | ${false}  | ${"some"}
      ${"invalid"} | ${true}   | ${true}   | ${"some"}
      ${"empty"}   | ${false}  | ${false}  | ${"no"}
      ${"empty"}   | ${false}  | ${true}   | ${"no"}
      ${"empty"}   | ${true}   | ${false}  | ${"no"}
      ${"empty"}   | ${true}   | ${true}   | ${"no"}
    `(
      "$state validator returns $results results when isEnabled:$isEnabled, isVisible:$isVisible",
      (args: { state: string; isEnabled: boolean; isVisible: boolean; results: string }) => {
        const validator = getValidator(args);
        const results = Array.from(validator.getAllResults());
        if (args.results === "no") {
          expect(results).toHaveLength(0);
        } else {
          expect(results).not.toHaveLength(0);
        }
      }
    );
  });

  describe("getResults on existing property", () => {
    test.each`
      state        | isEnabled | isVisible | results
      ${"valid"}   | ${false}  | ${false}  | ${"no"}
      ${"valid"}   | ${false}  | ${true}   | ${"no"}
      ${"valid"}   | ${true}   | ${false}  | ${"some"}
      ${"valid"}   | ${true}   | ${true}   | ${"some"}
      ${"invalid"} | ${false}  | ${false}  | ${"no"}
      ${"invalid"} | ${false}  | ${true}   | ${"no"}
      ${"invalid"} | ${true}   | ${false}  | ${"some"}
      ${"invalid"} | ${true}   | ${true}   | ${"some"}
      ${"empty"}   | ${false}  | ${false}  | ${"no"}
      ${"empty"}   | ${false}  | ${true}   | ${"no"}
      ${"empty"}   | ${true}   | ${false}  | ${"no"}
      ${"empty"}   | ${true}   | ${true}   | ${"no"}
    `(
      "$state validator returns $results results when isEnabled:$isEnabled, isVisible:$isVisible",
      (args: { state: string; isEnabled: boolean; isVisible: boolean; results: string }) => {
        const validator = getValidator(args);
        const results = Array.from(validator.getResults("firstName"));
        if (args.results === "no") {
          expect(results).toHaveLength(0);
        } else {
          expect(results).not.toHaveLength(0);
        }
      }
    );
  });

  describe("getResults on missing property", () => {
    test.each`
      state        | isEnabled | isVisible | results
      ${"valid"}   | ${false}  | ${false}  | ${"no"}
      ${"valid"}   | ${false}  | ${true}   | ${"no"}
      ${"valid"}   | ${true}   | ${false}  | ${"no"}
      ${"valid"}   | ${true}   | ${true}   | ${"no"}
      ${"invalid"} | ${false}  | ${false}  | ${"no"}
      ${"invalid"} | ${false}  | ${true}   | ${"no"}
      ${"invalid"} | ${true}   | ${false}  | ${"no"}
      ${"invalid"} | ${true}   | ${true}   | ${"no"}
      ${"empty"}   | ${false}  | ${false}  | ${"no"}
      ${"empty"}   | ${false}  | ${true}   | ${"no"}
      ${"empty"}   | ${true}   | ${false}  | ${"no"}
      ${"empty"}   | ${true}   | ${true}   | ${"no"}
    `(
      "$state validator returns $results results when isEnabled:$isEnabled, isVisible:$isVisible",
      (args: { state: string; isEnabled: boolean; isVisible: boolean; results: string }) => {
        const validator = getValidator(args);
        const results = Array.from(validator.getResults("unknown" as any));
        if (args.results === "no") {
          expect(results).toHaveLength(0);
        } else {
          expect(results).not.toHaveLength(0);
        }
      }
    );
  });

  describe("getAllVisibleResults", () => {
    test.each`
      state        | isEnabled | isVisible | results
      ${"valid"}   | ${false}  | ${false}  | ${"no"}
      ${"valid"}   | ${false}  | ${true}   | ${"no"}
      ${"valid"}   | ${true}   | ${false}  | ${"no"}
      ${"valid"}   | ${true}   | ${true}   | ${"some"}
      ${"invalid"} | ${false}  | ${false}  | ${"no"}
      ${"invalid"} | ${false}  | ${true}   | ${"no"}
      ${"invalid"} | ${true}   | ${false}  | ${"no"}
      ${"invalid"} | ${true}   | ${true}   | ${"some"}
      ${"empty"}   | ${false}  | ${false}  | ${"no"}
      ${"empty"}   | ${false}  | ${true}   | ${"no"}
      ${"empty"}   | ${true}   | ${false}  | ${"no"}
      ${"empty"}   | ${true}   | ${true}   | ${"no"}
    `(
      "$state validator returns $results results when isEnabled:$isEnabled, isVisible:$isVisible",
      (args: { state: string; isEnabled: boolean; isVisible: boolean; results: string }) => {
        const validator = getValidator(args);
        const results = Array.from(validator.getAllVisibleResults());
        if (args.results === "no") {
          expect(results).toHaveLength(0);
        } else {
          expect(results).not.toHaveLength(0);
        }
      }
    );
  });

  describe("getVisibleResults on existing property", () => {
    test.each`
      state        | isEnabled | isVisible | results
      ${"valid"}   | ${false}  | ${false}  | ${"no"}
      ${"valid"}   | ${false}  | ${true}   | ${"no"}
      ${"valid"}   | ${true}   | ${false}  | ${"no"}
      ${"valid"}   | ${true}   | ${true}   | ${"some"}
      ${"invalid"} | ${false}  | ${false}  | ${"no"}
      ${"invalid"} | ${false}  | ${true}   | ${"no"}
      ${"invalid"} | ${true}   | ${false}  | ${"no"}
      ${"invalid"} | ${true}   | ${true}   | ${"some"}
      ${"empty"}   | ${false}  | ${false}  | ${"no"}
      ${"empty"}   | ${false}  | ${true}   | ${"no"}
      ${"empty"}   | ${true}   | ${false}  | ${"no"}
      ${"empty"}   | ${true}   | ${true}   | ${"no"}
    `(
      "$state validator returns $results results when isEnabled:$isEnabled, isVisible:$isVisible",
      (args: { state: string; isEnabled: boolean; isVisible: boolean; results: string }) => {
        const validator = getValidator(args);
        const results = Array.from(validator.getVisibleResults("firstName"));
        if (args.results === "no") {
          expect(results).toHaveLength(0);
        } else {
          expect(results).not.toHaveLength(0);
        }
      }
    );
  });

  describe("getVisibleResults on missing property", () => {
    test.each`
      state        | isEnabled | isVisible | results
      ${"valid"}   | ${false}  | ${false}  | ${"no"}
      ${"valid"}   | ${false}  | ${true}   | ${"no"}
      ${"valid"}   | ${true}   | ${false}  | ${"no"}
      ${"valid"}   | ${true}   | ${true}   | ${"no"}
      ${"invalid"} | ${false}  | ${false}  | ${"no"}
      ${"invalid"} | ${false}  | ${true}   | ${"no"}
      ${"invalid"} | ${true}   | ${false}  | ${"no"}
      ${"invalid"} | ${true}   | ${true}   | ${"no"}
      ${"empty"}   | ${false}  | ${false}  | ${"no"}
      ${"empty"}   | ${false}  | ${true}   | ${"no"}
      ${"empty"}   | ${true}   | ${false}  | ${"no"}
      ${"empty"}   | ${true}   | ${true}   | ${"no"}
    `(
      "$state validator returns $results results when isEnabled:$isEnabled, isVisible:$isVisible",
      (args: { state: string; isEnabled: boolean; isVisible: boolean; results: string }) => {
        const validator = getValidator(args);
        const results = Array.from(validator.getVisibleResults("unknown" as any));
        if (args.results === "no") {
          expect(results).toHaveLength(0);
        } else {
          expect(results).not.toHaveLength(0);
        }
      }
    );

    describe("checkValid", () => {
      test.each`
        state        | isEnabled | isVisible | result
        ${"valid"}   | ${false}  | ${false}  | ${true}
        ${"valid"}   | ${false}  | ${true}   | ${true}
        ${"valid"}   | ${true}   | ${false}  | ${true}
        ${"valid"}   | ${true}   | ${true}   | ${true}
        ${"invalid"} | ${false}  | ${false}  | ${true}
        ${"invalid"} | ${false}  | ${true}   | ${true}
        ${"invalid"} | ${true}   | ${false}  | ${false}
        ${"invalid"} | ${true}   | ${true}   | ${false}
        ${"empty"}   | ${false}  | ${false}  | ${true}
        ${"empty"}   | ${false}  | ${true}   | ${true}
        ${"empty"}   | ${true}   | ${false}  | ${true}
        ${"empty"}   | ${true}   | ${true}   | ${true}
      `(
        "$state validator returns $result when isEnabled:$isEnabled, isVisible:$isVisible",
        (args: { state: string; isEnabled: boolean; isVisible: boolean; result: AggregatedValidationResult }) => {
          const validator = getValidator(args);
          const result = validator.checkValid();
          expect(result).toBe(args.result);
        }
      );
    });

    describe("checkValid on existing property", () => {
      test.each`
        state        | isEnabled | isVisible | result
        ${"valid"}   | ${false}  | ${false}  | ${true}
        ${"valid"}   | ${false}  | ${true}   | ${true}
        ${"valid"}   | ${true}   | ${false}  | ${true}
        ${"valid"}   | ${true}   | ${true}   | ${true}
        ${"invalid"} | ${false}  | ${false}  | ${true}
        ${"invalid"} | ${false}  | ${true}   | ${true}
        ${"invalid"} | ${true}   | ${false}  | ${false}
        ${"invalid"} | ${true}   | ${true}   | ${false}
        ${"empty"}   | ${false}  | ${false}  | ${true}
        ${"empty"}   | ${false}  | ${true}   | ${true}
        ${"empty"}   | ${true}   | ${false}  | ${true}
        ${"empty"}   | ${true}   | ${true}   | ${true}
      `(
        "$state validator returns $result when isEnabled:$isEnabled, isVisible:$isVisible",
        (args: { state: string; isEnabled: boolean; isVisible: boolean; result: AggregatedValidationResult }) => {
          const validator = getValidator(args);
          const result = validator.checkValid("firstName");
          expect(result).toBe(args.result);
        }
      );
    });

    describe("checkValid on missing property", () => {
      test.each`
        state        | isEnabled | isVisible | result
        ${"valid"}   | ${false}  | ${false}  | ${true}
        ${"valid"}   | ${false}  | ${true}   | ${true}
        ${"valid"}   | ${true}   | ${false}  | ${true}
        ${"valid"}   | ${true}   | ${true}   | ${true}
        ${"invalid"} | ${false}  | ${false}  | ${true}
        ${"invalid"} | ${false}  | ${true}   | ${true}
        ${"invalid"} | ${true}   | ${false}  | ${true}
        ${"invalid"} | ${true}   | ${true}   | ${true}
        ${"empty"}   | ${false}  | ${false}  | ${true}
        ${"empty"}   | ${false}  | ${true}   | ${true}
        ${"empty"}   | ${true}   | ${false}  | ${true}
        ${"empty"}   | ${true}   | ${true}   | ${true}
      `(
        "$state validator returns $result when isEnabled:$isEnabled, isVisible:$isVisible",
        (args: { state: string; isEnabled: boolean; isVisible: boolean; result: AggregatedValidationResult }) => {
          const validator = getValidator(args);
          const result = validator.checkValid("unknown" as any);
          expect(result).toBe(args.result);
        }
      );
    });
  });
}
