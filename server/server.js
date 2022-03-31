const config = require("./config.json");
const utils = require("./utils");

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

var SocketIOFileUpload = require("socketio-file-upload");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: config.client_url + ":" + config.client_port,
  })
);

const io = require("socket.io")(config.socket_port, {
  cors: {
    origin: [config.client_url + ":" + config.client_port],
  },
});

/**
 * Setup temporary folder.
 */
var tmpDir = path.join(__dirname, "tmp");
if (fs.existsSync(tmpDir)) {
  fs.rmSync(tmpDir, { recursive: true });
}
fs.mkdirSync(tmpDir);

console.log("TmpDir location: " + tmpDir);

/**
 * Setup video folder.
 */
var videoDir = path.join(__dirname, "videos");
if (fs.existsSync(videoDir)) {
  fs.rmSync(videoDir, { recursive: true });
}
fs.mkdirSync(videoDir);

console.log("Videos location: " + videoDir);

/**
 * Socket.io
 */
io.on("connection", (socket) => {
  var videoPath = "";
  var pythonProcess = undefined;

  const clientTmpDir = path.join(tmpDir, socket.id);
  fs.mkdirSync(clientTmpDir);

  const clientDatabaseDir = path.join(clientTmpDir, "database");
  fs.mkdirSync(clientDatabaseDir);

  var siofu = new SocketIOFileUpload({ topicName: "video" });
  siofu.dir = clientTmpDir;
  siofu.listen(socket);

  siofu.on("saved", (event) => {
    videoPath = event.file.pathName;
  });

  siofu.on("error", (event) => {
    socket.emit("upload_error", event);
    console.log("Video upload error", event);
  });

  var faceUpload = new SocketIOFileUpload({ topicName: "faces" });
  faceUpload.dir = clientDatabaseDir;
  faceUpload.listen(socket);

  faceUpload.on("error", (event) => {
    socket.emit("face_upload_error", event);
    console.log("Face upload error", event);
  });

  socket.on("start-detection", (data) => {
    console.log("Processing: " + videoPath);
    const args = utils.parseArgsCLI(data);

    pythonProcess = spawn(
      "python",
      [
        config.python_program,
        "--input",
        videoPath,
        "--output",
        videoDir,
        "--name",
        socket.id,
        "--database",
        clientDatabaseDir,
      ].concat(args),
      {
        cwd: "./src",
      }
    );

    pythonProcess.stdout.on("data", (data) => {
      const text = data.toString();
      if (text.match(/^Progress:/)) {
        socket.emit("progress", parseInt(text.split(" ")[1]));
      }
    });

    pythonProcess.stderr.on("data", (data) => {
      console.log(data.toString());
    });

    pythonProcess.on("close", (code) => {
      console.log("Python ended with: " + code);

      if (code === 0) {
        socket.emit("processed", {
          videoURL: `${config.server_url}:${config.express_port}/video/${socket.id}`,
          downloadURL: `${config.server_url}:${config.express_port}/download/${socket.id}`,
          dataURL: `${config.server_url}:${config.express_port}/data/${socket.id}`,
        });
      } else {
        socket.emit("process_error", code);
      }
    });

    pythonProcess.on("exit", () => {
      if (fs.existsSync(clientTmpDir)) {
        fs.rmSync(clientTmpDir, { recursive: true });
      }
    });
  });

  socket.on("disconnect", () => {
    if (pythonProcess !== undefined) {
      pythonProcess.kill("SIGINT");
    } else if (fs.existsSync(clientTmpDir)) {
      fs.rmSync(clientTmpDir, { recursive: true });
    }
  });
});

/**
 * Express.js
 */
const videoRouter = require("./routes/video");
const downloadRouter = require("./routes/download");
const dataRouter = require("./routes/data");

app.use("/video", videoRouter);
app.use("/download", downloadRouter);
app.use("/data", dataRouter);

app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.listen(config.express_port);

// Delete each video file after 24 hours, check every hour
setInterval(() => utils.deleteFiles(__dirname + "/videos", 86400000), 3600000);
