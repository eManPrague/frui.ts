import { handlePageChanged, IPagerProps } from "@src/data/pagerHelper";
import { observer} from "mobx-react-lite";
import * as React from "react";

const itemClass = "page-item";
const disabledItemClass = "page-item disabled";
const activeItemClass = "page-item active";
const linkClass = "page-link";

const PageButton: React.FunctionComponent<{ onClick: React.MouseEventHandler<HTMLButtonElement>, page: number }> = ({ onClick, page, children }) =>
  <button type="button" data-page={page} className={linkClass} onClick={onClick} >{children}</button>;

const Pager: React.FunctionComponent<IPagerProps> = observer(({ paging, filter, onPageChanged }) => {

  const pageChangedHandler: React.MouseEventHandler<HTMLButtonElement> = e => {
    const pageNumber = +e.currentTarget.dataset.page;
    handlePageChanged(pageNumber, filter, onPageChanged);
  };

  const currentPage = Math.ceil(paging.offset / paging.limit) + 1;
  const totalPages = Math.ceil(paging.totalItems / paging.limit);
  const pageNumbers = Array.from(Array(totalPages).keys());
  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        <li className={currentPage > 1 ? itemClass : disabledItemClass}>
          <PageButton page={currentPage - 1} onClick={pageChangedHandler}>Previous</PageButton>
        </li>

        {pageNumbers.map(x =>
          <li key={x} className={currentPage === x + 1 ? activeItemClass : itemClass}>
            <PageButton page={x + 1} onClick={pageChangedHandler}>{x + 1}</PageButton>
          </li>)}

        <li className={currentPage < totalPages ? itemClass : disabledItemClass}>
          <PageButton page={currentPage + 1} onClick={pageChangedHandler}>Next</PageButton>
        </li>
      </ul>
    </nav>
  );
});
export default Pager;
