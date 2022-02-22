import sys
import cv2
import numpy as np

inputShape = 320  # 608
confThreshold = 0.55
nmsThreshold = 0.4

textFont = cv2.FONT_HERSHEY_DUPLEX
textColor = (0, 255, 0)
textScale = 0.6
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


def filterPredictions(frame, outputs):
    bboxes = []
    classIds = []
    confs = []

    frameHeight, frameWidth, _ = frame.shape

    for output in outputs:  # Pro všechny výstupy z vrstev (3)
        for prediction in output:  # Pro každou detekci ve výstupu
            scores = prediction[5:]  # Z výstupu vezme pouze pole conf. skore
            classId = np.argmax(scores)  # Pozice s nejvyšším conf
            confidence = scores[classId]  # Hodnota nejvyššího conf

            if confidence > confThreshold:
                # Centrální bod uprostřed bounding boxu
                cx = int(prediction[0] * frameWidth)
                cy = int(prediction[1] * frameHeight)

                # Rozměry boxu a souřadnice levého horního rohu
                w = int(prediction[2] * frameWidth)
                h = int(prediction[3] * frameHeight)
                x = int(cx - w / 2)
                y = int(cy - h / 2)

                bboxes.append([x, y, w, h])  # Uložení bounding boxu
                classIds.append(classId)  # Uložení ID třídy
                confs.append(float(confidence))  # Uložení conf. skóre

    indexes = cv2.dnn.NMSBoxes(bboxes, confs, confThreshold, nmsThreshold)

    return indexes, bboxes, classIds, confs


modelConfig = "./yolov3/yolov3.cfg"
modelWeights = "./yolov3/yolov3.weights"  # Pretrained
labelFile = "./detection_model/coco.names"

# Načtení tříd ze souboru
labels = []
with open(labelFile) as f:
    labels = f.read().rstrip("\n").split("\n")

detector = cv2.dnn.readNetFromDarknet(modelConfig, modelWeights)

detector.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)
detector.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV)

video = cv2.VideoCapture("../../VUT/DP/Videos/downtown_la.mp4")

if not video.isOpened():  # Kontrola, zda se video povedlo otevřít
    sys.stderr.write("Failed to open the video.\n")
    exit(1)

videoWidth = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
videoHeight = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))
videoFPS = video.get(cv2.CAP_PROP_FPS)
codec = cv2.VideoWriter_fourcc(*"XVID")

outputVideo = cv2.VideoWriter(
    "./processed.avi", codec, videoFPS, (videoWidth, videoHeight)
)

while True:
    ret, frame = video.read()

    # Kontrola dostupnosti snímku
    if not ret:
        break

    blob = cv2.dnn.blobFromImage(
        frame, 1 / 255, (inputShape, inputShape), (0, 0, 0), swapRB=True, crop=False
    )

    detector.setInput(blob)

    outputLayersNames = detector.getUnconnectedOutLayersNames()
    outputs = detector.forward(outputLayersNames)

    indexes, bboxes, classIds, confs = filterPredictions(frame, outputs)

    for idx in indexes:
        classId = classIds[idx]
        label = labels[classId]

        if classId <= 80 and label in OBJECTS:
            box = bboxes[idx]
            x, y, w, h = box[0], box[1], box[2], box[3]

            cv2.rectangle(frame, (x, y), (x + w, y + h), bboxColor, 2)
            cv2.putText(
                frame,
                f"{label.upper()} {int(confs[idx]*100)}%",
                (box[0] + 4, box[1] + 20),
                textFont,
                textScale,
                textColor,
                1,
            )

    cv2.imshow("Detector", frame)
    outputVideo.write(frame)

    if cv2.waitKey(2) & 0xFF == ord("q"):
        break

video.release()
cv2.destroyAllWindows()
