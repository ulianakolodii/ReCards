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

  const handleInput = (event) => {
    setAutocompleteValue(event.target.value);
  };

  const handleAddItem = () => {
    const id = hash(autocompleteValue);
    const newlySelectedItems = autocompleteItems.concat({
      text: autocompleteValue,
      id,
      selected: true,
    });
    setAutocompleteItems(newlySelectedItems);
    handleSelectedChange(value.concat({ text: autocompleteValue, id }));
    setAutocompleteValue("");
  };

  return (
    <Autocomplete>
      <Autocomplete.Input
        block
        sx={{ boxSizing: "border-box" }}
        as={TextInputWithTokens}
        tokens={value}
        onTokenRemove={onTokenRemove}
        value={autocompleteValue}
        onInput={handleInput}
      />
      <Autocomplete.Overlay width="xxlarge">
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
          addNewItem={
            autocompleteValue &&
            !autocompleteItems.find(
              (item) => item.text.trim() === autocompleteValue
            )
              ? {
                  text: `Додати ще одну мітку "${autocompleteValue}"`,
                  handleAddItem,
                }
              : undefined
          }
        />
      </Autocomplete.Overlay>
    </Autocomplete>
  );
};
