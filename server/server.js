const config = require("./config.json");

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

var SocketIOFileUpload = require("socketio-file-upload");

const express = require("express");
const app = express();

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
  const clientTmpDir = path.join(tmpDir, socket.id);
  fs.mkdirSync(clientTmpDir);

  var siofu = new SocketIOFileUpload();
  siofu.dir = clientTmpDir;
  siofu.listen(socket);

  siofu.on("saved", (event) => {
    console.log(event.file);
    videoPath = event.file.pathName;
  });

  siofu.on("error", (event) => {
    // TODO: dodělat ošetření pak ke klientský straně
    console.log("Error from uploader", event);
  });

  socket.on("start-detection", (data) => {
    console.log("Processing: " + videoPath);

    const python = spawn(
      "python",
      [
        config.python_program,
        "--input",
        videoPath,
        "--output",
        videoDir,
        "--name",
        socket.id,
      ],
      {
        cwd: "./src",
      }
    );

    // TODO: dodělat výpisy
    python.stderr.on("data", (data) => {
      console.log("Python: " + data);
    });

    python.stdout.on("data", (data) => {
      console.log("Python: " + data);
    });

    python.on("close", (code) => {
      console.log("Python ended with: " + code);

      if (code === 0) {
        socket.emit(
          "processed",
          `${config.server_url}:${config.express_port}/video/${socket.id}`
        );
      } else {
        // TODO: dodělat ošetření na klientské straně.
        console.log("Python error.");
      }
    });
  });

  socket.on("disconnect", () => {
    if (fs.existsSync(clientTmpDir)) {
      fs.rmSync(clientTmpDir, { recursive: true });
    }
  });
});

/**
 * Express.js
 */
const videoRouter = require("./routes/video");

app.use("/video", videoRouter);

app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.get("/video", (req, res) => {
  res.sendFile("assets/sample.mp4", { root: __dirname });
});

app.listen(config.express_port);
