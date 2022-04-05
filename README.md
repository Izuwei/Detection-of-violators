[![License badge](https://img.shields.io/badge/License-GPLv3-1abc9c.svg)](https://github.com/Izuwei/Detection-of-violators/blob/master/LICENSE)
[![Python badge](https://img.shields.io/badge/Python-3.9.7-blue.svg)](https://www.python.org/downloads/release/python-397)
[![NodeJS badge](https://img.shields.io/badge/Node-v16.14.0-026e00.svg)](https://nodejs.org/en/download/releases)
[![NPM badge](https://img.shields.io/badge/npm-8.1.0-cc3534.svg)](https://www.npmjs.com/package/npm/v/8.1.0)

# Detection-of-violators

Internet application for detection and analysis of violators in the monitored area.

## Installation

- Download and install python 3.9.7 from https://www.python.org/downloads/release/python-397
- Download and install Node.js v16.14.0 from https://nodejs.org/en/download/releases
- Video codec OpenH264 for Microsoft Windows provided by Cisco Systems, Inc. For different system distribution see https://github.com/cisco/openh264/releases/tag/v1.8.0

Go to the directory `/server/src` and install required libraries by:

```
cd server/src
pip install -r requirements.txt
```

Go to the directory `/server`, install dependencies and launch server on `localhost` by:

```
cd server
npm install
npm start
```

Open new terminal, then go to the directory `/app`, install dependencies and launch application by:

```
cd app
npm install
npm start
```

- Application will be available in the browser at http://localhost:3000
- Server uses sockets on the port `3001`
- Express is listening on the port `3002`

## Acknowledgment

| Project     | License | Link                                                     |
| ----------- | ------- | -------------------------------------------------------- |
| YOLOv3      | MIT     | https://github.com/pjreddie/darknet/blob/master/LICENSE  |
| DeepFace    | MIT     | https://github.com/serengil/deepface/blob/master/LICENSE |
| DeepSort    | GPLv3   | https://github.com/nwojke/deep_sort/blob/master/LICENSE  |
| Material-UI | MIT     | https://github.com/mui/material-ui/blob/master/LICENSE   |

## License

Licensed under the GPLv3 license - see [LICENSE](https://github.com/Izuwei/Detection-of-violators/blob/master/LICENSE "License").
