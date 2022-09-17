import React from "react";
import { NavLink } from "react-router-dom";
import { Header, Box } from "@primer/react";

export const Main = ({ children }) => (
  <div>
    <Header sx={{ justifyContent: "center" }}>
      <Box sx={{ maxWidth: 1280, display: "flex", flex: 1 }}>
        <Header.Item>
          <Header.Link as={NavLink} to="/" fontSize={2}>
            <Box
              as="img"
              src="../../../logo.png"
              alt="Logo"
              width={32}
              height={32}
            />
          </Header.Link>
        </Header.Item>
        <Header.Item>
          <Header.Link
            as={NavLink}
            to="/"
            sx={{
              "&.active": {
                opacity: 0.5,
                cursor: "default",
                pointerEvents: "none",
              },
            }}
          >
            Візити
          </Header.Link>
        </Header.Item>
        <Header.Item>
          <Header.Link
            as={NavLink}
            to="/patients"
            sx={{
              "&.active": {
                opacity: 0.5,
                cursor: "default",
                pointerEvents: "none",
              },
            }}
          >
            Пацієнти
          </Header.Link>
        </Header.Item>
        <Header.Item>
          <Header.Link
            as={NavLink}
            to="/doctors"
            sx={{
              "&.active": {
                opacity: 0.5,
                cursor: "default",
                pointerEvents: "none",
              },
            }}
          >
            Лікарі
          </Header.Link>
        </Header.Item>
      </Box>
    </Header>
    <div>{children}</div>
  </div>
);
