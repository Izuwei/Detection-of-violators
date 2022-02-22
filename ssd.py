import sys
import cv2

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

modelConfig = "./detection_model/ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt"
detectionModel = "./detection_model/frozen_inference_graph.pb"  # Pretrained
labelFile = "./detection_model/coco.names"

# Načtení tříd ze souboru
labels = []
with open(labelFile) as f:
    labels = f.read().rstrip("\n").split("\n")

# Inicializace detekčního modelu
detector = cv2.dnn_DetectionModel(detectionModel, modelConfig)

detector.setInputSize(320, 320)
detector.setInputScale(1.0 / 127.5)
detector.setInputMean((127.5, 127.5, 127.5))
detector.setInputSwapRB(True)

# Načtení videa
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

# Styl textů a rámečků
textFont = cv2.FONT_HERSHEY_DUPLEX
textColor = (0, 255, 0)
textScale = 0.6
bboxColor = (255, 0, 0)

while True:
    ret, frame = video.read()

    # Kontrola dostupnosti snímku
    if not ret:
        break

    classes, confidences, bboxes = detector.detect(frame, confThreshold=0.55)

    if len(classes) != 0:
        for classIdx, conf, box in zip(classes, confidences, bboxes):
            label = labels[classIdx - 1]
            if classIdx <= 80 and label in OBJECTS:
                cv2.rectangle(frame, box, bboxColor, 2)  # BGR, scale
                cv2.putText(
                    frame,
                    label.upper(),
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
