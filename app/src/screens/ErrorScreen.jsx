import React, { memo } from "react";
import { useTranslation } from "react-i18next";

const ErrorScreen = memo((props) => {
  const { t } = useTranslation();

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
        color: "#1976d2",
      }}
    >
      {t("UnavailableContent")}
    </p>
  );
});

export default ErrorScreen;
