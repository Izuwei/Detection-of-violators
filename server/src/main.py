# Author: Jakub Sadilek
#
# Faculty of Information Technology
# Brno University of Technology
# 2022

import sys
import cv2
import time
import datetime

from argParser import argumentParser
from detection import Detection
from detector import Detector
from recognizer import Recognizer
from tracker import Tracker
from recorder import Recorder
from quietStdout import QuietStdout

textFont = cv2.FONT_HERSHEY_DUPLEX
textScaleHigh = 0.4
textScaleLow = 0.3

OBJECTS = [
    "person",
    "car",
    "cat",
    "dog",
    "horse",
    "sheep",
    "cow",
    "elephant",
    "bear",
    "zebra",
    "giraffe",
]

labelFile = "coco.names"
args = argumentParser()


def draw(frame, detection, fps):
    """
    Function draws a bounding box into the given frame.

    Parameters:
    frame: Frame for write into.
    detection: Detection whose bounding box will be plotted.
    fps: Video FPS, it is used to calculate length of tracks.
    """

    x, y, w, h = (
        detection.bbox[0],
        detection.bbox[1],
        detection.bbox[2],
        detection.bbox[3],
    )

    if args.recognition == True and detection.label == "person":
        # Identity of person
        cv2.putText(
            frame,
            detection.identity,
            (x + 4, y + 11),
            textFont,
            textScaleLow,
            detection.textColor,
            1,
        )

    cornerLen = int(w >> 1) - 2 if w < h else int(h >> 1) - 2
    cornerLen = int(cornerLen >> 1) if cornerLen < 20 else 20
    x2, y2 = x + w, y + h
    # Bounding box
    cv2.rectangle(frame, (x, y), (x2, y2), detection.bboxColor, 1)

    # Upper left corner
    cv2.line(frame, (x, y), (x + cornerLen, y), detection.cornerColor, 2)
    cv2.line(frame, (x, y), (x, y + cornerLen), detection.cornerColor, 2)
    # Upper right corner
    cv2.line(frame, (x2, y), (x2 - cornerLen, y), detection.cornerColor, 2)
    cv2.line(frame, (x2, y), (x2, y + cornerLen), detection.cornerColor, 2)
    # Lower left corner
    cv2.line(frame, (x, y2), (x + cornerLen, y2), detection.cornerColor, 2)
    cv2.line(frame, (x, y2), (x, y2 - cornerLen), detection.cornerColor, 2)
    # Lower right corner
    cv2.line(frame, (x2, y2), (x2 - cornerLen, y2), detection.cornerColor, 2)
    cv2.line(frame, (x2, y2), (x2, y2 - cornerLen), detection.cornerColor, 2)

    # Class (label)
    cv2.putText(
        frame,
        f"{detection.label.upper()}",
        (x, y - 4),
        textFont,
        textScaleHigh,
        detection.textColor,
        1,
    )
    # Confidence score
    cv2.putText(
        frame,
        f"{int(detection.conf*100)}%",
        (x + 4, y2 - 5),
        textFont,
        textScaleLow,
        detection.textColor,
        1,
    )
    # Tracking
    if args.tracking == True:
        # ID of object
        cv2.putText(
            frame,
            f"ID:{detection.trackId}",
            (x + 4, y2 - 15),
            textFont,
            textScaleLow,
            detection.textColor,
            1,
        )

        # Tracks
        if args.paths == True:
            # Index calculation for indexing in the array of central coordinate, min. 0
            lineCount = len(detection.trail) - 1
            lineCount = 0 if lineCount < 0 else lineCount
            # Calculation of the number of points to be plotted according to the specified length and FPS
            trailLength = int(fps * args.traillen)
            trailLength = trailLength if trailLength < lineCount else lineCount

            for i in range(0, trailLength):
                cv2.line(
                    frame,
                    detection.trail[lineCount - i],
                    detection.trail[lineCount - 1 - i],
                    detection.bboxColor,
                    2,
                )


