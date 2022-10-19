import { Outlet, useMatch, useSearch } from "@tanstack/react-location";
import React, { useEffect } from "react";
import View from "../view/view";
import type { LocationGenerics } from "./types";

export function RouteView() {
  const match = useMatch<LocationGenerics>();
  const vm = match.data.vm;

  const search = useSearch<LocationGenerics>();
  useEffect(() => {
    vm?.onSearchChanged?.(search, match);
  }, [vm, search]);

  // console.log("rendering", matches);
  // const allMatches = useMatches<LocationGenerics>();
  // const isLatest = allMatches[allMatches.length - 1] === match;
  // console.log("rendering view", { isLatest }, vm, allMatches);

  return (
    <View vm={vm}>
      <Outlet />
    </View>
  );
}
