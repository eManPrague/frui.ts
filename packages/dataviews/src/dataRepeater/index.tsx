import { observer } from "mobx-react-lite";
import React from "react";
import { DataTablePropsBase } from "../dataTypes";
import RepeaterHeader from "./repeaterHeader";
import RepeaterRow from "./repeaterRow";

export interface DataRepeaterProps<
  TItem,
  TContext,
  TWrapper extends React.ElementType,
  THeadWrapper extends React.ElementType,
  THeadCell extends React.ElementType,
  TBodyWrapper extends React.ElementType,
  TItemWrapper extends React.ElementType,
  TItemCell extends React.ElementType
> extends DataTablePropsBase<TItem, TContext> {
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

const defaultProps: Partial<DataRepeaterProps<any, any, any, any, any, any, any, any>> = {
  displayHeader: true,
};

function dataRepeater<
  TItem,
  TContext,
  TWrapper extends React.ElementType,
  THeadWrapper extends React.ElementType,
  THeadCell extends React.ElementType,
  TBodyWrapper extends React.ElementType,
  TItemWrapper extends React.ElementType,
  TItemCell extends React.ElementType
>(props: DataRepeaterProps<TItem, TContext, TWrapper, THeadWrapper, THeadCell, TBodyWrapper, TItemWrapper, TItemCell>) {
  const Wrapper = props.wrapperType ?? "table";
  const ItemWrapper = props.bodyWrapperType ?? "tbody";
  return (
    <Wrapper id={props.id} {...props.wrapperProps}>
      {props.displayHeader && (
        <RepeaterHeader
          columns={props.columns}
          context={props.context}
          pagingFilter={props.pagingFilter}
          onColumnSort={props.onColumnSort}
          wrapperType={props.headWrapperType}
          wrapperProps={props.headWrapperProps}
          itemCellType={props.headCellType}
          itemCellProps={props.headCellProps}
        />
      )}
      <ItemWrapper {...props.bodyWrapperProps}>
        {props.items.map(item => (
          <RepeaterRow
            key={String(item[props.itemKey])}
            item={item}
            columns={props.columns}
            context={props.context}
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

dataRepeater.defaultProps = defaultProps;
const DataRepeater = observer(dataRepeater) as typeof dataRepeater;
export default DataRepeater;
