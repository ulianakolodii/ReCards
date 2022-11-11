import React, { useState, useCallback } from "react";
import {
  AnchoredOverlay,
  Box,
  Button,
  Text,
  TextInput,
  ActionList,
} from "@primer/react";
import {
  SearchIcon,
  TriangleDownIcon,
  XIcon,
  XCircleFillIcon,
} from "@primer/octicons-react";

export const DropdownMultiSelect = ({
  title = "Hello world!",
  onChange = () => {},
  items = [],
}) => {
  const [filterValue, setFilterValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenOverlay = useCallback(() => setIsOpen(true), [setIsOpen]);
  const handleCloseOverlay = useCallback(() => setIsOpen(false), [setIsOpen]);

  const handleFilterInput = (event) => {
    setFilterValue(event.target.value);
  };

  const handleClearClick = () => {
    setFilterValue("");
  };

  const filteredItems = items.filter(({ text }) => text?.includes(filterValue));

  const createOnSelectHandler = (el) => (event) => onChange(event, el);

  return (
    <AnchoredOverlay
      renderAnchor={(anchorProps) => (
        <Button
          {...anchorProps}
          variant="invisible"
          trailingIcon={TriangleDownIcon}
        >
          {title}
        </Button>
      )}
      open={isOpen}
      onOpen={handleOpenOverlay}
      onClose={handleCloseOverlay}
      side="inside-top"
      align="end"
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            paddingTop: 2,
            paddingLeft: 2,
            paddingRight: 1,
          }}
        >
          <Text sx={{ fontSize: 14, fontWeight: 600 }}>{title}</Text>
          <Box
            as="button"
            sx={{
              marginLeft: "auto",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              opacity: 0.5,
              transition: "opacity 0.2s ease-in",
              "&:hover": {
                opacity: 1,
              },
            }}
            onClick={handleCloseOverlay}
          >
            <XIcon />
          </Box>
        </Box>
        <Box
          sx={{
            padding: 2,
            borderBottomWidth: 1,
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            borderColor: (theme) => theme.colors.border.default,
            borderStyle: "solid",
          }}
        >
          <TextInput
            onInput={handleFilterInput}
            trailingAction={
              filterValue && (
                <TextInput.Action
                  onClick={handleClearClick}
                  icon={XCircleFillIcon}
                  aria-label="Очистити"
                  sx={{ color: "fg.subtle" }}
                />
              )
            }
            value={filterValue}
            leadingVisual={SearchIcon}
            placeholder="Пошук"
            sx={{ minWidth: 300 }}
          />
        </Box>
        <ActionList
          selectionVariant="multiple"
          showDivider
          sx={{
            padding: 2,
            "& li": {
              margin: 0,
            },
          }}
        >
          {filteredItems.map(({ id, text, selected, leadingVisual }) => (
            <ActionList.Item
              key={id}
              selected={selected}
              onSelect={createOnSelectHandler({
                id,
                text,
                selected,
                leadingVisual,
              })}
            >
              {leadingVisual && (
                <ActionList.LeadingVisual>
                  {leadingVisual()}
                </ActionList.LeadingVisual>
              )}
              {text}
            </ActionList.Item>
          ))}
        </ActionList>
      </Box>
    </AnchoredOverlay>
  );
};
