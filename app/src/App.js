import "./utils/i18n";
import { CookiesProvider } from "react-cookie";
import TopPanel from "./components/TopPanel";

import "./App.css";

const App = () => {
  return (
    <CookiesProvider>
      <div className="App">
        <TopPanel />
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </CookiesProvider>
  );
};

export default App;
