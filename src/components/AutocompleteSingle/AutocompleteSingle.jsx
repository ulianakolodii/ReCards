import React, { useCallback } from "react";
import { Autocomplete, TextInput } from "@primer/react";
import { XCircleFillIcon } from "@primer/octicons-react";

const emptyArray = [];

export const AutocompleteSingle = ({
  items,
  value = "",
  validationStatus = "",
  onChange = () => {},
}) => {
  const handleChange = useCallback(
    (newlySelectedItems) => {
      if (!Array.isArray(newlySelectedItems)) {
        return;
      }
      onChange(newlySelectedItems[0].text);
    },
    [onChange]
  );

  const handleInput = useCallback(
    (event) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  const handleClearClick = useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <>
      <Autocomplete.Input
        required
        block
        validationStatus={validationStatus}
        value={value}
        onInput={handleInput}
        trailingAction={
          value && (
            <TextInput.Action
              onClick={handleClearClick}
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