def main():
    # Load classes from a file
    classNames = []
    with open(labelFile) as f:
        classNames = f.read().rstrip("\n").split("\n")

    # Detector initialization
    detector = Detector(classNames, args.model, args.weights)

    # DeepFace initialization
    recognizer = Recognizer(args.database)

    # DeepSort tracker initialization
    if args.tracking == True:
        tracker = Tracker()

    # Initialization of recorder for the output summary
    recorder = Recorder(OBJECTS)

    video = cv2.VideoCapture(args.input)

    if not video.isOpened():  # Check if video was successfully opened
        sys.stderr.write("Failed to open the video.\n")
        exit(1)

    frameCnt = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
    videoWidth = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
    videoHeight = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))
    videoFPS = video.get(cv2.CAP_PROP_FPS)
    codec = cv2.VideoWriter_fourcc(*"avc1")

    # Check detection area boundaries
    if args.area != None:
        args.area[0] = args.area[0] if args.area[0] >= 0 else 0
        args.area[1] = args.area[1] if args.area[1] >= 0 else 0
        args.area[2] = args.area[2] if args.area[2] <= videoWidth else videoWidth
        args.area[3] = args.area[3] if args.area[3] <= videoHeight else videoHeight

    outputVideo = cv2.VideoWriter(
        args.output + ".mp4", codec, videoFPS, (videoWidth, videoHeight)
    )

    # Set of object IDs, used to count unique objects in the video
    objectIDs = set()

    # Variables for progress calculation
    sendLimit = frameCnt // 20
    sentProgress = 1
    progressFrame = 0

    print("Progress: 0 %", flush=True)

    while True:
        ret, frame = video.read()

        # Frame availability check
        if not ret:
            break

        frameNum = int(video.get(cv2.CAP_PROP_POS_FRAMES))
        timeStamp = int(frameNum / videoFPS)

        # Show progress every 5%
        if progressFrame == sendLimit:
            print("Progress: " + str(min(sentProgress * 5, 100)) + " %", flush=True)
            sentProgress += 1
            progressFrame = 0
        progressFrame += 1

        # Object detection
        labels, confs, bboxes = detector.predict(frame)

        # Store obtained detections into objects
        detections = []
        for label, conf, bbox in zip(labels, confs, bboxes):
            detections.append(Detection(label, conf, bbox))

        # Face recognition
        if args.recognition == True:
            # Redirect stdout due to DeepFace dumps
            with QuietStdout():
                # Trying to recognize each person
                for detection in detections:
                    if detection.label == "person":
                        # Crop bounding box with detected person
                        bbox = detection.bbox
                        x, y, w, h = bbox[0], bbox[1], bbox[2], bbox[3]

                        startX = x if x > 0 else 0
                        startY = y if y > 0 else 0
                        endX = x + w if x + w < videoWidth else videoWidth
                        endY = y + h if y + h < videoHeight else videoHeight

                        personCrop = frame[startY:endY, startX:endX]

                        # Feed DeepFace with image of the person and get informations
                        # that will determine identity of the person
                        identity, faceDistance, personId, faceId = recognizer.find(
                            personCrop
                        )
                        detection.setIdentity(identity, faceDistance, personId, faceId)

        # Tracking, if set, returns new objects of class Detection
        if args.tracking == True:
            detections = tracker.track(frame, detections)

        # Render detections
        for detection in detections:
            # If car detection is not set, then skip
            if detection.label == "car" and args.cars == False:
                continue

            # Detected class must be among detection classes
            if detection.label in OBJECTS:
                # Full frame detection
                if args.area == None:
                    draw(frame, detection, videoFPS)
                    recorder.add(detection, timeStamp)

                # Detection in defined part of frame
                elif (
                    detection.center[0] >= args.area[0]
                    and detection.center[0] <= args.area[2]
                    and detection.center[1] >= args.area[1]
                    and detection.center[1] <= args.area[3]
                ):
                    draw(frame, detection, videoFPS)
                    recorder.add(detection, timeStamp)

        # Render detection area in frame, if set
        if args.frame == True and args.area != None:
            cv2.rectangle(
                frame,
                (args.area[0], args.area[1]),
                (args.area[2], args.area[3]),
                (27, 26, 222),
                2,
            )

        # Plot counters on frame, if set
        if args.tracking == True and args.counter == True:
            currentObjects = 0
            for detection in detections:
                if detection.label in OBJECTS:
                    # Counting all objects
                    if args.area == None:
                        objectIDs.add(detection.trackId)
                        currentObjects += 1

                    # Counting objects in defined area
                    elif (
                        detection.center[0] >= args.area[0]
                        and detection.center[0] <= args.area[2]
                        and detection.center[1] >= args.area[1]
                        and detection.center[1] <= args.area[3]
                    ):
                        objectIDs.add(detection.trackId)
                        currentObjects += 1

            cv2.putText(
                frame,
                f"Objects: {currentObjects}",
                (20, videoHeight - 70),
                textFont,
                0.6,
                (255, 255, 255),
                1,
            )
            cv2.putText(
                frame,
                f"Total: {len(objectIDs)}",
                (20, videoHeight - 50),
                textFont,
                0.6,
                (255, 255, 255),
                1,
            )

        # Write current time of the video on frame, if set
        if args.timestamp == True:
            cv2.putText(
                frame,
                f"{datetime.timedelta(seconds=timeStamp)}",
                (20, videoHeight - 20),
                textFont,
                0.7,
                (255, 255, 255),
                1,
            )

        # Displaying images during processing, used for debugging
        cv2.imshow("Detection of Violators", frame)
        outputVideo.write(frame)

        if cv2.waitKey(2) & 0xFF == ord("q"):
            break

    print("Progress: 100 %", flush=True)
    video.release()
    cv2.destroyAllWindows()

    # Summary of detections is stored into JSON file (same directory as video file)
    summaryData = recorder.parseJSON()
    with open(args.output + ".json", "w") as f:
        f.write(summaryData)


if __name__ == "__main__":
    main()
