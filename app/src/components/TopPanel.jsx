import React from "react";
import { AppBar, Toolbar, Typography, Select, MenuItem } from "@mui/material";

const TopPanel = () => {
  return (
    <AppBar position="static" sx={styles.panel}>
      <Toolbar>
        <Typography
          variant="h5"
          component="div"
          align="center"
          sx={styles.text}
        >
          Detection of Violators
        </Typography>
        <Select
          variant="outlined"
          sx={styles.select}
          MenuProps={{
            PaperProps: {
              style: styles.menu,
            },
          }}
        >
          <MenuItem sx={styles.menuItem} value={"en"}>
            English
          </MenuItem>
          <MenuItem sx={styles.menuItem} value={"cs"}>
            Česky
          </MenuItem>
        </Select>
      </Toolbar>
    </AppBar>
  );
};

const styles = {
  panel: {
    height: 50,
    justifyContent: "center",
  },
  text: {
    flexGrow: 1,
    margin: 0,
  },
  select: {
    height: 35,
    width: 100,
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
};

export default TopPanel;
