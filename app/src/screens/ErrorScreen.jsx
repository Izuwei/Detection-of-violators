import React, { memo, useContext } from "react";
import { useTranslation } from "react-i18next";

import { ThemeContext } from "../utils/ThemeProvider";

const ErrorScreen = memo((props) => {
  const { t } = useTranslation();

  const { theme } = useContext(ThemeContext);

  return (
    <p
      style={{
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: 10,
        fontSize: 42,
        fontFamily: "Consolas",
        color: theme.primary,
      }}
    >
      {t("NotFound")}
    </p>
  );
});

export default ErrorScreen;
