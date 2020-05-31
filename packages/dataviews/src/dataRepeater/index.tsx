import { observer } from "mobx-react-lite";
import * as React from "react";
import { DataTablePropsBase } from "../dataTypes";
import RepeaterHeader from "./repeaterHeader";
import RepeaterRow from "./repeaterRow";

export interface DataRepeaterProps<
  TItem,
  TWrapper extends React.ElementType,
  THeadWrapper extends React.ElementType,
  THeadCell extends React.ElementType,
  TBodyWrapper extends React.ElementType,
  TItemWrapper extends React.ElementType,
  TItemCell extends React.ElementType
> extends DataTablePropsBase<TItem> {
  wrapperType?: TWrapper;
  wrapperProps?: React.ComponentPropsWithoutRef<TWrapper>;

  headWrapperType?: THeadWrapper;
  headWrapperProps?: React.ComponentPropsWithoutRef<THeadWrapper>;

  headCellType?: THeadCell;
  headCellProps?: React.ComponentPropsWithoutRef<THeadCell>;

  bodyWrapperType?: TBodyWrapper;
  bodyWrapperProps?: React.ComponentPropsWithoutRef<TBodyWrapper>;

  itemWrapperType?: TItemWrapper;
  itemWrapperProps?: React.ComponentPropsWithoutRef<TItemWrapper>;

  itemCellType?: TItemCell;
  itemCellProps?: React.ComponentPropsWithoutRef<TItemCell>;
}

function dataRepeater<
  TItem,
  TWrapper extends React.ElementType,
  THeadWrapper extends React.ElementType,
  THeadCell extends React.ElementType,
  TBodyWrapper extends React.ElementType,
  TItemWrapper extends React.ElementType,
  TItemCell extends React.ElementType
>(props: DataRepeaterProps<TItem, TWrapper, THeadWrapper, THeadCell, TBodyWrapper, TItemWrapper, TItemCell>) {
  const Wrapper = props.wrapperType ?? "table";
  const ItemWrapper = props.bodyWrapperType ?? "tbody";
  return (
    <Wrapper {...props.wrapperProps}>
      <RepeaterHeader
        columns={props.columns}
        pagingFilter={props.pagingFilter}
        onColumnSort={props.onColumnSort}
        wrapperType={props.headWrapperType}
        wrapperProps={props.headWrapperProps}
        itemCellType={props.headCellType}
        itemCellProps={props.headCellProps}
      />
      <ItemWrapper {...props.bodyWrapperProps}>
        {props.items.map(item => (
          <RepeaterRow
            key={String(item[props.itemKey])}
            item={item}
            columns={props.columns}
            wrapperType={props.itemWrapperType}
            wrapperProps={props.itemWrapperProps}
            itemCellType={props.itemCellType}
            itemCellProps={props.itemCellProps}
          />
        ))}
      </ItemWrapper>
    </Wrapper>
  );
}

const DataRepeater = observer(dataRepeater) as typeof dataRepeater;
export default DataRepeater;
