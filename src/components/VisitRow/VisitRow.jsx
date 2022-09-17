import React, { useCallback } from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  Button,
  Text,
  Tooltip,
  Token,
  IssueLabelToken,
} from "@primer/react";
import { OrganizationIcon, CalendarIcon } from "@primer/octicons-react";
import { ReactComponent as MobileIcon } from "../../assets/icons/mobile.svg";
import { ReactComponent as DoctorIcon } from "../../assets/icons/user-doctor-solid.svg";
import { hasQuery, toggleQuery } from "../../utils";

export const VisitRow = ({
  doctor,
  patient,
  dateTime,
  id,
  timestamp,
  deleting,
  onStartDelete,
  onConfirmDelete,
  onCancelDelete,
  isChild,
}) => {
  const handleStartDelete = useCallback(() => {
    onStartDelete(id);
  }, [onStartDelete, id]);

  const handleConfirmDelete = useCallback(() => {
    onConfirmDelete(id);
  }, [onConfirmDelete, id]);

  if (!patient || !doctor) {
    return null;
  }

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
              to={`/edit-visit/${id}`}
            >
              {patient.lastName} {patient.firstName} {patient.fathersName}
            </Text>
          </Tooltip>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {isChild && (
              <IssueLabelToken
                text="неповнолітній"
                style={{
                  cursor: "pointer",
                }}
                fillColor="#0366d6"
                isSelected={hasQuery("1", "child")}
                as={NavLink}
                to={`/?${toggleQuery("1", "child")}`}
              />
            )}
            {patient.tags.map((tag) => (
              <Token
                sx={{
                  cursor: "pointer",
                }}
                isSelected={hasQuery(tag.id)}
                as={NavLink}
                key={tag.id}
                text={tag.text}
                to={`/?${toggleQuery(tag.id)}`}
              />
            ))}
          </Box>
        </Box>
        <Box sx={{ fontSize: 12, display: "flex", gap: 2, opacity: 0.5 }}>
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
            <CalendarIcon />
            <Text>{new Date(dateTime).toLocaleString()}</Text>
          </Box>
        </Box>
        <Box sx={{ fontSize: 12, display: "flex", gap: 2, opacity: 0.5 }}>
          {id && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Text>#{id}</Text>
            </Box>
          )}
          {patient.phoneNumber && (
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
              <Text>{patient.phoneNumber}</Text>
            </Box>
          )}
          {doctor.department && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <OrganizationIcon size={12} />
              <Text>{doctor.department}</Text>
            </Box>
          )}
          {doctor && (
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
              <DoctorIcon />
              <Text>
                {doctor.lastName} {doctor.firstName} {doctor.fathersName}
              </Text>
            </Box>
          )}
        </Box>
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
