import "./utils/i18n";

import { createRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { CookiesProvider } from "react-cookie";
import { SnackbarProvider } from "notistack";
import { IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { StepProvider } from "./utils/StepProvider";
import { DataProvider } from "./utils/DataProvider";
import TopPanel from "./components/TopPanel";
import ScreenMnager from "./screens/ScreenManager";

import "./App.css";

const App = () => {
  const notistackRef = createRef();
  const { t } = useTranslation();
  console.log("Render: App");

  const onCloseSnackbar = useCallback(
    (key) => () => {
      notistackRef.current.closeSnackbar(key);
    },
    [notistackRef]
  );

  return (
    <div className="App">
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
          <TopPanel />
          <StepProvider>
            <DataProvider>
              <ScreenMnager />
            </DataProvider>
          </StepProvider>
        </SnackbarProvider>
      </CookiesProvider>
    </div>
  );
};

export default App;
