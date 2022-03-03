import cv2
import numpy as np


class Detector:
    def __init__(self, classNames, modelName):
        self.yolo320Config = "yolov3/yolov3-320.cfg"
        self.yolo608Config = "yolov3/yolov3-608.cfg"
        self.yoloWeights = "yolov3/yolov3.weights"  # Pretrained
        self.classNames = classNames

        self.confThreshold = 0.55
        self.nmsThreshold = 0.4
        self.inputShape = None

        if modelName == "yolo608":  # yolo608
            self.inputShape = 608
            self.model = cv2.dnn.readNetFromDarknet(
                self.yolo608Config, self.yoloWeights
            )
        else:  # yolo320 (výchozí)
            self.inputShape = 320
            self.model = cv2.dnn.readNetFromDarknet(
                self.yolo320Config, self.yoloWeights
            )
        # self.model.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)
        # self.model.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV)
        print(f"Detector: Detection model {modelName} has been used.")

    def filterPredictions(self, frame, outputs):
        bboxes = []
        classIds = []
        confs = []

        frameHeight, frameWidth, _ = frame.shape

        for output in outputs:  # Pro všechny výstupy z vrstev (3)
            for prediction in output:  # Pro každou detekci ve výstupu
                scores = prediction[5:]  # Z výstupu vezme pouze pole conf. skore
                classId = np.argmax(scores)  # Pozice s nejvyšším conf
                confidence = scores[classId]  # Hodnota nejvyššího conf

                if confidence > self.confThreshold:
                    # Centrální bod uprostřed bounding boxu
                    cx = int(prediction[0] * frameWidth)
                    cy = int(prediction[1] * frameHeight)

                    # Rozměry boxu a souřadnice levého horního rohu
                    w = int(prediction[2] * frameWidth)
                    h = int(prediction[3] * frameHeight)
                    x = int(cx - (w >> 1))
                    y = int(cy - (h >> 1))

                    bboxes.append([x, y, w, h])  # Uložení bounding boxu
                    classIds.append(classId)  # Uložení ID třídy
                    confs.append(float(confidence))  # Uložení conf. skóre

        indices = cv2.dnn.NMSBoxes(bboxes, confs, self.confThreshold, self.nmsThreshold)

        # Vyfiltrování pouze správných bboxů po suppresi
        filtered_bboxes = []
        filtered_classIds = []
        filtered_confs = []

        for idx in indices:
            filtered_bboxes.append(bboxes[idx])
            filtered_classIds.append(classIds[idx])
            filtered_confs.append(confs[idx])

        return filtered_classIds, filtered_confs, filtered_bboxes

    def predict(self, frame):
        blob = cv2.dnn.blobFromImage(
            frame,
            1 / 255,
            (self.inputShape, self.inputShape),
            (0, 0, 0),
            swapRB=True,
            crop=False,
        )

        self.model.setInput(blob)

        outputLayersNames = self.model.getUnconnectedOutLayersNames()
        outputs = self.model.forward(outputLayersNames)

        classIds, confs, bboxes = self.filterPredictions(frame, outputs)
        labels = [self.classNames[id] for id in classIds]

        return labels, confs, bboxes
