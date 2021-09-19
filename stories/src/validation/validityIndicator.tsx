import { EntityValidator } from "@frui.ts/validation";
import { observer } from "mobx-react-lite";
import React from "react";

function validityIndicator({ validator }: { validator: EntityValidator<any> }) {
  const isValid = validator.isValid;
  return <strong style={{ color: isValid ? "green" : "red" }}>Entity</strong>;
}

const ValidityIndicator = observer(validityIndicator as any) as typeof validityIndicator;
export default ValidityIndicator;
