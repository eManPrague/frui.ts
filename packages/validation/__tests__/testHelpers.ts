/* eslint-disable sonarjs/no-duplicate-string */
import { describe, expect, it, test } from "vitest";
import type { AggregatedValidationResult, EntityValidator, ValidationResult } from "../src/types";

export function expectValid(results: Iterable<ValidationResult> | undefined) {
  if (results) {
    const array = Array.isArray(results) ? (results as ValidationResult[]) : Array.from(results);
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
    test.each([
      ["valid", "no", false, false],
      ["valid", "no", false, true],
      ["valid", "some", true, false],
      ["valid", "some", true, true],
      ["invalid", "no", false, false],
      ["invalid", "no", false, true],
      ["invalid", "some", true, false],
      ["invalid", "some", true, true],
      ["empty", "no", false, false],
      ["empty", "no", false, true],
      ["empty", "no", true, false],
      ["empty", "no", true, true],
    ])(
      "%s validator returns %s results when isEnabled:%o, isVisible:%o",
      (state: string, results: string, isEnabled: boolean, isVisible: boolean) => {
        const validator = getValidator({ state, isEnabled, isVisible });
        const errors = Array.from(validator.getAllResults());
        if (results === "no") {
          expect(errors).toHaveLength(0);
        } else {
          expect(errors).not.toHaveLength(0);
        }
      }
    );
  });

  describe("getResults on existing property", () => {
    test.each([
      ["valid", "no", false, false],
      ["valid", "no", false, true],
      ["valid", "some", true, false],
      ["valid", "some", true, true],
      ["invalid", "no", false, false],
      ["invalid", "no", false, true],
      ["invalid", "some", true, false],
      ["invalid", "some", true, true],
      ["empty", "no", false, false],
      ["empty", "no", false, true],
      ["empty", "no", true, false],
      ["empty", "no", true, true],
    ])(
      "%s validator returns %s results when isEnabled:%o, isVisible:%o",
      (state: string, results: string, isEnabled: boolean, isVisible: boolean) => {
        const validator = getValidator({ state, isEnabled, isVisible });
        const errors = Array.from(validator.getResults("firstName"));
        if (results === "no") {
          expect(errors).toHaveLength(0);
        } else {
          expect(errors).not.toHaveLength(0);
        }
      }
    );
  });

  describe("getResults on missing property", () => {
    test.each([
      ["valid", "no", false, false],
      ["valid", "no", false, true],
      ["valid", "no", true, false],
      ["valid", "no", true, true],
      ["invalid", "no", false, false],
      ["invalid", "no", false, true],
      ["invalid", "no", true, false],
      ["invalid", "no", true, true],
      ["empty", "no", false, false],
      ["empty", "no", false, true],
      ["empty", "no", true, false],
      ["empty", "no", true, true],
    ])(
      "%s validator returns %s results when isEnabled:%o, isVisible:%o",
      (state: string, results: string, isEnabled: boolean, isVisible: boolean) => {
        const validator = getValidator({ state, isEnabled, isVisible });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const errors = Array.from(validator.getResults("unknown" as any));
        if (results === "no") {
          expect(errors).toHaveLength(0);
        } else {
          expect(errors).not.toHaveLength(0);
        }
      }
    );
  });

  describe("getAllVisibleResults", () => {
    test.each([
      ["valid", "no", false, false],
      ["valid", "no", false, true],
      ["valid", "no", true, false],
      ["valid", "some", true, true],
      ["invalid", "no", false, false],
      ["invalid", "no", false, true],
      ["invalid", "no", true, false],
      ["invalid", "some", true, true],
      ["empty", "no", false, false],
      ["empty", "no", false, true],
      ["empty", "no", true, false],
      ["empty", "no", true, true],
    ])(
      "%s validator returns %s results when isEnabled:%o, isVisible:%o",
      (state: string, results: string, isEnabled: boolean, isVisible: boolean) => {
        const validator = getValidator({ state, isEnabled, isVisible });
        const errors = Array.from(validator.getAllVisibleResults());
        if (results === "no") {
          expect(errors).toHaveLength(0);
        } else {
          expect(errors).not.toHaveLength(0);
        }
      }
    );

    it("returns explicitly set visible properties", () => {
      const validator = invalidValidator();
      validator.isVisible = false;

      const initialResults = Array.from(validator.getAllVisibleResults());
      expect(initialResults).toHaveLength(0);

      const invalidProperties = Array.from(validator.getAllResults(), ([property, propertyResults]) => ({
        property,
        isValid: Array.from(propertyResults).some(x => !x.isValid),
      }));
      const invalidProperty = invalidProperties[0].property;

      validator.visibleProperties.add(invalidProperty);

      const results = Array.from(validator.getAllVisibleResults());
      expect(results).not.toHaveLength(0);
    });
  });

  describe("getVisibleResults on existing property", () => {
    test.each([
      ["valid", "no", false, false],
      ["valid", "no", false, true],
      ["valid", "no", true, false],
      ["valid", "some", true, true],
      ["invalid", "no", false, false],
      ["invalid", "no", false, true],
      ["invalid", "no", true, false],
      ["invalid", "some", true, true],
      ["empty", "no", false, false],
      ["empty", "no", false, true],
      ["empty", "no", true, false],
      ["empty", "no", true, true],
    ])(
      "%s validator returns %s results when isEnabled:%o, isVisible:%o",
      (state: string, results: string, isEnabled: boolean, isVisible: boolean) => {
        const validator = getValidator({ state, isEnabled, isVisible });
        const errors = Array.from(validator.getVisibleResults("firstName"));
        if (results === "no") {
          expect(errors).toHaveLength(0);
        } else {
          expect(errors).not.toHaveLength(0);
        }
      }
    );

    it("returns errors when explicitly set visible", () => {
      const validator = invalidValidator();
      validator.isVisible = false;

      const initialResults = Array.from(validator.getVisibleResults("firstName"));
      expect(initialResults).toHaveLength(0);

      validator.visibleProperties.add("firstName");

      const results = Array.from(validator.getVisibleResults("firstName"));
      expect(results).not.toHaveLength(0);
    });
  });

  describe("getVisibleResults on missing property", () => {
    test.each([
      ["valid", "no", false, false],
      ["valid", "no", false, true],
      ["valid", "no", true, false],
      ["valid", "no", true, true],
      ["invalid", "no", false, false],
      ["invalid", "no", false, true],
      ["invalid", "no", true, false],
      ["invalid", "no", true, true],
      ["empty", "no", false, false],
      ["empty", "no", false, true],
      ["empty", "no", true, false],
      ["empty", "no", true, true],
    ])(
      "%s validator returns %s results when isEnabled:%o, isVisible:%o",
      (state: string, results: string, isEnabled: boolean, isVisible: boolean) => {
        const validator = getValidator({ state, isEnabled, isVisible });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const errors = Array.from(validator.getVisibleResults("unknown" as any));
        if (results === "no") {
          expect(errors).toHaveLength(0);
        } else {
          expect(errors).not.toHaveLength(0);
        }
      }
    );

    describe("checkValid", () => {
      test.each([
        ["valid", true, false, false],
        ["valid", true, false, true],
        ["valid", true, true, false],
        ["valid", true, true, true],
        ["invalid", true, false, false],
        ["invalid", true, false, true],
        ["invalid", false, true, false],
        ["invalid", false, true, true],
        ["empty", true, false, false],
        ["empty", true, false, true],
        ["empty", true, true, false],
        ["empty", true, true, true],
      ])(
        "%s validator returns %o when isEnabled:%o, isVisible:%o",
        (state: string, result: AggregatedValidationResult, isEnabled: boolean, isVisible: boolean) => {
          const validator = getValidator({ state, isEnabled, isVisible });
          const isValid = validator.checkValid();
          expect(isValid).toBe(result);
        }
      );
    });

    describe("checkValid on existing property", () => {
      test.each([
        ["valid", true, false, false],
        ["valid", true, false, true],
        ["valid", true, true, false],
        ["valid", true, true, true],
        ["invalid", true, false, false],
        ["invalid", true, false, true],
        ["invalid", false, true, false],
        ["invalid", false, true, true],
        ["empty", true, false, false],
        ["empty", true, false, true],
        ["empty", true, true, false],
        ["empty", true, true, true],
      ])(
        "%s validator returns %o when isEnabled:%o, isVisible:%o",
        (state: string, result: AggregatedValidationResult, isEnabled: boolean, isVisible: boolean) => {
          const validator = getValidator({ state, isEnabled, isVisible });
          const isValid = validator.checkValid("firstName");
          expect(isValid).toBe(result);
        }
      );
    });

    describe("checkValid on missing property", () => {
      test.each([
        ["valid", true, false, false],
        ["valid", true, false, true],
        ["valid", true, true, false],
        ["valid", true, true, true],
        ["invalid", true, false, false],
        ["invalid", true, false, true],
        ["invalid", true, true, false],
        ["invalid", true, true, true],
        ["empty", true, false, false],
        ["empty", true, false, true],
        ["empty", true, true, false],
        ["empty", true, true, true],
      ])(
        "%s validator returns %o when isEnabled:%o, isVisible:%o",
        (state: string, result: AggregatedValidationResult, isEnabled: boolean, isVisible: boolean) => {
          const validator = getValidator({ state, isEnabled, isVisible });
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const isValid = validator.checkValid("unknown" as any);
          expect(isValid).toBe(result);
        }
      );
    });
  });
}
