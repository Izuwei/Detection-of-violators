import React, { memo, useCallback, useContext } from "react";
import {
  Avatar,
  Icon,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import RadarIcon from "@mui/icons-material/Radar";
import CarIcon from "@mui/icons-material/DirectionsCar";
import FaceIcon from "@mui/icons-material/Face";
import RouteIcon from "@mui/icons-material/Route";
import GestureIcon from "@mui/icons-material/Gesture";
import StraightenIcon from "@mui/icons-material/Straighten";
import NumbersIcon from "@mui/icons-material/Numbers";
import TimeIcon from "@mui/icons-material/AccessTime";

import { DataContext } from "../utils/DataProvider";

const InfoIconContainer = (props) => {
  return (
    <Tooltip title={props.title}>
      <Icon color="info" sx={{ marginLeft: 1 }}>
        <InfoIcon />
      </Icon>
    </Tooltip>
  );
};

const SelectedIcon = (props) => {
  return (
    <React.Fragment>
      {props.value === true ? (
        <Icon color="success">
          <DoneIcon />
        </Icon>
      ) : (
        <Icon color="error">
          <CloseIcon />
        </Icon>
      )}
      <InfoIconContainer title={props.title} />
    </React.Fragment>
  );
};

const ProcessConfig = memo((props) => {
  const { t } = useTranslation();
  const { procConfig, setProcConfig } = useContext(DataContext);

  const handleTrackingClick = useCallback(() => {
    if (procConfig.tracking === true) {
      setProcConfig((state) => ({
        ...state,
        tracking: false,
        tracks: false,
        counters: false,
      }));
    } else {
      setProcConfig((state) => ({ ...state, tracking: true }));
    }
    console.log(procConfig);
  }, [procConfig, setProcConfig]);

  return (
    <List
      component="nav"
      sx={{ width: "100%" }}
      subheader={<ListSubheader component="div">{t("Options")}</ListSubheader>}
    >
      <ListItem
        sx={{ ...styles.item, height: 48 }}
        secondaryAction={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <ToggleButtonGroup
              size="small"
              color="primary"
              value={procConfig.model}
              sx={{ marginRight: 8.5 }}
              exclusive
              onChange={(event) =>
                setProcConfig((state) => ({
                  ...state,
                  model: event.target.value,
                }))
              }
            >
              <ToggleButton value="high">{t("High")}</ToggleButton>
              <ToggleButton value="medium">{t("Medium")}</ToggleButton>
            </ToggleButtonGroup>
            <InfoIconContainer title={t("ModelAccuracyInfo")} />
          </div>
        }
      >
        <ListItemAvatar>
          <Avatar sx={styles.avatar}>
            <TimeIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={t("ModelAccuracy")} />
      </ListItem>
      <ListItem
        disabled
        disablePadding
        sx={styles.item}
        secondaryAction={
          <SelectedIcon value={true} title={t("ObjectDetectionInfo")} />
        }
      >
        <ListItemButton sx={styles.listButton}>
          <ListItemAvatar>
            <Avatar sx={styles.avatar}>
              <RadarIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={t("ObjectDetection")} />
        </ListItemButton>
      </ListItem>
      <ListItem
        disablePadding
        sx={styles.item}
        secondaryAction={
          <SelectedIcon value={procConfig.cars} title={t("CarDetectionInfo")} />
        }
      >
        <ListItemButton
          sx={styles.listButton}
          onClick={() =>
            setProcConfig((state) => ({ ...state, cars: !state.cars }))
          }
        >
          <ListItemAvatar sx={{ pl: 6 }}>
            <Avatar sx={styles.avatar}>
              <CarIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={t("CarDetection")} />
        </ListItemButton>
      </ListItem>
      <ListItem
        disablePadding
        sx={styles.item}
        secondaryAction={
          <SelectedIcon
            value={procConfig.recognition}
            title={t("FaceRecognitionInfo")}
          />
        }
      >
        <ListItemButton
          sx={styles.listButton}
          onClick={() =>
            setProcConfig((state) => ({
              ...state,
              recognition: !state.recognition,
            }))
          }
        >
          <ListItemAvatar>
            <Avatar sx={styles.avatar}>
              <FaceIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={t("FaceRecognition")} />
        </ListItemButton>
      </ListItem>
      <ListItem
        disablePadding
        sx={styles.item}
        secondaryAction={
          <SelectedIcon
            value={procConfig.tracking}
            title={t("ObjectTrackingInfo")}
          />
        }
      >
        <ListItemButton sx={styles.listButton} onClick={handleTrackingClick}>
          <ListItemAvatar>
            <Avatar sx={styles.avatar}>
              <RouteIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={t("ObjectTracking")} />
        </ListItemButton>
      </ListItem>
      <ListItem
        disabled={procConfig.tracking === false}
        disablePadding
        sx={styles.item}
        secondaryAction={
          <SelectedIcon
            value={procConfig.counters}
            title={t("DisplayCountersInfo")}
          />
        }
      >
        <ListItemButton
          sx={styles.listButton}
          onClick={() =>
            setProcConfig((state) => ({
              ...state,
              counters: !state.counters,
            }))
          }
        >
          <ListItemAvatar sx={{ pl: 6 }}>
            <Avatar sx={styles.avatar}>
              <NumbersIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={t("DisplayCounters")} />
        </ListItemButton>
      </ListItem>
      <ListItem
        disabled={procConfig.tracking === false}
        disablePadding
        sx={styles.item}
        secondaryAction={
          <SelectedIcon
            value={procConfig.tracks}
            title={t("DrawingTracksInfo")}
          />
        }
      >
        <ListItemButton
          sx={styles.listButton}
          onClick={() =>
            procConfig.tracking === true &&
            setProcConfig((state) => ({ ...state, tracks: !state.tracks }))
          }
        >
          <ListItemAvatar sx={{ pl: 6 }}>
            <Avatar sx={styles.avatar}>
              <GestureIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={t("DrawingTracks")} />
        </ListItemButton>
      </ListItem>
      <ListItem
        disabled={procConfig.tracks === false}
        sx={{ ...styles.item, height: 48 }}
        secondaryAction={
          <div style={{ display: "flex", alignItems: "center" }}>
            <Slider
              disabled={procConfig.tracks === false}
              sx={{ width: 220 }}
              defaultValue={1.5}
              onChange={(event) =>
                setProcConfig((state) => ({
                  ...state,
                  trackLen: event.target.value,
                }))
              }
              valueLabelDisplay="auto"
              step={0.5}
              marks
              min={0.5}
              max={10}
            />
            <InfoIconContainer title={t("TrackLengthInfo")} />
          </div>
        }
      >
        <ListItemAvatar sx={{ pl: 12 }}>
          <Avatar sx={styles.avatar}>
            <StraightenIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={t("Length")} />
      </ListItem>
      <ListItem
        disablePadding
        sx={styles.item}
        secondaryAction={
          <SelectedIcon
            value={procConfig.timestamp}
            title={t("DisplayTimestampInfo")}
          />
        }
      >
        <ListItemButton
          sx={styles.listButton}
          onClick={() =>
            setProcConfig((state) => ({
              ...state,
              timestamp: !state.timestamp,
            }))
          }
        >
          <ListItemAvatar>
            <Avatar sx={styles.avatar}>
              <TimeIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={t("DisplayTimestamp")} />
        </ListItemButton>
      </ListItem>
    </List>
  );
});

const styles = {
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: "#1976d2",
  },
  item: {
    margin: 0,
  },
  listButton: {
    borderRadius: 1,
  },
};

export default ProcessConfig;
