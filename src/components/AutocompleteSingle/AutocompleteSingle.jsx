import React, { useContext, useMemo } from "react";
import { Autocomplete, TextInput } from "@primer/react";
import { XCircleFillIcon } from "@primer/octicons-react";

const emptyArray = [];

export const AutocompleteSingle = ({
  items,
  value = "",
  onChange = () => {},
}) => {
  const { inputValue = value, setInputValue } = useContext(
    Autocomplete.Context
  );

  const itemsSet = useMemo(
    () => new Set(items.map(({ text }) => text)),
    [items]
  );

  const validationStatus = useMemo(
    () => (itemsSet.has(inputValue) || inputValue === "" ? "" : "error"),
    [itemsSet, inputValue]
  );

  const handleChange = (newlySelectedItems) => {
    if (!Array.isArray(newlySelectedItems)) {
      return;
    }
    setInputValue(newlySelectedItems[0].text);
    onChange(newlySelectedItems[0]);
  };

  return (
    <>
      <Autocomplete.Input
        required
        block
        value={inputValue}
        validationStatus={validationStatus}
        trailingAction={
          inputValue && (
            <TextInput.Action
              onClick={() => {
                setInputValue("");
              }}
              icon={XCircleFillIcon}
              aria-label="Очистити"
              sx={{ color: "fg.subtle" }}
            />
          )
        }
      />
      <Autocomplete.Overlay width="xxlarge">
        <Autocomplete.Menu
          items={items}
          selectedItemIds={emptyArray}
          onSelectedChange={handleChange}
          emptyStateText="Немає варіантів для вибору"
        />
      </Autocomplete.Overlay>
    </>
  );
};
