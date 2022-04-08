/**
 * @author Jakub Sadilek
 *
 * Faculty of Information Technology
 * Brno University of Technology
 * 2022
 */

import React, { memo, useCallback, useContext, useMemo, useState } from "react";
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
  IconButton,
  Drawer,
  Box,
  List,
  ListItem,
  Divider,
  Chip,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";

import { ThemeContext } from "../utils/ThemeProvider";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from "@mui/icons-material/GitHub";

import gbFlag from "../assets/icons/gb_flag.svg";
import czFlag from "../assets/icons/cz_flag.svg";
import appIcon from "../assets/icons/app_icon.svg";

/**
 * Function renders top panel of the application.
 */
const TopPanel = memo(() => {
  const { t, i18n } = useTranslation();
  const [, setCookie] = useCookies(["lang"]);

  const { theme, changeTheme } = useContext(ThemeContext);

  const [openDrawer, setOpenDrawer] = useState(false);

  /**
   * Function changes language of the application.
   *
   * @param {Object} event Event carrying selected language code.
   */
  const onLanguageChange = useCallback(
    (event) => {
      const lang = event.target.value;
      setCookie("lang", lang, {
        path: "/",
        maxAge: 604800,
        secure: true,
        sameSite: "none",
      }); // week == 604800 seconds
      i18n.changeLanguage(lang);
    },
    [i18n, setCookie]
  );

  const styles = useMemo(
    () => ({
      panel: {
        height: 50,
        justifyContent: "center",
        marginBottom: 3,
        minWidth: 500,
        backgroundColor: theme.panel,
      },
      text: {
        flexGrow: 1,
        margin: 0,
      },
      select: {
        height: 35,
        width: 180,
        color: theme.text,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.textFieldOutline,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.text,
        },
        ".MuiSvgIcon-root.MuiSelect-icon": {
          fill: theme.selectDropDownIcon,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.primary,
        },
      },
      form: {
        "& label.Mui-focused": {
          color: theme.primary,
        },
      },
      menu: {
        backgroundColor: theme.accordionBackground,
      },
      menuItem: {
        color: theme.text,
        "&.MuiMenuItem-root:hover": {
          backgroundColor: theme.itemHover,
        },
        "&.MuiMenuItem-root.Mui-selected": {
          backgroundColor: theme.itemSelected,
        },
      },
      menuItemContainer: {
        display: "flex",
        alignItems: "center",
      },
      linkItem: {
        "&:hover": {
          backgroundColor: theme.itemHover,
        },
      },
      appIcon: {
        marginRight: 10,
        width: 36,
        height: 36,
      },
      selectItemIcon: {
        minWidth: 0,
        marginRight: 2,
        width: 20,
        height: 20,
      },
      flagIcon: {
        width: 20,
        height: 20,
        borderRadius: 5,
      },
      linkText: {
        color: theme.text,
        fontWeight: 500,
      },
      settingsItemSelect: {
        display: "flex",
        justifyContent: "center",
      },
      divider: {
        marginTop: 1,
        marginBottom: 1,
        "&:before": {
          borderColor: theme.divider,
        },
        "&:after": {
          borderColor: theme.divider,
        },
      },
      chip: {
        color: theme.text,
        backgroundColor: theme.chipBackground,
      },
    }),
    [theme]
  );

  return (
    <AppBar position="static" sx={styles.panel}>
      <Toolbar>
        <img src={appIcon} style={styles.appIcon} alt="app-icon" />
        <Typography variant="h5" component="div" align="left" sx={styles.text}>
          {t("AppName")}
        </Typography>
        <Tooltip title={t("Menu")}>
          <IconButton size="large" onClick={() => setOpenDrawer(true)}>
            <MenuIcon sx={{ color: theme.menuIcon }} />
          </IconButton>
        </Tooltip>
        <Drawer
          anchor="right"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        >
          <Box
            sx={{
              width: 250,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: theme.background,
            }}
          >
            <div>
              <Divider sx={{ ...styles.divider }}>
                <Chip sx={styles.chip} label={t("Links")} />
              </Divider>
              <List sx={{ width: "100%" }}>
                <a
                  style={{ textDecoration: "none" }}
                  href="https://github.com/Izuwei/Detection-of-violators"
                >
                  <ListItem button sx={styles.linkItem}>
                    <ListItemIcon>
                      <GitHubIcon sx={{ color: theme.primary }} />
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      sx={styles.linkText}
                      primary="GitHub"
                    />
                  </ListItem>
                </a>
              </List>
            </div>
            <div>
              <Divider sx={styles.divider}>
                <Chip sx={styles.chip} label={t("Settings")} />
              </Divider>
              <List sx={{ width: "100%" }}>
                <ListItem sx={styles.settingsItemSelect}>
                  <FormControl sx={styles.form}>
                    <InputLabel id="theme-select-label" sx={styles.menuItem}>
                      {t("Language")}
                    </InputLabel>
                    <Select
                      value={i18n.language}
                      onChange={onLanguageChange}
                      labelId="language-select-label"
                      label={t("Language")}
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
                          <ListItemIcon sx={styles.selectItemIcon}>
                            <img
                              src={gbFlag}
                              style={styles.flagIcon}
                              alt="GB-Flag"
                            />
                          </ListItemIcon>
                          <ListItemText primary="English" />
                        </div>
                      </MenuItem>
                      <MenuItem sx={styles.menuItem} value={"cs"}>
                        <div style={styles.menuItemContainer}>
                          <ListItemIcon sx={styles.selectItemIcon}>
                            <img
                              src={czFlag}
                              style={styles.flagIcon}
                              alt="CZ-Flag"
                            />
                          </ListItemIcon>
                          <ListItemText primary="Česky" />
                        </div>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
                <ListItem sx={styles.settingsItemSelect}>
                  <FormControl sx={styles.form}>
                    <InputLabel
                      id="theme-select-label"
                      sx={{ ...styles.menuItem, ...styles.selectLabel }}
                    >
                      {t("Theme")}
                    </InputLabel>
                    <Select
                      value={theme.name}
                      onChange={(event) => changeTheme(event.target.value)}
                      labelId="theme-select-label"
                      label={t("language")}
                      variant="outlined"
                      sx={styles.select}
                      MenuProps={{
                        PaperProps: {
                          style: styles.menu,
                        },
                      }}
                    >
                      <MenuItem sx={styles.menuItem} value={"light"}>
                        <div style={styles.menuItemContainer}>
                          <ListItemIcon sx={styles.selectItemIcon}>
                            <LightModeIcon
                              sx={{ color: theme.lightModeIcon }}
                            />
                          </ListItemIcon>
                          <ListItemText primary={t("Light")} />
                        </div>
                      </MenuItem>
                      <MenuItem sx={styles.menuItem} value={"dark"}>
                        <div style={styles.menuItemContainer}>
                          <ListItemIcon sx={styles.selectItemIcon}>
                            <DarkModeIcon sx={{ color: theme.darkModeIcon }} />
                          </ListItemIcon>
                          <ListItemText primary={t("Dark")} />
                        </div>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
              </List>
            </div>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
});

export default TopPanel;
