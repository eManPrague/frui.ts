import { describe, expect, it } from "vitest";
import { SortingDirection } from "../src/sortingDirection";
import { addSort, setSort } from "../src/sortingHelper";
import type { IPagingFilter } from "../src/types";

describe("sortingHelper", () => {
  describe("setSort", () => {
    it("adds sort column if sorting is undefined", () => {
      const filter: IPagingFilter = {
        offset: 0,
        limit: 10,
      };
      setSort(filter, "myColumn");

      expect(filter.sorting).toEqual([{ column: "myColumn", direction: SortingDirection.Ascending }]);
    });

    it("adds sort column if sorting is empty", () => {
      const filter: IPagingFilter = {
        offset: 0,
        limit: 10,
        sorting: [],
      };
      setSort(filter, "myColumn");

      expect(filter.sorting).toEqual([{ column: "myColumn", direction: SortingDirection.Ascending }]);
    });

    it("replaces sort column if sorting contains another column", () => {
      const filter: IPagingFilter = {
        offset: 0,
        limit: 10,
        sorting: [{ column: "otherColumn", direction: SortingDirection.Descending }],
      };
      setSort(filter, "myColumn");

      expect(filter.sorting).toEqual([{ column: "myColumn", direction: SortingDirection.Ascending }]);
    });

    it("changes sort order if already sorting by the column, ascending", () => {
      const filter: IPagingFilter = {
        offset: 0,
        limit: 10,
        sorting: [{ column: "myColumn", direction: SortingDirection.Ascending }],
      };
      setSort(filter, "myColumn");

      expect(filter.sorting).toEqual([{ column: "myColumn", direction: SortingDirection.Descending }]);
    });

    it("changes sort order if already sorting by the column, descending", () => {
      const filter: IPagingFilter = {
        offset: 0,
        limit: 10,
        sorting: [{ column: "myColumn", direction: SortingDirection.Descending }],
      };
      setSort(filter, "myColumn");

      expect(filter.sorting).toEqual([{ column: "myColumn", direction: SortingDirection.Ascending }]);
    });
  });

  describe("addSort", () => {
    it("adds sort column if sorting is undefined", () => {
      const filter: IPagingFilter = {
        offset: 0,
        limit: 10,
      };
      addSort(filter, "myColumn");

      expect(filter.sorting).toEqual([{ column: "myColumn", direction: SortingDirection.Ascending }]);
    });

    it("adds sort column if sorting is empty", () => {
      const filter: IPagingFilter = {
        offset: 0,
        limit: 10,
        sorting: [],
      };
      addSort(filter, "myColumn");

      expect(filter.sorting).toEqual([{ column: "myColumn", direction: SortingDirection.Ascending }]);
    });

    it("adds sort column if sorting contains another column", () => {
      const filter: IPagingFilter = {
        offset: 0,
        limit: 10,
        sorting: [{ column: "otherColumn", direction: SortingDirection.Descending }],
      };
      addSort(filter, "myColumn");

      expect(filter.sorting).toEqual([
        { column: "otherColumn", direction: SortingDirection.Descending },
        { column: "myColumn", direction: SortingDirection.Ascending },
      ]);
    });

    it("changes sort order if already sorting by the column, ascending", () => {
      const filter: IPagingFilter = {
        offset: 0,
        limit: 10,
        sorting: [
          { column: "otherColumn", direction: SortingDirection.Descending },
          { column: "myColumn", direction: SortingDirection.Ascending },
        ],
      };
      addSort(filter, "myColumn");

      expect(filter.sorting).toEqual([
        { column: "otherColumn", direction: SortingDirection.Descending },
        { column: "myColumn", direction: SortingDirection.Descending },
      ]);
    });

    it("changes sort order if already sorting by the column, descending", () => {
      const filter: IPagingFilter = {
        offset: 0,
        limit: 10,
        sorting: [
          { column: "otherColumn", direction: SortingDirection.Descending },
          { column: "myColumn", direction: SortingDirection.Descending },
        ],
      };
      addSort(filter, "myColumn");

      expect(filter.sorting).toEqual([
        { column: "otherColumn", direction: SortingDirection.Descending },
        { column: "myColumn", direction: SortingDirection.Ascending },
      ]);
    });
  });
});
