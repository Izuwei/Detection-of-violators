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
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import config from "../config.json";

import { ThemeContext } from "../utils/ThemeProvider";

import DownloadIcon from "@mui/icons-material/Download";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

/**
 * Component is a screen that the user can access using a shared video link.
 */
const VideoScreen = memo((props) => {
  const { videoId } = useParams();
  const { t } = useTranslation();

  const { theme } = useContext(ThemeContext);

  const videoRef = useRef(null);
  const [data, setData] = useState(undefined);

  const urls = useMemo(
    () => ({
      video: `${config.server_url}:${config.express_port}/video/${videoId}`,
      data: `${config.server_url}:${config.express_port}/data/${videoId}`,
      download: `${config.server_url}:${config.express_port}/download/${videoId}`,
    }),
    [videoId]
  );

  /**
   * In component mounting phase, the function searches for detection
   * results on the server in JSON format and puts it into the object.
   */
  useEffect(() => {
    fetch(urls.data)
      .then((response) => response.json())
      .then((message) => {
        setData(message);
      })
      .catch((error) => {
        console.log("Video not found.");
      });
  }, [urls]);

  /**
   * Function sets video time to the specified time.
   *
   * @param {Int} newTime New video time in seconds.
   */
  const moveVideoTimestamp = useCallback((newTime) => {
    videoRef.current.currentTime = newTime;
  }, []);

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
    }),
    [theme]
  );

  return (
    <Box sx={{ maxWidth: "40%", minWidth: 500, margin: "auto" }}>
      {(() => {
        // Data not found
        if (data === undefined) {
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
              {t("VideoNotFound")}
            </p>
          );
        } else {
          // Data found
          return (
            <React.Fragment>
              <video
                ref={videoRef}
                width="100%"
                controls
                muted
                style={{ borderRadius: 4 }}
              >
                <source src={urls.video} />
              </video>
              <a href={urls.download}>
                <Tooltip title={t("Download")}>
                  <IconButton
                    size="large"
                    sx={{
                      marginTop: 1,
                      marginBottom: 1,
                      color: theme.primaryButton,
                      "&:hover": { backgroundColor: theme.primaryButtonHover },
                    }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </a>
              <Box sx={{ marginBottom: 2 }}>
                {Object.keys(data).map((key, index) => {
                  if (key === "person" && data[key].length !== 0) {
                    return data[key].map((person, personIdx) => (
                      <Accordion key={"p_" + personIdx} sx={styles.accordion}>
                        <AccordionSummary
                          expandIcon={
                            <ExpandMoreIcon
                              sx={{ color: theme.textPlaceholder }}
                            />
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
                            <Divider
                              orientation="horizontal"
                              sx={{ margin: 2, borderColor: theme.divider }}
                            />
                          </AccordionDetails>
                        ))}
                      </Accordion>
                    ));
                  } else if (key !== "person" && data[key].length !== 0) {
                    return (
                      <Accordion key={"o_" + index} sx={styles.accordion}>
                        <AccordionSummary
                          expandIcon={
                            <ExpandMoreIcon
                              sx={{ color: theme.textPlaceholder }}
                            />
                          }
                        >
                          <Typography sx={styles.accordionTitle}>
                            {t(key)}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ textAlign: "left" }}>
                          {data[key].map((time, timeIdx) => (
                            <Chip
                              key={"otime_" + timeIdx}
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
                        </AccordionDetails>
                      </Accordion>
                    );
                  } else return <React.Fragment key={"e_" + index} />;
                })}
              </Box>
            </React.Fragment>
          );
        }
      })()}
    </Box>
  );
});

export default VideoScreen;
