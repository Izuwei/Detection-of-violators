import sys
import cv2
import time
import datetime

from argParser import argumentParser
from detector import Detector
from detection import Detection
from recognizer import Recognizer
from tracker import Tracker
from quietStdout import QuietStdout

faceDB = "database"  # Cesta k databázi se snímky obličejů

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
    x, y, w, h = (
        detection.bbox[0],
        detection.bbox[1],
        detection.bbox[2],
        detection.bbox[3],
    )

    if args.recognition == True and detection.label == "person":
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

    cornerLen = int(w >> 1) - 2 if w < h else int(h >> 1) - 2
    cornerLen = int(cornerLen >> 1) if cornerLen < 20 else 20
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
    # Tracking: ID + path
    if args.tracking == True:
        cv2.putText(
            frame,
            f"ID:{detection.trackId}",
            (x + 4, y2 - 15),
            textFont,
            textScaleLow,
            detection.textColor,
            1,
        )

        if args.paths == True:
            # Výpočet indexu pro indexování v poli centrálních souřadnic, min. 0
            lineCount = len(detection.trail) - 1
            lineCount = 0 if lineCount < 0 else lineCount
            # Výpočet počtu bodů k vykreslení podle zadaného času a FPS, min. == počet bodů
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
    # Načtení tříd ze souboru
    classNames = []
    with open(labelFile) as f:
        classNames = f.read().rstrip("\n").split("\n")

    # Inicializace detektoru
    detector = Detector(classNames, args.model)

    # Inicializace DeepFace
    recognizer = Recognizer(faceDB)

    # Inicializace trackeru DeepSort
    if args.tracking == True:
        tracker = Tracker()

    video = cv2.VideoCapture(args.input)

    if not video.isOpened():  # Kontrola, zda se video povedlo otevřít
        sys.stderr.write("Failed to open the video.\n")
        exit(1)

    videoWidth = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
    videoHeight = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))
    videoFPS = video.get(cv2.CAP_PROP_FPS)
    codec = cv2.VideoWriter_fourcc(*"XVID")

    # Ošetření hranic detekční oblasti
    if args.area != None:
        args.area[0] = args.area[0] if args.area[0] >= 0 else 0
        args.area[1] = args.area[1] if args.area[1] >= 0 else 0
        args.area[2] = args.area[2] if args.area[2] <= videoWidth else videoWidth
        args.area[3] = args.area[3] if args.area[3] <= videoHeight else videoHeight

    outputVideo = cv2.VideoWriter(
        args.output, codec, videoFPS, (videoWidth, videoHeight)
    )

    objectIDs = set()

    while True:
        ret, frame = video.read()

        # Kontrola dostupnosti snímku
        if not ret:
            break

        # Detekce objektů
        labels, confs, bboxes = detector.predict(frame)

        detections = []
        for label, conf, bbox in zip(labels, confs, bboxes):
            detections.append(Detection(label, conf, bbox))

        # Rozpoznávání obličejů
        if args.recognition == True:
            with QuietStdout():
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

        # Trasování
        if args.tracking == True:
            detections = tracker.track(frame, detections)

        # Vykreslení zjištěných detekcí
        for detection in detections:
            if detection.label in OBJECTS:
                # Detekce na celém snímku
                if args.area == None:
                    draw(frame, detection, videoFPS)

                # Detekce ve vymezené části snímku
                elif (detection.center[0] >= args.area[0] and detection.center[0] <= args.area[2] and
                      detection.center[1] >= args.area[1] and detection.center[1] <= args.area[3]):
                    draw(frame, detection, videoFPS)

        # Vykreslení rámečku detekční oblasti
        if args.frame == True and args.area != None:
            cv2.rectangle(frame, (args.area[0], args.area[1]), (args.area[2], args.area[3]), (27, 26, 222), 2)

        # Výpis počítadel na snímek
        if args.tracking == True and args.counter == True:
            currentObjects = 0
            for detection in detections:
                if detection.label in OBJECTS:
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

        # Výpis času ve videu na snímek
        if args.timestamp == True:
            frameNum = int(video.get(cv2.CAP_PROP_POS_FRAMES))
            timeStamp = int(frameNum / videoFPS)

            cv2.putText(
                frame,
                f"{datetime.timedelta(seconds=timeStamp)}",
                (20, videoHeight - 20),
                textFont,
                0.7,
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
