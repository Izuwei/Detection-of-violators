import "./utils/i18n";
import { CookiesProvider } from "react-cookie";
import TopPanel from "./components/TopPanel";
import ScreenMnager from "./screens/ScreenManager";
import { StepProvider } from "./utils/StepProvider";

import "./App.css";

const App = () => {
  return (
    <CookiesProvider>
      <div className="App">
        <TopPanel />
        <StepProvider>
          <ScreenMnager />
        </StepProvider>
      </div>
    </CookiesProvider>
  );
};

export default App;
