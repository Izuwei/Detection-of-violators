/**
 * @author Jakub Sadilek
 *
 * Faculty of Information Technology
 * Brno University of Technology
 * 2022
 */

import React, { memo, useCallback, useState } from "react";
import { useCookies } from "react-cookie";

import lightTheme from "../constants/theme/light";
import darkTheme from "../constants/theme/dark";

export const ThemeContext = React.createContext();

/**
 * Theme provider is responsible for providing name of theme
 * and corresponding colors across the application.
 */
export const ThemeProvider = memo(({ children }) => {
  const [cookies, setCookie] = useCookies(["theme"]);
  const [theme, setTheme] = useState(() => {
    switch (cookies.theme) {
      case "light":
        return { name: cookies.theme, ...lightTheme };
      case "dark":
        return { name: cookies.theme, ...darkTheme };
      default:
        return { name: "light", ...lightTheme };
    }
  });

  /**
   * Function changes theme of the application.
   *
   * @param {String} newTheme Name of the new theme.
   */
  const changeTheme = useCallback(
    (newTheme) => {
      setCookie("theme", newTheme, {
        path: "/",
        maxAge: 604800,
        secure: true,
        sameSite: "none",
      }); // week == 604800 seconds

      switch (newTheme) {
        case "light":
          setTheme({ name: newTheme, ...lightTheme });
          break;
        case "dark":
          setTheme({ name: newTheme, ...darkTheme });
          break;
        default:
          setTheme({ name: "light", ...lightTheme });
      }
    },
    [setCookie]
  );

  return (
    <ThemeContext.Provider
      value={{
        theme: theme,
        changeTheme: changeTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
});
