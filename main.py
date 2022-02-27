import sys
import cv2
import time
import argparse
import datetime

from detector import Detector
from detection import Detection
from recognizer import Recognizer
from tracker import Tracker

inputShape = 320  # 608
trailTime = 1.5  # Délka stopy v sekundách
faceDB = "database"  # Cesta k databázi se snímky obličejů
tracking = False
showTimeStamp = True

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

modelConfig = "./yolov3/yolov3.cfg"
modelWeights = "./yolov3/yolov3.weights"  # Pretrained
labelFile = "./detection_model/coco.names"


def draw(frame, detection, fps):
    x, y, w, h = (
        detection.bbox[0],
        detection.bbox[1],
        detection.bbox[2],
        detection.bbox[3],
    )

    if detection.label == "person":
        # Identita osoby
        cv2.putText(
            frame,
            detection.identity,
            (x + 4, y + 11),
            textFont,
            textScaleLow,
            detection.textColor,
            1,
        )

        if detection.label in OBJECTS:
            cornerLen = int(w >> 1) if w < h else int(h >> 1)
            cornerLen = cornerLen if cornerLen < 20 else 20
            cornerLen = (
                cornerLen
                if ((cornerLen << 1) + 10) < w and ((cornerLen << 1) + 10) < h
                else int(cornerLen >> 1)
            )
            x2, y2 = x + w, y + h
            # Bounding box
            cv2.rectangle(frame, (x, y), (x2, y2), detection.bboxColor, 1)

            # Horní levý roh
            cv2.line(frame, (x, y), (x + cornerLen, y), detection.cornerColor, 2)
            cv2.line(frame, (x, y), (x, y + cornerLen), detection.cornerColor, 2)
            # Horní pravý roh
            cv2.line(frame, (x2, y), (x2 - cornerLen, y), detection.cornerColor, 2)
            cv2.line(frame, (x2, y), (x2, y + cornerLen), detection.cornerColor, 2)
            # Dolní levý roh
            cv2.line(frame, (x, y2), (x + cornerLen, y2), detection.cornerColor, 2)
            cv2.line(frame, (x, y2), (x, y2 - cornerLen), detection.cornerColor, 2)
            # Dolní pravý roh
            cv2.line(frame, (x2, y2), (x2 - cornerLen, y2), detection.cornerColor, 2)
            cv2.line(frame, (x2, y2), (x2, y2 - cornerLen), detection.cornerColor, 2)

            # Třída (label)
            cv2.putText(
                frame,
                f"{detection.label.upper()}",
                (x, y - 4),
                textFont,
                textScaleHigh,
                detection.textColor,
                1,
            )
            # Confidence
            cv2.putText(
                frame,
                f"{int(detection.conf*100)}%",
                (x + 4, y2 - 5),
                textFont,
                textScaleLow,
                detection.textColor,
                1,
            )
            # ID
            if tracking == True:
                cv2.putText(
                    frame,
                    f"ID:{detection.trackId}",
                    (x + 4, y2 - 15),
                    textFont,
                    textScaleLow,
                    detection.textColor,
                    1,
                )

            # Výpočet indexu pro indexování v poli centrálních souřadnic, min. 0
            lineCount = len(detection.trail) - 1
            lineCount = 0 if lineCount < 0 else lineCount
            # Výpočet počtu bodů k vykreslení podle zadaného času a FPS, min. == počet bodů
            trailLength = int(fps * trailTime)
            trailLength = trailLength if trailLength < lineCount else lineCount

            for i in range(0, trailLength):
                cv2.line(
                    frame,
                    detection.trail[lineCount - i],
                    detection.trail[lineCount - 1 - i],
                    detection.bboxColor,
                    1,
                )


def main():
    # Načtení tříd ze souboru
    classNames = []
    with open(labelFile) as f:
        classNames = f.read().rstrip("\n").split("\n")

    # Inicializace detektoru
    detector = Detector(classNames, modelConfig, modelWeights, inputShape)

    # Inicializace DeepFace
    recognizer = Recognizer(faceDB)

    # Inicializace trackeru DeepSort
    if tracking == True:
        tracker = Tracker()

    video = cv2.VideoCapture("../../VUT/DP/Videos/downtown_la.mp4")

    if not video.isOpened():  # Kontrola, zda se video povedlo otevřít
        sys.stderr.write("Failed to open the video.\n")
        exit(1)

    videoWidth = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
    videoHeight = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))
    videoFPS = video.get(cv2.CAP_PROP_FPS)
    codec = cv2.VideoWriter_fourcc(*"XVID")

    outputVideo = cv2.VideoWriter(
        "processed.avi", codec, videoFPS, (videoWidth, videoHeight)
    )

    while True:
        ret, frame = video.read()

        # Kontrola dostupnosti snímku
        if not ret:
            break

        labels, confs, bboxes = detector.predict(frame)

        detections = []
        for label, conf, bbox in zip(labels, confs, bboxes):
            detections.append(Detection(label, conf, bbox))

        for detection in detections:
            if detection.label == "person":
                bbox = detection.bbox
                x, y, w, h = bbox[0], bbox[1], bbox[2], bbox[3]

                startX = x if x > 0 else 0
                startY = y if y > 0 else 0
                endX = x + w if x + w < videoWidth else videoWidth
                endY = y + h if y + h < videoHeight else videoHeight

                personCrop = frame[startY:endY, startX:endX]

                identity, faceDistance = recognizer.find(personCrop)
                detection.setIdentity(identity, faceDistance)

        if tracking == True:
            detections = tracker.track(frame, detections)

        for detection in detections:
            draw(frame, detection, videoFPS)

        # Výpis času ve videu na snímek
        if showTimeStamp == True:
            frameNum = int(video.get(cv2.CAP_PROP_POS_FRAMES))
            timeStamp = int(frameNum / videoFPS)

            cv2.putText(
                frame,
                f"{datetime.timedelta(seconds=timeStamp)}",
                (20, videoHeight - 20),
                textFont,
                0.6,
                (255, 255, 255),
                1,
            )

        cv2.imshow("Detector", frame)
        outputVideo.write(frame)

        if cv2.waitKey(2) & 0xFF == ord("q"):
            break

    video.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
