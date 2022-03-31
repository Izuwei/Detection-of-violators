import "./utils/i18n";

import { createRef, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CookiesProvider } from "react-cookie";
import { SnackbarProvider } from "notistack";
import { IconButton, Tooltip } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { StepProvider } from "./utils/StepProvider";
import { DataProvider } from "./utils/DataProvider";
import TopPanel from "./components/TopPanel";
import ScreenMnager from "./screens/ScreenManager";
import VideoScreen from "./screens/VideoScreen";
import ErrorScreen from "./screens/ErrorScreen";

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
    <Router>
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
                <Routes>
                  <Route exact path="/" element={<ScreenMnager />} />
                  <Route path="/video/:videoId" element={<VideoScreen />} />
                  <Route path="*" element={<ErrorScreen />} />
                </Routes>
              </DataProvider>
            </StepProvider>
          </SnackbarProvider>
        </CookiesProvider>
      </div>
    </Router>
  );
};

export default App;
