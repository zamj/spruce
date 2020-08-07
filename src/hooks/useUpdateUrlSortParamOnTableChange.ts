import { SortDirection } from "gql/generated/types";
import { PatchTasksQueryParams, TableOnChange } from "types/task";
import { useHistory, useLocation } from "react-router-dom";
import { parseQueryString, stringifyQuery } from "utils";

export const useUpdateUrlSortParamOnTableChange = <T extends unknown>() => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();

  const tableChangeHandler: TableOnChange<T> = (
    ...[, , { order, columnKey }]
  ) => {
    // order is undefined when the column sorter is unselected (which occurs after being clicked three times)
    // when order is undefined, sort should be reset; therefore removed from the url
    if (!order) {
      replace(pathname);
    }

    const queryParams = parseQueryString(search);

    const nextQueryParams = {
      ...queryParams,
      [PatchTasksQueryParams.SortDir]:
        order === "ascend" ? SortDirection.Asc : SortDirection.Desc,
      [PatchTasksQueryParams.SortBy]: columnKey,
      [PatchTasksQueryParams.Page]: "0",
    };

    const nextSearch = stringifyQuery(nextQueryParams);

    if (nextSearch !== search.split("?")[1]) {
      replace(`${pathname}?${nextSearch}`);
    }
  };

  return tableChangeHandler;
};