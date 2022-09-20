import React, { useCallback, useMemo, useState } from "react";
import { Heading, AnchoredOverlay, Button, Box } from "@primer/react";
import { DropdownButton } from "@primer/react/lib-esm/deprecated/DropdownMenu";
import { useProvidedStateOrCreate } from "@primer/react/lib-esm/hooks/useProvidedStateOrCreate";
import { useProvidedRefOrCreate } from "@primer/react/lib-esm/hooks/useProvidedRefOrCreate";
import VisuallyHidden from "@primer/react/lib-esm/_VisuallyHidden";
import ButtonClose from "@primer/react/lib-esm/deprecated/Button/ButtonClose";
import { FilteredActionList } from "@primer/react/lib-esm/FilteredActionList";
import { SearchIcon } from "@primer/octicons-react";
import { useSSRSafeId } from "@react-aria/ssr";

function isMultiSelectVariant(selected) {
  return Array.isArray(selected);
}

const focusZoneSettings = {
  // Let FilteredActionList handle focus zone
  disabled: true,
};

export function SelectPanel({
  open,
  onOpenChange,
  renderAnchor = (props) => <DropdownButton {...props} />,
  anchorRef: externalAnchorRef,
  selected,
  onSelectedChange,
  title = isMultiSelectVariant(selected) ? "Select items" : "Select an item",
  inputLabel = "Filter items",
  inputPlaceholder,
  filterValue: externalFilterValue,
  onFilterChange: externalOnFilterChange,
  items,
  textInputProps,
  overlayProps,
  sx: sxProp,
  ...listProps
}) {
  const [filterValue, setInternalFilterValue] = useProvidedStateOrCreate(
    externalFilterValue,
    undefined,
    ""
  );
  const onFilterChange = useCallback(
    (value, e) => {
      externalOnFilterChange(value, e);
      setInternalFilterValue(value);
    },
    [externalOnFilterChange, setInternalFilterValue]
  );

  const selectedItems = React.useMemo(
    () =>
      Array.isArray(selected) ? selected : [...(selected ? [selected] : [])],
    [selected]
  );

  const [finalItemsSelected, setFinalItemsSelected] = useState(selectedItems);

  // Refresh the selected items state when the prop changes.
  // This is necessary because sometimes the selected items need to be fetched async.
  React.useEffect(() => setFinalItemsSelected(selectedItems), [selectedItems]);

  const anchorRef = useProvidedRefOrCreate(externalAnchorRef);
  const onOpen = useCallback(
    (gesture) => onOpenChange(true, gesture),
    [onOpenChange]
  );
  const onClose = useCallback(
    (gesture) => {
      onOpenChange(false, gesture);
    },
    [onOpenChange]
  );

  const renderMenuAnchor = useMemo(() => {
    if (renderAnchor === null) {
      return null;
    }

    return (props) => {
      return renderAnchor({
        ...props,
        children: selectedItems.length
          ? selectedItems.map((item) => item.text).join(", ")
          : inputLabel,
      });
    };
  }, [inputLabel, renderAnchor, selectedItems]);

  const itemsToRender = useMemo(() => {
    return items.map((item) => {
      return {
        ...item,
        role: "option",
        selected:
          "selected" in item && item.selected === undefined
            ? undefined
            : !!finalItemsSelected.find((el) => el.id === item.id),
        onAction: (itemFromAction, event) => {
          item.onAction?.(itemFromAction, event);

          if (event.defaultPrevented) {
            return;
          }

          if (isMultiSelectVariant(selected)) {
            const otherSelectedItems = finalItemsSelected.filter(
              (selectedItem) => selectedItem !== item
            );
            const newSelectedItems = finalItemsSelected.includes(item)
              ? otherSelectedItems
              : [...otherSelectedItems, item];

            setFinalItemsSelected(newSelectedItems);
          } else {
            // single select
            setFinalItemsSelected(
              finalItemsSelected.includes(item) ? [] : [item]
            );
          }
        },
      };
    });
  }, [items, selected, setFinalItemsSelected, finalItemsSelected]);

  const onSaveClickHandler = React.useCallback(() => {
    if (isMultiSelectVariant(selected)) {
      const multiSelectOnChange = onSelectedChange;
      multiSelectOnChange(finalItemsSelected);
    } else {
      const singleSelectOnChange = onSelectedChange;
      singleSelectOnChange(
        finalItemsSelected.length > 0 ? finalItemsSelected[0] : undefined
      );
    }
    onClose("selection");
  }, [finalItemsSelected, onSelectedChange, onClose, selected]);

  const onCloseOverlay = React.useCallback(
    (gesture) => {
      setFinalItemsSelected(selectedItems);
      onClose(gesture ?? "escape");
    },
    [onClose, selectedItems]
  );

  const onCloseClickHandler = React.useCallback(() => {
    setFinalItemsSelected(selectedItems);
    onClose("escape");
  }, [onClose, selectedItems]);

  const inputRef = React.useRef(null);
  const titleId = useSSRSafeId();
  const focusTrapSettings = {
    initialFocusRef: inputRef,
  };

  const extendedTextInputProps = useMemo(() => {
    return {
      sx: { m: 2 },
      contrast: true,
      leadingVisual: SearchIcon,
      "aria-label": inputLabel,
      placeholder: inputPlaceholder,
      ...textInputProps,
    };
  }, [textInputProps, inputLabel, inputPlaceholder]);

  const overlayKeyPressHandler = useCallback(
    (event) => {
      if (!event.defaultPrevented && ["Enter"].includes(event.key)) {
        onSaveClickHandler();
        event.preventDefault();
      }
    },
    [onSaveClickHandler]
  );

  return (
    <AnchoredOverlay
      renderAnchor={renderMenuAnchor}
      anchorRef={anchorRef}
      open={open}
      onOpen={onOpen}
      onClose={onCloseOverlay}
      overlayProps={{
        ...overlayProps,
        onKeyPress: overlayKeyPressHandler,
        role: "dialog",
        "aria-labelledby": titleId,
      }}
      focusTrapSettings={focusTrapSettings}
      focusZoneSettings={focusZoneSettings}
    >
      <Box
        display="flex"
        flexDirection="column"
        height="inherit"
        maxHeight="inherit"
      >
        <VisuallyHidden aria-atomic="true" aria-live="polite">
          {filterValue === ""
            ? "Showing all items"
            : items.length <= 0
            ? "No matching items"
            : `${items.length} matching ${
                items.length === 1 ? "item" : "items"
              }`}
        </VisuallyHidden>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pl={3}
          pr={2}
          pt={2}
        >
          <Heading as="h1" id={titleId} sx={{ fontSize: 1 }}>
            {title}
          </Heading>
          <ButtonClose
            sx={{ padding: "6px 8px" }}
            onClick={onCloseClickHandler}
          />
        </Box>
        <FilteredActionList
          filterValue={filterValue}
          onFilterChange={onFilterChange}
          {...listProps}
          role="listbox"
          aria-multiselectable={
            isMultiSelectVariant(selected) ? "true" : "false"
          }
          aria-labelledby={titleId}
          selectionVariant={
            isMultiSelectVariant(selected) ? "multiple" : "single"
          }
          items={itemsToRender}
          textInputProps={extendedTextInputProps}
          inputRef={inputRef}
          sx={{ ...sxProp, flex: "1 1 auto" }}
        />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          gridGap="8px"
          padding="12px"
          borderTopColor="border.default"
          borderTopWidth={1}
          borderTopStyle="solid"
        >
          <Button size="small" onClick={onCloseClickHandler}>
            Cancel
          </Button>
          <Button size="small" variant="primary" onClick={onSaveClickHandler}>
            Save
          </Button>
        </Box>
      </Box>
    </AnchoredOverlay>
  );
}

SelectPanel.displayName = "SelectPanel";
