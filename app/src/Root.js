import "./utils/i18n";

import { createRef, useCallback } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CookiesProvider } from "react-cookie";
import { SnackbarProvider } from "notistack";

import CloseIcon from "@mui/icons-material/Close";

import { ThemeProvider } from "./utils/ThemeProvider";
import { StepProvider } from "./utils/StepProvider";
import { DataProvider } from "./utils/DataProvider";
import { WsProvider } from "./utils/WsProvider";

import App from "./App";

const Root = () => {
  const notistackRef = createRef();
  const { t } = useTranslation();

  const onCloseSnackbar = useCallback(
    (key) => () => {
      notistackRef.current.closeSnackbar(key);
    },
    [notistackRef]
  );

  return (
    <Router>
      <CookiesProvider>
        <SnackbarProvider
          ref={notistackRef}
          maxSnack={3}
          action={(key) => (
            <Tooltip title={t("Close")}>
              <IconButton
                onClick={onCloseSnackbar(key)}
                sx={{ color: "white" }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          )}
        >
          <ThemeProvider>
            <StepProvider>
              <DataProvider>
                <WsProvider>
                  <App />
                </WsProvider>
              </DataProvider>
            </StepProvider>
          </ThemeProvider>
        </SnackbarProvider>
      </CookiesProvider>
    </Router>
  );
};

export default Root;
