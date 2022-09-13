import React, { useCallback } from "react";
import { NavLink } from "react-router-dom";
import { Box, Button, Token, Text, Tooltip } from "@primer/react";
import { CalendarIcon } from "@primer/octicons-react";
import { toggleQuery, hasQuery } from "../../utils";
import { ReactComponent as MobileIcon } from "../../assets/icons/mobile.svg";

export const PatientRow = ({
  additionalInfo,
  birthDate,
  fathersName,
  firstName,
  id,
  lastName,
  phoneNumber,
  tags,
  timestamp,
  deleting,
  onStartDelete,
  onConfirmDelete,
  onCancelDelete,
}) => {
  const handleStartDelete = useCallback(() => {
    onStartDelete(id);
  }, [onStartDelete, id]);

  const handleConfirmDelete = useCallback(() => {
    onConfirmDelete(id);
  }, [onConfirmDelete, id]);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        paddingX: 3,
        paddingY: 3,
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderColor: "btn.border",
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopWidth: 0,
        alignItems: "center",
        "&:hover": {
          background: (theme) => theme.colors.btn.focusBg,
        },
        "&:last-child": {
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
        },
        "& > div:last-child": {
          display: "none",
        },
        "&:hover > div:last-child": {
          display: "flex",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Tooltip
            aria-label={`Час створення запису: ${new Date(
              timestamp
            ).toLocaleString()}`}
          >
            <Text
              sx={{
                fontWeight: "bold",
                textDecoration: "none",
                color: "inherit",
                "&:hover": {
                  color: "btn.outline.text",
                },
              }}
              as={NavLink}
              to={`/edit-patient/${id}`}
            >
              {lastName} {firstName} {fathersName}
            </Text>
          </Tooltip>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {tags.map((tag) => (
              <Token
                sx={{
                  cursor: "pointer",
                }}
                isSelected={hasQuery(tag.id)}
                as={NavLink}
                key={tag.id}
                text={tag.text}
                to={`/patients?${toggleQuery(tag.id)}`}
              />
            ))}
          </Box>
        </Box>
        <Box sx={{ fontSize: 12, display: "flex", gap: 2, opacity: 0.5 }}>
          {id && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Text>#{id}</Text>
            </Box>
          )}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <CalendarIcon size={12} />
            <Text>{birthDate}</Text>
          </Box>
          {phoneNumber && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                "& > svg": {
                  width: 12,
                  height: 12,
                },
              }}
            >
              <MobileIcon />
              <Text>{phoneNumber}</Text>
            </Box>
          )}
        </Box>
        {additionalInfo && (
          <Box
            sx={{
              fontSize: 12,
              display: "flex",
              opacity: 0.5,
            }}
          >
            {additionalInfo}
          </Box>
        )}
      </Box>
      <Box>
        {deleting ? (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Box
              as="span"
              sx={{
                color: "danger.fg",
              }}
            >
              Ви впевнені?
            </Box>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Так
            </Button>
            <Button onClick={onCancelDelete}>Ні</Button>
          </Box>
        ) : (
          <Button variant="danger" onClick={handleStartDelete}>
            Видалити
          </Button>
        )}
      </Box>
    </Box>
  );
};
