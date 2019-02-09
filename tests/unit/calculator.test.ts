import { add } from "src/calculator";

test("calculator", () => {
  const result = add(1, 2);

  expect(result).toBe(3);
});
