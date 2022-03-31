import React, {
  memo,
  useCallback,
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

import DownloadIcon from "@mui/icons-material/Download";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

const VideoScreen = memo((props) => {
  const { videoId } = useParams();
  const { t } = useTranslation();

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

  const moveVideoTimestamp = useCallback((newTime) => {
    videoRef.current.currentTime = newTime;
  }, []);

  return (
    <Box sx={{ maxWidth: "40%", minWidth: 500, margin: "auto" }}>
      {(() => {
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
                color: "#1976d2",
              }}
            >
              {t("VideoNotFound")}
            </p>
          );
        } else {
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
              <Tooltip title={t("Download")}>
                <a href={urls.download}>
                  <IconButton
                    color="info"
                    size="large"
                    sx={{
                      width: 50,
                      height: 50,
                      marginTop: 1,
                      marginBottom: 1,
                    }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </a>
              </Tooltip>
              <Box sx={{ marginBottom: 2 }}>
                {Object.keys(data).map((key, index) => {
                  if (key === "person" && data[key].length !== 0) {
                    return data[key].map((person, personIdx) => (
                      <Accordion key={"p_" + personIdx}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography
                            sx={{ color: "#1976d2", fontWeight: 500 }}
                          >
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
                            <Divider
                              orientation="horizontal"
                              sx={{ margin: 2 }}
                            />
                          </AccordionDetails>
                        ))}
                      </Accordion>
                    ));
                  } else if (key !== "person" && data[key].length !== 0) {
                    return (
                      <Accordion key={"o_" + index}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography
                            sx={{ color: "#1976d2", fontWeight: 500 }}
                          >
                            {t(key)}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ textAlign: "left" }}>
                          {data[key].map((time, timeIdx) => (
                            <Chip
                              key={"otime_" + timeIdx}
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
