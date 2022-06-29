import { describe, expect, it } from "vitest";
import AggregateEntityValidator from "../src/aggregateEntityValidator";
import ManualEntityValidator from "../src/manualEntityValidator";
import { testCoreValidatorFunctions } from "./testHelpers";

interface ITarget {
  firstName: string;
}

describe("AggregateEntityValidator", () => {
  describe("with multiple validators", () => {
    testCoreValidatorFunctions(
      () => {
        const inner1 = new ManualEntityValidator<ITarget>(true);
        inner1.setResult("firstName", { code: "required", isValid: true });
        const inner2 = new ManualEntityValidator<ITarget>(true);
        inner1.setResult("firstName", { code: "length", isValid: true });

        return new AggregateEntityValidator<ITarget>(inner1, inner2);
      },
      () => {
        const inner1 = new ManualEntityValidator<ITarget>(true);
        inner1.setResult("firstName", { code: "required", isValid: true });
        const inner2 = new ManualEntityValidator<ITarget>(true);
        inner1.setResult("firstName", { code: "length", isValid: false });

        return new AggregateEntityValidator<ITarget>(inner1, inner2);
      },
      () => {
        const inner1 = new ManualEntityValidator<ITarget>();
        const inner2 = new ManualEntityValidator<ITarget>();

        return new AggregateEntityValidator<ITarget>(inner1, inner2);
      }
    );
  });

  describe("with alternate validators", () => {
    testCoreValidatorFunctions(
      () => {
        const inner1 = new ManualEntityValidator<ITarget>(true);
        const inner2 = new ManualEntityValidator<ITarget>(true);
        inner2.setResult("firstName", { code: "required", isValid: true });

        return new AggregateEntityValidator<ITarget>(inner1, inner2);
      },
      () => {
        const inner1 = new ManualEntityValidator<ITarget>(true);
        const inner2 = new ManualEntityValidator<ITarget>(true);
        inner2.setResult("firstName", { code: "required", isValid: false });

        return new AggregateEntityValidator<ITarget>(inner1, inner2);
      },
      () => {
        return new AggregateEntityValidator<ITarget>();
      }
    );
  });

  describe("getAllResults", () => {
    it("merges results from enabled inner validators", () => {
      const innerVisible = new ManualEntityValidator<ITarget>(true);
      innerVisible.setResult("firstName", { code: "required", isValid: true });
      const innerInvisible = new ManualEntityValidator<ITarget>(false);
      innerInvisible.setResult("firstName", { code: "length", isValid: false });
      const innerDisabled = new ManualEntityValidator<ITarget>();
      innerDisabled.isEnabled = false;
      innerDisabled.setResult("firstName", { code: "format", isValid: false });

      const validator = new AggregateEntityValidator<ITarget>(innerVisible, innerInvisible, innerDisabled);

      const results = Array.from(validator.getAllResults()).flatMap(([, results]) => Array.from(results));
      expect(results).toHaveLength(2);
      expect(results).toContainEqual({ code: "required", isValid: true });
      expect(results).toContainEqual({ code: "length", isValid: false });
    });
  });

  describe("getResults", () => {
    it("merges results from enabled inner validators", () => {
      const innerVisible = new ManualEntityValidator<ITarget>(true);
      innerVisible.setResult("firstName", { code: "required", isValid: true });
      const innerInvisible = new ManualEntityValidator<ITarget>(false);
      innerInvisible.setResult("firstName", { code: "length", isValid: false });
      const innerDisabled = new ManualEntityValidator<ITarget>();
      innerDisabled.isEnabled = false;
      innerDisabled.setResult("firstName", { code: "format", isValid: false });

      const validator = new AggregateEntityValidator<ITarget>(innerVisible, innerInvisible, innerDisabled);

      const results = Array.from(validator.getResults("firstName"));
      expect(results).toHaveLength(2);
      expect(results).toContainEqual({ code: "required", isValid: true });
      expect(results).toContainEqual({ code: "length", isValid: false });
    });
  });

  describe("getAllVisibleResults", () => {
    it("returns results only from visible validators", () => {
      const innerVisible = new ManualEntityValidator<ITarget>(true);
      innerVisible.setResult("firstName", { code: "required", isValid: true });
      const innerInvisible = new ManualEntityValidator<ITarget>(false);
      innerInvisible.setResult("firstName", { code: "length", isValid: false });
      const innerDisabled = new ManualEntityValidator<ITarget>();
      innerDisabled.isEnabled = false;
      innerDisabled.setResult("firstName", { code: "format", isValid: false });

      const validator = new AggregateEntityValidator<ITarget>(innerVisible, innerInvisible, innerDisabled);

      const results = Array.from(validator.getAllVisibleResults()).flatMap(([, results]) => Array.from(results));
      expect(results).toHaveLength(1);
      expect(results).toContainEqual({ code: "required", isValid: true });
    });
  });

  describe("getVisibleResults", () => {
    it("returns results only from visible validators", () => {
      const innerVisible = new ManualEntityValidator<ITarget>(true);
      innerVisible.setResult("firstName", { code: "required", isValid: true });
      const innerInvisible = new ManualEntityValidator<ITarget>(false);
      innerInvisible.setResult("firstName", { code: "length", isValid: false });
      const innerDisabled = new ManualEntityValidator<ITarget>();
      innerDisabled.isEnabled = false;
      innerDisabled.setResult("firstName", { code: "format", isValid: false });

      const validator = new AggregateEntityValidator<ITarget>(innerVisible, innerInvisible, innerDisabled);

      const results = Array.from(validator.getVisibleResults("firstName"));
      expect(results).toHaveLength(1);
      expect(results).toContainEqual({ code: "required", isValid: true });
    });
  });
});
