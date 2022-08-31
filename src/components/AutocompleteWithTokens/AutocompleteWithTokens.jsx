import React, { useState } from "react";
import { Autocomplete, TextInputWithTokens, Box, Text } from "@primer/react";
import { hash } from "../../utils";

export const AutocompleteWithTokens = ({
  value = [],
  onChange = () => {},
  initialTokens = [
    { text: "Внутрішньо переміщена особа", id: "dosLsM" },
    { text: "Війсковослужбовець", id: "eXufkm" },
  ],
}) => {
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [autocompleteItems, setAutocompleteItems] = useState(initialTokens);
  const onTokenRemove = (tokenId) => {
    onChange({
      target: { value: value.filter((token) => token.id !== tokenId) },
    });
  };
  const handleSelectedChange = (newlySelectedItems) => {
    if (!Array.isArray(newlySelectedItems)) {
      return;
    }
    onChange({
      target: {
        value: newlySelectedItems.map(({ id, text }) => ({ id, text })),
      },
    });
  };

  const handleTokenKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      event.target.value?.trim() !== "" &&
      !autocompleteItems.find(
        (item) => item.text.trim() === event.target.value.trim()
      )
    ) {
      const id = hash(event.target.value);
      const newlySelectedItems = autocompleteItems.concat({
        text: event.target.value,
        id,
      });
      setAutocompleteItems(newlySelectedItems);
      handleSelectedChange(value.concat({ text: event.target.value, id }));
      setAutocompleteValue("");
      event.preventDefault();
    }
  };

  const handleInput = (event) => {
    setAutocompleteValue(event.target.value);
  };

  return (
    <Autocomplete>
      <Autocomplete.Input
        sx={{ width: "100%", boxSizing: "border-box" }}
        as={TextInputWithTokens}
        tokens={value}
        onTokenRemove={onTokenRemove}
        onKeyDown={handleTokenKeyDown}
        value={autocompleteValue}
        onInput={handleInput}
      />
      <Autocomplete.Overlay sx={{ minWidth: 300 }}>
        <Autocomplete.Menu
          emptyStateText={
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Text sx={{ fontWeight: 600 }}>Нічого не знайдено!</Text>
              <Text sx={{ fontSize: 10, opacity: 0.7 }}>
                Натисніть Enter, щоб додати елемент до списку.
              </Text>
            </Box>
          }
          items={autocompleteItems}
          selectedItemIds={value.map((el) => el.id)}
          onSelectedChange={handleSelectedChange}
          selectionVariant="multiple"
        />
      </Autocomplete.Overlay>
    </Autocomplete>
  );
};
