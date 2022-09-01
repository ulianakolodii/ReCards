import React, { useCallback } from "react";
import { Box } from "@primer/react";
import { hashItOrOriginal } from "../../utils";
import { ReactComponent as ChevronDown } from "../../assets/icons/chevron-down.svg";
import { ReactComponent as ChevronUp } from "../../assets/icons/chevron-up.svg";

export const Table = ({
  columns,
  data,
  onToggleSort = () => {},
  order,
  orderBy,
}) => {
  const createHandleToggleSort = useCallback(
    (id) => {
      return () => onToggleSort(id);
    },
    [onToggleSort]
  );
  return (
    <Box
      as="table"
      sx={{ borderCollapse: "collapse", borderSpacing: 0, width: "100%" }}
    >
      <Box as="thead">
        <Box as="tr">
          {columns.map((col) => {
            return (
              <Box
                key={col.title}
                as="th"
                sx={{
                  padding: "12px",
                  backgroundColor: "#DAEFFE",
                  textAlign: "left",
                  boxShadow:
                    "inset 0 1px 0 0 var(--wsr-color-B30, #C1E4FE),inset 0-1px 0 0 var(--wsr-color-B30, #C1E4FE)",
                  fontWeight: "normal",
                  "&:first-child": {
                    padding: "12px 12px 12px 24px",
                  },
                  "&:last-child": {
                    padding: "12px 24px 12px 12px",
                  },
                }}
              >
                {col.sortable ? (
                  <Box
                    onClick={createHandleToggleSort(col.id)}
                    sx={{
                      cursor: "pointer",
                      position: "relative",
                      userSelect: "none",
                      "& > svg": {
                        position: "absolute",
                        top: "50%",
                        marginTop: "-5px",
                        width: 10,
                        minWidth: 10,
                        right: "-12px",
                      },
                    }}
                  >
                    {col.title}
                    {orderBy === col.id && order && <ChevronDown />}
                    {orderBy === col.id && !order && <ChevronUp />}
                  </Box>
                ) : (
                  <Box>{col.title}</Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box as="tbody">
        {data?.map((row) => {
          return (
            <Box as="tr" key={hashItOrOriginal(JSON.stringify(row))}>
              {row?.map((rowCol) => {
                return (
                  <Box
                    as="td"
                    sx={{
                      padding: "12px",
                      boxShadow: "inset 0 -1px 0 0 #DFE5EB",
                      "&:first-child": {
                        padding: "16px 12px 16px 24px",
                      },
                      "&:last-child": {
                        padding: "16px 24px 16px 12px",
                      },
                    }}
                  >
                    {rowCol}
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
