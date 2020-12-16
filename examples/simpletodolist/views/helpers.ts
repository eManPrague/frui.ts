import React from "react";

export function pluralize(count: number, subject: string) {
  return count === 1 ? subject : subject + "s";
}

export function onEnterHandler(action: () => any) {
  return (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      action();
    }
  };
}
