import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

import TopPanel from "./components/TopPanel";
import ScreenMnager from "./screens/ScreenManager";
import VideoScreen from "./screens/VideoScreen";
import ErrorScreen from "./screens/ErrorScreen";

import { ThemeContext } from "./utils/ThemeProvider";

import "./App.css";

const App = () => {
  const { t } = useTranslation();

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    document.title = t("AppName");
  }, [t]);

  useEffect(() => {
    document.body.style.backgroundColor = theme.background;
  }, [theme]);

  return (
    <div className="App">
      <TopPanel />
      <Routes>
        <Route exact path="/" element={<ScreenMnager />} />
        <Route path="/video/:videoId" element={<VideoScreen />} />
        <Route path="*" element={<ErrorScreen />} />
      </Routes>
    </div>
  );
};

export default App;
