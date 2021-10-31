import { observer } from "mobx-react-lite";
import type { EntityValidator } from "@frui.ts/validation";
import React from "react";

function validationErrors({ validator, property }: { validator: EntityValidator<any>; property: string }) {
  const results = Array.from(validator.getVisibleResults(property));
  return (
    <ul>
      {results.map(result => (
        <li key={result.code}>
          <strong>{property}</strong>
          {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
          <span style={{ color: result.isValid ? "green" : "red" }}>{result.message || result.code}</span>
        </li>
      ))}
    </ul>
  );
}

const ValidationErrors = observer(validationErrors as any) as typeof validationErrors;
export default ValidationErrors;
