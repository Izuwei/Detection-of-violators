import React, { memo, useCallback, useContext, useMemo, useState } from "react";
import {
  Box,
  Divider,
  Icon,
  IconButton,
  ImageList,
  ImageListItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import { useSnackbar } from "notistack";

import { ThemeContext } from "../utils/ThemeProvider";
import { DataContext } from "../utils/DataProvider";
import newID from "../utils/IDgenerator";

import AddIcon from "@mui/icons-material/Add";
import RestartIcon from "@mui/icons-material/RestartAlt";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";

const FaceUpload = memo((props) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const { theme } = useContext(ThemeContext);
  const { recognitionDatabase, setRecognitionDatabase } =
    useContext(DataContext);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [images, setImages] = useState([]);

  const [firstnameError, setFirstnameError] = useState(false);
  const [lastnameError, setLastnameError] = useState(false);

  const handleReset = useCallback(() => {
    setFirstname("");
    setLastname("");
    setImages([]);
    setFirstnameError(false);
    setLastnameError(false);
  }, []);

  const handleAdd = useCallback(
    (event) => {
      if (firstname.length < 1) {
        setFirstnameError(true);
      }
      if (lastname.length < 1) {
        setLastnameError(true);
      }
      if (images.length < 1) {
        enqueueSnackbar(t("EmptyImageError"), { variant: "error" });
      }
      if (firstname.length < 1 || lastname.length < 1 || images.length < 1) {
        enqueueSnackbar(t("AddPersonError"), { variant: "error" });
      } else {
        setRecognitionDatabase((state) => [
          ...state,
          {
            id: newID(),
            firstname: firstname,
            lastname: lastname,
            images: images,
          },
        ]);
        enqueueSnackbar(t("Person added into database"), {
          variant: "success",
        });
        handleReset();
        console.log(recognitionDatabase);
      }
    },
    [
      firstname,
      lastname,
      images,
      enqueueSnackbar,
      t,
      setRecognitionDatabase,
      recognitionDatabase,
      handleReset,
    ]
  );

  const handleFirstnameChange = useCallback((event) => {
    setFirstname(event.target.value.replace(/\s/g, ""));
    setFirstnameError(false);
  }, []);

  const handleLastnameChange = useCallback((event) => {
    setLastname(event.target.value.replace(/\s/g, ""));
    setLastnameError(false);
  }, []);

  const handleRemoveItemDB = useCallback(
    (atIndex) => {
      setRecognitionDatabase((state) =>
        state.filter((value, index) => index !== atIndex)
      );
    },
    [setRecognitionDatabase]
  );

  const handleDropFile = useCallback((event) => {
    var fnb = [];

    for (let i = 0; i < event.length; i++) {
      fnb.push({
        id: newID(),
        file: event[i],
        url: URL.createObjectURL(event[i]),
      });
    }

    setImages((state) => state.concat(fnb));
  }, []);

  const handleDropError = useCallback(
    (event) => {
      enqueueSnackbar(t("ImageUploadErrorNotification"), { variant: "error" });
    },
    [enqueueSnackbar, t]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: "image/jpeg, image/png",
    multiple: true,
    maxSize: 200000000, // 200 MB
    onDropAccepted: handleDropFile,
    onDropRejected: handleDropError,
  });

  const dropzoneStyles = useMemo(
    () => ({
      ...baseStyles,
      backgroundColor: theme.dropZoneBackground,
      borderColor: theme.dropZoneBorder,
      ...(isFocused ? { borderColor: theme.primary } : {}),
      ...(isDragAccept ? { borderColor: theme.dropZoneBorderAccept } : {}),
      ...(isDragReject ? { borderColor: theme.dropZoneBorderReject } : {}),
    }),
    [isFocused, isDragAccept, isDragReject, theme]
  );

  const styles = useMemo(
    () => ({
      root: {
        width: "100%",
        display: "flex",
      },
      nameContainer: {
        display: "flex",
        flexDirection: "column",
        width: "50%",
        marginRight: 10,
      },
      uploadArea: {
        width: "46%",
        height: 100,
        marginLeft: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "baseline",
      },
      textInput: {
        margin: 0.2,
        width: "100%",
        ".MuiInput-root": {
          color: theme.text,
        },
        ".MuiInput-root:hover": {
          borderBottomColor: theme.text,
        },
        ".MuiInput-root:before": {
          borderBottomColor: theme.text,
        },
        ".MuiInput-root:after": {
          borderBottomColor: theme.primary,
        },
        "& .MuiInput-underline:hover:before": {
          borderBottomColor: theme.text,
        },
        "& .MuiInput-underline:hover:after": {
          borderBottomColor: theme.text,
        },
        ".MuiInputLabel-root": {
          color: theme.textPlaceholder,
        },
        ".MuiInputLabel-root.Mui-focused": {
          color: theme.primary,
        },
      },
      imageList: {
        display: "flex",
        marginBottom: 0,
        flexWrap: "nowrap",
        width: "100%",
        overflow: "display",
        backgroundColor: theme.dropZoneBackground,
        borderRadius: 1,
      },
      image: {
        borderRadius: 4,
      },
      DBcontainer: {
        width: "100%",
        height: 300,
        overflowY: "auto",
        border: 2,
        borderRadius: 4,
        borderColor: theme.dropZoneBorder,
        borderStyle: "solid",
      },
    }),
    [theme]
  );

  return (
    <React.Fragment>
      <div style={styles.root}>
        <div style={styles.nameContainer}>
          <TextField
            sx={styles.textInput}
            required
            onChange={handleFirstnameChange}
            value={firstname}
            error={firstnameError}
            label={t("Firstname")}
            variant="standard"
            helperText={firstnameError ? t("NameInputInfo") : ""}
          />
          <TextField
            sx={styles.textInput}
            required
            onChange={handleLastnameChange}
            value={lastname}
            error={lastnameError}
            label={t("Lastname")}
            variant="standard"
            helperText={lastnameError ? t("NameInputInfo") : ""}
          />
        </div>
        <div style={styles.uploadArea}>
          <div {...getRootProps({ style: dropzoneStyles })}>
            <input {...getInputProps()} />
            {isDragActive ? t("DragImageDesc") : t("DnDImageDesc")}
            <br />
            <p
              style={{
                fontSize: 12,
                fontStyle: "italic",
                marginTop: 2,
                marginBottom: 8,
              }}
            >
              .png, .jpg, .jpeg
            </p>
            <p style={{ fontSize: 14, margin: 0, fontFamily: "Consolas" }}>
              200 MB
            </p>
          </div>
        </div>
      </div>
      <ImageList
        sx={{ ...styles.imageList, marginTop: 2, height: 100 }}
        cols={3}
        rowHeight={100}
      >
        {images.map((item, index) => (
          <ImageListItem key={index}>
            <img
              style={{ ...styles.image, height: 100 }}
              src={item.url}
              alt={index}
            />
          </ImageListItem>
        ))}
      </ImageList>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Typography
          align="left"
          width="100%"
          variant="h6"
          sx={{ color: theme.primary }}
        >
          {t("Database")}
        </Typography>

        <Box
          sx={{
            display: "flex",
            marginLeft: "auto",
            marginRight: 0,
          }}
        >
          <Tooltip title={t("RecognitionInfo")}>
            <Icon
              fontSize="large"
              color="info"
              sx={{
                margin: "auto",
                display: "flex",
                width: 48,
                height: 48,
                cursor: "help",
              }}
            >
              <InfoIcon sx={{ margin: "auto" }} />
            </Icon>
          </Tooltip>
          <Tooltip title={t("Reset")}>
            <IconButton
              onClick={handleReset}
              size="large"
              sx={{
                margin: 0.8,
                color: theme.primary,
                "&:hover": { backgroundColor: theme.primaryButtonHover },
              }}
            >
              <RestartIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("Add")}>
            <IconButton
              onClick={handleAdd}
              size="large"
              sx={{
                margin: 0.8,
                color: theme.greenButton,
                "&:hover": {
                  backgroundColor: theme.greenButtonHover,
                },
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </div>
      <div style={styles.DBcontainer}>
        {recognitionDatabase.map((item, itemIdx) => (
          <div style={{ padding: "0px 4px 4px 4px", margin: 3 }} key={itemIdx}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ color: theme.text }} align="left" variant="h6">
                {item.firstname + " " + item.lastname}
              </Typography>
              <Tooltip title={t("Delete")}>
                <IconButton
                  onClick={() => handleRemoveItemDB(itemIdx)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
            <div style={{ padding: 4 }}>
              <ImageList
                sx={{ ...styles.imageList, margin: 0, height: 70 }}
                cols={3}
                rowHeight={70}
              >
                {item.images.map((image, imgIdx) => (
                  <ImageListItem key={imgIdx}>
                    <img
                      key={imgIdx}
                      style={{ ...styles.image, height: 70 }}
                      src={image.url}
                      alt={imgIdx}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </div>
            <Divider
              orientation="horizontal"
              sx={{ marginTop: 0.7, borderColor: theme.divider }}
            />
          </div>
        ))}
      </div>
    </React.Fragment>
  );
});

const baseStyles = {
  display: "flex",
  cursor: "pointer",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 18,
  height: "100%",
  width: "100%",
  borderWidth: 2,
  borderRadius: 4,
  borderStyle: "dashed",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

export default FaceUpload;
