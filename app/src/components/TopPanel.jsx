import React, { memo, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";

import gbFlag from "../assets/icons/gb_flag.svg";
import czFlag from "../assets/icons/cz_flag.svg";
import appIcon from "../assets/icons/app_icon.svg";

const TopPanel = memo(() => {
  const { t, i18n } = useTranslation();
  const [, setCookie] = useCookies(["lang"]);
  console.log("Render: TopPanel");

  const onLanguageChange = useCallback(
    (event) => {
      const lang = event.target.value;
      setCookie("lang", lang, { path: "/", maxAge: 604800 }); // week == 604800 seconds
      i18n.changeLanguage(lang);
    },
    [i18n, setCookie]
  );

  return (
    <AppBar position="static" sx={styles.panel}>
      <Toolbar>
        <img src={appIcon} style={styles.appIcon} alt="app-icon" />
        <Typography variant="h5" component="div" align="left" sx={styles.text}>
          {t("appName")}
        </Typography>
        <FormControl>
          <InputLabel id="language-select-label" sx={styles.menuItem}>
            {t("language")}
          </InputLabel>
          <Select
            value={i18n.language}
            onChange={onLanguageChange}
            labelId="language-select-label"
            label={t("language")}
            variant="outlined"
            sx={styles.select}
            MenuProps={{
              PaperProps: {
                style: styles.menu,
              },
            }}
          >
            <MenuItem sx={styles.menuItem} value={"en"}>
              <div style={styles.menuItemContainer}>
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <img src={gbFlag} style={styles.flagIcon} alt="GB-Flag" />
                </ListItemIcon>
                <ListItemText primary="English" />
              </div>
            </MenuItem>
            <MenuItem sx={styles.menuItem} value={"cs"}>
              <div style={styles.menuItemContainer}>
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <img src={czFlag} style={styles.flagIcon} alt="CZ-Flag" />
                </ListItemIcon>
                <ListItemText primary="Česky" />
              </div>
            </MenuItem>
          </Select>
        </FormControl>
      </Toolbar>
    </AppBar>
  );
});

const styles = {
  panel: {
    height: 50,
    justifyContent: "center",
    marginBottom: 3,
  },
  text: {
    flexGrow: 1,
    margin: 0,
  },
  select: {
    height: 35,
    width: 140,
    color: "white",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderWidth: "2px",
      borderColor: "white",
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
  },
  menu: {
    backgroundColor: "grey",
  },
  menuItem: {
    color: "white",
  },
  menuItemContainer: {
    display: "flex",
    alignItems: "center",
  },
  appIcon: {
    marginRight: 10,
    width: 36,
    height: 36,
  },
  flagIcon: {
    width: 20,
    height: 20,
    borderRadius: 5,
  },
};

export default TopPanel;
