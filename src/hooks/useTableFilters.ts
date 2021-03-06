import { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { parseQueryString } from "utils";
import { updateUrlQueryParam } from "utils/url";

type InputEvent = React.ChangeEvent<HTMLInputElement>;

interface Params<SearchParam> {
  urlSearchParam: SearchParam; // the name of url param
  sendAnalyticsEvent: (filterBy: string) => void; // callback function to send analytics event
}

type UseInputFilterReturn = [
  string, // url param value
  (e: InputEvent) => void, // onChange handler
  () => void, // update url param
  () => void // reset url param
];

// USE FOR FILTERS BUILT INTO TABLE COLUMN HEADERS
export const useTableInputFilter = <SearchParam extends string>({
  urlSearchParam,
  sendAnalyticsEvent = () => undefined,
}: Params<SearchParam>): UseInputFilterReturn => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();

  const urlParams = parseQueryString(search);

  const inputValueFromUrl = (urlParams[urlSearchParam] || "").toString();

  const [value, setValue] = useState(inputValueFromUrl);

  const onChange = (e: InputEvent): void => {
    setValue(e.target.value);
  };

  const updateParams = () => {
    updateUrlQueryParam(
      urlSearchParam,
      value.trim(),
      search,
      replace,
      pathname,
      true
    );

    sendAnalyticsEvent(urlSearchParam);
  };

  const resetQueryParam = () => {
    setValue("");

    updateUrlQueryParam(urlSearchParam, null, search, replace, pathname, true);
  };

  return [value, onChange, updateParams, resetQueryParam];
};

type UseCheckboxFilterReturn = [
  string[], // url param value
  (e: InputEvent, key: string) => void, // onChange handler
  () => void, // update url param
  () => void // reset url param
];

export const useTableCheckboxFilter = <SearchParam extends string>({
  urlSearchParam,
  sendAnalyticsEvent = () => undefined,
}: Params<SearchParam>): UseCheckboxFilterReturn => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();

  const { [urlSearchParam]: rawStatuses } = parseQueryString(search);

  const valueFromUrl = Array.isArray(rawStatuses)
    ? rawStatuses
    : [rawStatuses].filter((v) => v);

  const [value, setValue] = useState<string[]>(valueFromUrl);

  const onChange = (e: InputEvent, key: string): void => {
    if (e.target.checked) {
      setValue([...value, key]);
    } else {
      const index = value.findIndex((v) => v === key);
      setValue([...value.slice(0, index), ...value.slice(index + 1)]);
    }
  };

  const updateParams = () => {
    updateUrlQueryParam(urlSearchParam, value, search, replace, pathname, true);

    sendAnalyticsEvent(urlSearchParam);
  };

  const resetQueryParam = () => {
    setValue([]);

    updateUrlQueryParam(urlSearchParam, null, search, replace, pathname, true);
  };

  return [value, onChange, updateParams, resetQueryParam];
};
