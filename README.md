[![License badge](https://img.shields.io/badge/License-GPLv3-yellow.svg)](https://github.com/Izuwei/Detection-of-violators/blob/master/LICENSE)
[![Python badge](https://img.shields.io/badge/Python-3.9.7-blue.svg)](https://www.python.org/downloads/release/python-397)
[![NodeJS badge](https://img.shields.io/badge/Node-v16.14.0-026e00.svg)](https://nodejs.org/en/download/releases)
[![NPM badge](https://img.shields.io/badge/npm-8.1.0-cc3534.svg)](https://www.npmjs.com/package/npm/v/8.1.0)

# Detection of Violators

Internet application for detection and analysis of violators in the monitored area.

## Installation

- Download and install python 3.9.7 from https://www.python.org/downloads/release/python-397
- Download and install Node.js v16.14.0 from https://nodejs.org/en/download/releases
- Video codec OpenH264 for Microsoft Windows was provided by Cisco Systems, Inc. For different system distribution see https://github.com/cisco/openh264/releases/tag/v1.8.0

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

## GPU Acceleration

To run the detector on the graphics card, it is necessary to install additional software, including Nvidia CUDA and cuDNN, download the source code of the OpenCV library and then compile it.

1. Set python 3.9.7 as default version of python
2. Uninstall current OpenCV library by command:

```
pip uninstall opencv-python
```

3. Install Microsoft Visual Studio 2019 with the C++ addon
4. Download and install CUDA 11.0 Update 1 from https://developer.nvidia.com/cuda-11.0-update1-download-archive
5. Download and extract cuDNN v8.0.5 for CUDA 11.0 from https://developer.nvidia.com/rdp/cudnn-archive
6. Move content of the cuDNN directory to `"C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.0"` and replace all files
7. Download and install CMake (current ver. 3.23.0) from https://cmake.org/download
8. Create directory `opencv_build` (for example on disk `C:\`)
9. Download OpenCV 4.5.5 source code from https://opencv.org/releases
10. Download source code OpenCV-contrib 4.5.5 from https://github.com/opencv/opencv_contrib/releases/tag/4.5.5
11. Extract both `OpenCV-4.5.5` and `OpenCV-contrib-4.5.5` archives into the `opencv_build` directory, resulting in 2 directories with the corresponding files
12. In the directory `opencv_build` create new directories `build` and `install`
13. Launch CMake and set source code at the `opencv_build/opencv-4.5.5` directory (ie the OpenCV source code)
14. Set build directory to the `opencv_build/build` directory and check the `grouped` option
15. Click on `Configure`, then specify generator on Visual Studio 2019, set the platform according to your architecture (eg x64) and confirm `Finish`
16. When finished, set (fill) the configuration by checking:
    - `WITH/WITH_CUDA`
    - `BUILD/BUILD_opencv_dnn`
    - `OPENCV/OPENCV_DNN_CUDA`
    - `ENABLE/ENABLE_FAST_MATH`
    - `BUILD/BUILD_opencv_world`
    - `BUILD/BUILD_opencv_python3`
17. Go to the `OPENCV/OPENCV_EXTRA_MODULES_PATH`, click on browse and select a directory from our folder `opencv_build/opencv_contrib-4.5.5/modules`
18. Press `Configure` again
19. Configure again when finished by checking:
    - `CUDA/CUDA_FAST_MATH`
20. In the `CUDA/CUDA_ARCH_BIN` property, leave only the architecture of your graphic card, which can be found on [wiki](https://en.wikipedia.org/wiki/CUDA) according to your model (eg GTX 1050Ti uses version 6.1)
21. Set the property `CMAKE/CMAKE_INSTALL_PREFIX` to the created directory `opencv_build/install`
22. From property `CMAKE/CMAKE_CONFIGURATION_TYPES` remove `Debug;` and leave only `Release`
23. Last time click on `Configure`
24. When finished, press `Generate`
25. Open terminal and launch compilation by following command:

```ps
"C:\Program Files\CMake\bin\cmake.exe" --build "C:\opencv_build\build" --target INSTALL --config Release
```

26. Compilation takes about 2 hours
27. In the end, the OpenCV library version 4.5.5 should be available in python and the generated file should be located in following directories:
    - `/opencv_build/build/lib/python3/Release/cv2.cp39-win_amd64.py`
    - `.../AppData/Local/Programs/Python/Python39/Lib/site-packages/cv2/python-3.9/cv2.cp39-win_amd64.py`

## Credits

| Project     | License | Link                                                     |
| ----------- | ------- | -------------------------------------------------------- |
| YOLOv3      | MIT     | https://github.com/pjreddie/darknet/blob/master/LICENSE  |
| DeepFace    | MIT     | https://github.com/serengil/deepface/blob/master/LICENSE |
| DeepSort    | GPLv3   | https://github.com/nwojke/deep_sort/blob/master/LICENSE  |
| Material-UI | MIT     | https://github.com/mui/material-ui/blob/master/LICENSE   |

## License

Licensed under the GPLv3 license - see [LICENSE](https://github.com/Izuwei/Detection-of-violators/blob/master/LICENSE "License").
