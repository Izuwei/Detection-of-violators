/**
 * @author Jakub Sadilek
 *
 * Faculty of Information Technology
 * Brno University of Technology
 * 2022
 */

import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

import config from "../config.json";

import { ThemeContext } from "../utils/ThemeProvider";
import { DataContext } from "../utils/DataProvider";
import { StepContext } from "../utils/StepProvider";

import InfoIcon from "@mui/icons-material/Info";
import DownloadIcon from "@mui/icons-material/Download";
import RestartIcon from "@mui/icons-material/RestartAlt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PersonIcon from "@mui/icons-material/Person";

/**
 * Component represents screen with detection results to which
 * the user is redirected after his video is completely processed.
 */
const SummaryScreen = memo((props) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const { theme } = useContext(ThemeContext);
  const { resetStep } = useContext(StepContext);
  const { video, processedVideo, recognitionDatabase } =
    useContext(DataContext);

  const videoRef = useRef(null);
  const [videoData, setVideoData] = useState({});

  // Link for share
  const shareLink = `${config.client_url}:${
    config.client_port
  }/video/${processedVideo.videoURL.split("/").pop()}`;

  /**
   * Function stores a share link to the clipboard.
   */
  const copyToClipboard = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareLink);
      enqueueSnackbar(t("LinkCopiedToClipboard"), {
        variant: "success",
      });
    }
  }, [shareLink, enqueueSnackbar, t]);

  /**
   * Function sets video time to the specified time.
   *
   * @param {Int} newTime New video time in seconds.
   */
  const moveVideoTimestamp = useCallback((newTime) => {
    videoRef.current.currentTime = newTime;
  }, []);

  /**
   * Function searches for the face image in structure created by user
   * by person id and face id and returns its url.
   */
  const getImageUrlByID = useCallback(
    (personID, imageID) => {
      const personImages = recognitionDatabase.find(
        (p) => p.id === personID
      ).images;
      return personImages.find((img) => img.id === imageID).url;
    },
    [recognitionDatabase]
  );

  /**
   * In component mounting phase, the function searches for detection
   * results on the server in JSON format and puts it into the object.
   */
  useEffect(() => {
    fetch(processedVideo.dataURL)
      .then((response) => response.json())
      .then((message) => {
        // console.log(message);
        setVideoData(message);
      })
      .catch((error) => {
        enqueueSnackbar(t("DetectionDataError"), {
          variant: "error",
        });
      });
  }, [processedVideo, enqueueSnackbar, t]);

  const styles = useMemo(
    () => ({
      accordion: {
        backgroundColor: theme.accordionBackground,
      },
      accordionTitle: {
        color: theme.primary,
        fontWeight: 500,
      },
      chip: {
        margin: 0.4,
        color: theme.text,
        backgroundColor: theme.chipBackground,
      },
      chipIcon: {
        fill: theme.primary,
      },
      icons: {
        width: 50,
        height: 50,
        margin: 0.5,
      },
    }),
    [theme]
  );

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
              // Text color
              ".MuiOutlinedInput-root": {
                color: theme.text,
              },
              "& .MuiOutlinedInput-root": {
                // Border color
                "& fieldset": {
                  borderColor: theme.textFieldOutline,
                },
                // Border color on hover effect
                "&:hover fieldset": {
                  borderColor: theme.text,
                },
                // Border color on focus
                "&.Mui-focused fieldset": {
                  borderColor: theme.primary,
                },
              },
              // Label color
              ".MuiInputLabel-root": {
                color: theme.text,
              },
              // Label focused color
              ".MuiInputLabel-root.Mui-focused": {
                color: theme.primary,
              },
              // Cursor icon on hover effect
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
          <a href={processedVideo.downloadURL}>
            <Tooltip title={t("Download")}>
              <IconButton
                size="large"
                sx={{
                  ...styles.icons,
                  color: theme.primaryButton,
                  "&:hover": { backgroundColor: theme.primaryButtonHover },
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </a>
          <Tooltip title={t("StartAgain")}>
            <IconButton
              size="large"
              sx={{
                ...styles.icons,
                color: "#de0000",
                "&:hover": { backgroundColor: theme.redButtonHover },
              }}
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
              <Accordion key={"p_" + personIdx} sx={styles.accordion}>
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon sx={{ color: theme.textPlaceholder }} />
                  }
                >
                  <Typography sx={styles.accordionTitle}>
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
                          <PersonIcon
                            sx={{
                              width: "100%",
                              height: "100%",
                              color: theme.text,
                            }}
                          />
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
                            sx={styles.chip}
                            label={new Date(time * 1000)
                              .toISOString()
                              .substr(11, 8)}
                            onDelete={() => moveVideoTimestamp(time)}
                            deleteIcon={
                              <Tooltip title={t("Move")}>
                                <PlayCircleIcon sx={styles.chipIcon} />
                              </Tooltip>
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <Divider
                      orientation="horizontal"
                      sx={{ margin: 2, borderColor: theme.divider }}
                    />
                  </AccordionDetails>
                ))}
              </Accordion>
            ));
          } else if (key !== "person" && videoData[key].length !== 0) {
            return (
              <Accordion key={"o_" + index} sx={styles.accordion}>
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon sx={{ color: theme.textPlaceholder }} />
                  }
                >
                  <Typography sx={styles.accordionTitle}>{t(key)}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ textAlign: "left" }}>
                  {videoData[key].map((time, timeIdx) => (
                    <Chip
                      key={"otime_" + timeIdx}
                      sx={styles.chip}
                      label={new Date(time * 1000).toISOString().substr(11, 8)}
                      onDelete={() => moveVideoTimestamp(time)}
                      deleteIcon={
                        <Tooltip title={t("Move")}>
                          <PlayCircleIcon sx={styles.chipIcon} />
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

export default SummaryScreen;
