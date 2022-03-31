import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Icon,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

import { DataContext } from "../utils/DataProvider";
import { StepContext } from "../utils/StepProvider";
import config from "../config.json";

import InfoIcon from "@mui/icons-material/Info";
import DownloadIcon from "@mui/icons-material/Download";
import RestartIcon from "@mui/icons-material/RestartAlt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PersonIcon from "@mui/icons-material/Person";

const SummaryScreen = memo((props) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { resetStep } = useContext(StepContext);
  const { video, processedVideo, recognitionDatabase } =
    useContext(DataContext);

  const videoRef = useRef(null);
  const [videoData, setVideoData] = useState({});

  const shareLink = `${config.client_url}:${
    config.client_port
  }/video/${processedVideo.videoURL.split("/").pop()}`;

  const copyToClipboard = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareLink);
      enqueueSnackbar(t("LinkCopiedToClipboard"), {
        variant: "success",
      });
    }
  }, [shareLink, enqueueSnackbar, t]);

  const moveVideoTimestamp = useCallback((newTime) => {
    videoRef.current.currentTime = newTime;
  }, []);

  const getImageUrlByID = useCallback(
    (personID, imageID) => {
      const personImages = recognitionDatabase.find(
        (p) => p.id === personID
      ).images;
      return personImages.find((img) => img.id === imageID).url;
    },
    [recognitionDatabase]
  );

  useEffect(() => {
    fetch(processedVideo.dataURL)
      .then((response) => response.json())
      .then((message) => {
        console.log(message);
        setVideoData(message);
      })
      .catch((error) => {
        enqueueSnackbar(t("DetectionDataError"), {
          variant: "error",
        });
      });
  }, [processedVideo, enqueueSnackbar, t]);

  return (
    <Box sx={{ maxWidth: "40%", minWidth: 500, margin: "auto" }}>
      <video
        ref={videoRef}
        width={video.aspectRatio < 1.5 && video.height > 400 ? 500 : "100%"}
        controls
        muted
        style={{ borderRadius: 4 }}
      >
        <source src={processedVideo.videoURL} />
      </video>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        <Tooltip title={t("CopyToClipboard")}>
          <TextField
            variant="outlined"
            label={t("ShareLink")}
            defaultValue={shareLink}
            onClick={copyToClipboard}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              width: 380,
              ".MuiOutlinedInput-input:hover": {
                cursor: "pointer",
              },
            }}
          />
        </Tooltip>
        <div
          style={{
            display: "flex",
            contentAlign: "center",
            justifyContent: "center",
          }}
        >
          <Tooltip title={t("SummaryInfo")}>
            <Icon
              fontSize="large"
              color="info"
              sx={{
                margin: "auto",
                display: "flex",
                width: 58,
                height: 58,
                cursor: "help",
              }}
            >
              <InfoIcon sx={{ margin: "auto" }} />
            </Icon>
          </Tooltip>
          <Tooltip title={t("Download")}>
            <a href={processedVideo.downloadURL}>
              <IconButton color="info" size="large" sx={styles.icons}>
                <DownloadIcon />
              </IconButton>
            </a>
          </Tooltip>
          <Tooltip title={t("StartAgain")}>
            <IconButton
              color="error"
              size="large"
              sx={styles.icons}
              onClick={resetStep}
            >
              <RestartIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Box>
      <Box>
        {Object.keys(videoData).map((key, index) => {
          if (key === "person" && videoData[key].length !== 0) {
            return videoData[key].map((person, personIdx) => (
              <Accordion key={"p_" + personIdx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ color: "#1976d2", fontWeight: 500 }}>
                    {person.name === "Unknown"
                      ? t("UnknownPerson")
                      : person.name}
                  </Typography>
                </AccordionSummary>
                {person.detections.map((detection, detectionIdx) => (
                  <AccordionDetails
                    key={"det_" + detectionIdx}
                    sx={{
                      paddingTop: 0,
                      paddingRight: 2,
                      paddingBottom: 0,
                      paddingLeft: 2,
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      <div style={{ width: "15%" }}>
                        {person.name === "Unknown" ? (
                          <PersonIcon sx={{ width: "100%", height: "100%" }} />
                        ) : (
                          <img
                            style={{ width: "100%", borderRadius: 4 }}
                            src={getImageUrlByID(
                              parseInt(person.id),
                              parseInt(detection.id)
                            )}
                            alt={person.id}
                          />
                        )}
                      </div>
                      <div
                        style={{
                          width: "85%",
                          textAlign: "left",
                          padding: 10,
                        }}
                      >
                        {detection.timestamp.map((time, timeIdx) => (
                          <Chip
                            key={"ptime_" + timeIdx}
                            sx={{ margin: 0.4 }}
                            label={new Date(time * 1000)
                              .toISOString()
                              .substr(11, 8)}
                            onDelete={() => moveVideoTimestamp(time)}
                            deleteIcon={
                              <Tooltip title={t("Move")}>
                                <PlayCircleIcon />
                              </Tooltip>
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <Divider orientation="horizontal" sx={{ margin: 2 }} />
                  </AccordionDetails>
                ))}
              </Accordion>
            ));
          } else if (key !== "person" && videoData[key].length !== 0) {
            return (
              <Accordion key={"o_" + index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ color: "#1976d2", fontWeight: 500 }}>
                    {t(key)}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ textAlign: "left" }}>
                  {videoData[key].map((time, timeIdx) => (
                    <Chip
                      key={"otime_" + timeIdx}
                      sx={{ margin: 0.4 }}
                      label={new Date(time * 1000).toISOString().substr(11, 8)}
                      onDelete={() => moveVideoTimestamp(time)}
                      deleteIcon={
                        <Tooltip title={t("Move")}>
                          <PlayCircleIcon />
                        </Tooltip>
                      }
                    />
                  ))}
                </AccordionDetails>
              </Accordion>
            );
          } else return <React.Fragment key={"e_" + index} />;
        })}
      </Box>
    </Box>
  );
});

const styles = {
  icons: {
    width: 50,
    height: 50,
    margin: 0.5,
  },
};

export default SummaryScreen;
