import React from "react";
import { NavLink } from "react-router-dom";
import { Header, Box } from "@primer/react";

export const Main = ({ children }) => {
  return (
    <div>
      <Header>
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
          <Header.Link as={NavLink} to="/">
            Візити
          </Header.Link>
        </Header.Item>
        <Header.Item>
          <Header.Link as={NavLink} to="/patients">
            Пацієнти
          </Header.Link>
        </Header.Item>
        <Header.Item>
          <Header.Link as={NavLink} to="/doctors">
            Лікарі
          </Header.Link>
        </Header.Item>
      </Header>
      <div>{children}</div>
    </div>
  );
};
