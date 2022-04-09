/**
 * @author Jakub Sadilek
 *
 * Faculty of Information Technology
 * Brno University of Technology
 * 2022
 */

import React, { memo, useCallback, useContext, useMemo } from "react";
import {
  Box,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import { useSnackbar } from "notistack";

import { DataContext } from "../utils/DataProvider";
import { ThemeContext } from "../utils/ThemeProvider";

import InfoIcon from "@mui/icons-material/Info";
import ClearIcon from "@mui/icons-material/Clear";
import DocumentIcon from "@mui/icons-material/DocumentScanner";

const WeightsUpload = memo((props) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const { theme } = useContext(ThemeContext);
  const { weights, setWeights } = useContext(DataContext);

  /**
   * Function saves file with weights when it is dropped into the box.
   */
  const handleDropFile = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles !== 0) {
        setWeights(acceptedFiles[0]);
        enqueueSnackbar(t("WeightsUploadSuccessNotification"), {
          variant: "success",
        });
      }
    },
    [setWeights, enqueueSnackbar, t]
  );

  /**
   * Function notifies user when he tries to upload file with unsupported format.
   */
  const handleDropError = useCallback(
    (event) => {
      enqueueSnackbar(t("WeightsUploadErrorNotification"), {
        variant: "error",
      });
    },
    [enqueueSnackbar, t]
  );

  /**
   * Function removes uploaded file with weights.
   */
  const handleClear = useCallback(() => {
    setWeights(undefined);
  }, [setWeights]);

  /**
   * Setup for file dropzone.
   * @link https://react-dropzone.js.org/#section-styling-dropzone
   */
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: ".weights",
    multiple: false,
    maxFiles: 1,
    maxSize: 800000000, // 800 MB
    onDropAccepted: handleDropFile,
    onDropRejected: handleDropError,
  });

  const styles = useMemo(
    () => ({
      ...baseStyles,
      backgroundColor: theme.dropZoneBackground,
      borderColor: theme.dropZoneBorder,
      ...(isFocused ? { borderColor: theme.primary } : {}),
      ...(isDragAccept ? { borderColor: theme.primary } : {}),
      ...(isDragReject ? { borderColor: theme.primary } : {}),
    }),
    [isFocused, isDragAccept, isDragReject, theme]
  );

  const tableStyles = useMemo(
    () => ({
      cell: {
        padding: 1,
        color: theme.text,
      },
      text: {
        fontSize: 14,
        maxWidth: 120,
        margin: "auto",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
      },
    }),
    [theme]
  );

  return (
    <React.Fragment>
      {weights === undefined && (
        <div {...getRootProps({ style: styles })}>
          <input {...getInputProps()} />
          <p style={{ marginBottom: 0, marginLeft: 20, marginRight: 20 }}>
            {isDragActive ? t("DragWeightsDesc") : t("DnDWeightsDesc")}
          </p>
          <p style={{ fontSize: 14, fontStyle: "italic" }}>.weights</p>
          <p style={{ fontSize: 14, margin: 0, fontFamily: "Consolas" }}>
            800 MB
          </p>
        </div>
      )}
      {weights !== undefined && (
        <React.Fragment>
          <Icon
            color="info"
            sx={{
              margin: 2,
              display: "flex",
              width: 300,
              height: 300,
            }}
          >
            <DocumentIcon
              sx={{
                margin: "auto",
                color: theme.primary,
                width: 300,
                height: 300,
              }}
            />
          </Icon>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableStyles.cell} align="center">
                  {t("Name")}
                </TableCell>
                <TableCell sx={tableStyles.cell} align="center">
                  {t("Size")}
                </TableCell>
                <TableCell sx={tableStyles.cell} align="center">
                  {t("Modified")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key="weights-details">
                <TableCell
                  sx={{ borderBottom: "none", ...tableStyles.cell }}
                  align="center"
                >
                  <Typography noWrap={true} sx={tableStyles.text}>
                    {weights.name}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{ borderBottom: "none", ...tableStyles.cell }}
                  align="center"
                >
                  <Typography sx={tableStyles.text}>
                    {(weights.size / 1000000).toFixed(2)} MB
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{ borderBottom: "none", ...tableStyles.cell }}
                  align="center"
                >
                  <Typography sx={tableStyles.text}>
                    {new Date(weights.lastModified).toDateString()}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </React.Fragment>
      )}
      <Box sx={{ display: "flex", alignContent: "center", marginTop: 1 }}>
        <Tooltip title={t("WeightsInfo")}>
          <Icon
            fontSize="large"
            color="info"
            sx={{
              margin: 0.8,
              display: "flex",
              width: 48,
              height: 48,
              cursor: "help",
            }}
          >
            <InfoIcon sx={{ margin: "auto" }} />
          </Icon>
        </Tooltip>
        {weights !== undefined && (
          <Tooltip title={t("Delete")}>
            <IconButton
              sx={{
                margin: 0.8,
                color: theme.primaryButton,
                "&:hover": { background: theme.primaryButtonHover },
              }}
              size="large"
              onClick={handleClear}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </React.Fragment>
  );
});

const baseStyles = {
  display: "flex",
  cursor: "pointer",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 22,
  height: 400,
  width: "100%",
  borderWidth: 2,
  borderRadius: 4,
  borderStyle: "dashed",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

export default WeightsUpload;
