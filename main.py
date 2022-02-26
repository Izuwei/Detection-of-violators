import sys
import cv2
import time
import argparse

from detector import Detector
from detection import Detection
from recognizer import Recognizer
from tracker import Tracker

inputShape = 320  # 608
faceDB = "database"  # Cesta k databázi se snímky obličejů

textFont = cv2.FONT_HERSHEY_DUPLEX
textColor = (0, 255, 0)
textScaleHigh = 0.5
textScaleMedium = 0.4
bboxColor = (255, 0, 0)

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

# Načtení tříd ze souboru
classNames = []
with open(labelFile) as f:
    classNames = f.read().rstrip("\n").split("\n")

# Inicializace detektoru
detector = Detector(classNames, modelConfig, modelWeights, inputShape)

# Inicializace DeepFace
recognizer = Recognizer(faceDB)

# Inicializace trackeru DeepSort
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

    detections = tracker.track(frame, detections)

    for detection in detections:
        bbox = detection.bbox
        x, y, w, h = bbox[0], bbox[1], bbox[2], bbox[3]

        if detection.label == "person":
            cv2.putText(
                frame,
                detection.identity,
                (x + 4, y + 12),
                textFont,
                textScaleMedium,
                textColor,
                1,
            )

        if detection.label in OBJECTS:
            cv2.rectangle(frame, (x, y), (x + w, y + h), bboxColor, 2)
            cv2.putText(
                frame,
                f"{detection.label.upper()}",
                (x, y - 4),
                textFont,
                textScaleHigh,
                textColor,
                1,
            )
            cv2.putText(
                frame,
                f"ID: {detection.trackId}",
                (x + 4, y + h - 16),
                textFont,
                textScaleMedium,
                textColor,
                1,
            )
            cv2.putText(
                frame,
                f"{int(detection.conf*100)}%",
                (x + 4, y + h - 4),
                textFont,
                textScaleMedium,
                textColor,
                1,
            )

    cv2.imshow("Detector", frame)
    outputVideo.write(frame)

    if cv2.waitKey(2) & 0xFF == ord("q"):
        break

video.release()
cv2.destroyAllWindows()
