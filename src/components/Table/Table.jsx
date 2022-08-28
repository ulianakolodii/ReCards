import React from "react";
import { Box } from "@primer/react";
import { hashItOrOriginal } from "../../utils";

export const Table = ({ columns, data }) => {
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
                {col.title}
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
