# Author: Jakub Sadilek
#
# Faculty of Information Technology
# Brno University of Technology
# 2022

import cv2
import numpy as np


class Detector:
    """
    Class represents the detector that is responsible for detecting objects in the image.

    Parameters:
    classNames: Detection classes.
    modelName: Name of the model to be used for detection.
    """

    def __init__(self, classNames, modelName, weights):
        self.yolo320Config = "yolov3/yolov3-320.cfg"
        self.yolo608Config = "yolov3/yolov3-608.cfg"
        self.yoloWeights = weights
        self.classNames = classNames

        self.confThreshold = 0.55
        self.nmsThreshold = 0.4
        self.inputShape = None

        if modelName == "yolo608":  # yolo608
            self.inputShape = 608
            self.model = cv2.dnn.readNetFromDarknet(
                self.yolo608Config, self.yoloWeights
            )
        else:  # yolo320 (default)
            self.inputShape = 320
            self.model = cv2.dnn.readNetFromDarknet(
                self.yolo320Config, self.yoloWeights
            )

        # FIXME: Uncomment for GPU acceleration with OpenCV support
        # self.model.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA)
        # self.model.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA)

        print(f"Detector: {modelName}")
        print(f"Weights: {weights}")

    def filterPredictions(self, frame, outputs):
        """
        Function filters only the most reliable detections from given detections.

        Parameters:
        frame: Input image with found detections.
        outputs: YOLO network outputs.

        Returns:
        ids: Array with ids.
        confidences: Array with confidence scores.
        bboxes: Array with bounding boxes.
        """

        bboxes = []
        classIds = []
        confs = []

        frameHeight, frameWidth, _ = frame.shape

        for output in outputs:  # For all layers outputs (3)
            for prediction in output:  # For each detection in the output
                scores = prediction[
                    5:
                ]  # Takes only the conf. array score from the output
                classId = np.argmax(scores)  # Position with the highest confidence
                confidence = scores[classId]  # The value of the highest confidence

                if confidence > self.confThreshold:
                    # Central point in the middle of the bounding box
                    cx = int(prediction[0] * frameWidth)
                    cy = int(prediction[1] * frameHeight)

                    # Box dimensions and coordinates of the upper left corner
                    w = int(prediction[2] * frameWidth)
                    h = int(prediction[3] * frameHeight)
                    x = int(cx - (w >> 1))
                    y = int(cy - (h >> 1))

                    bboxes.append([x, y, w, h])  # Save bounding box
                    classIds.append(classId)  # Save class ID
                    confs.append(float(confidence))  # Save conf. score

        # Get indices of non-overlapping bboxes using non-maximum suppression
        indices = cv2.dnn.NMSBoxes(bboxes, confs, self.confThreshold, self.nmsThreshold)

        # Filter only the correct bboxes after suppression
        filtered_bboxes = []
        filtered_classIds = []
        filtered_confs = []

        for idx in indices:
            filtered_bboxes.append(bboxes[idx])
            filtered_classIds.append(classIds[idx])
            filtered_confs.append(confs[idx])

        return filtered_classIds, filtered_confs, filtered_bboxes

    def predict(self, frame):
        """
        The function detects objects in the given image.

        Parameters:
        frame: An image in which objects will be detected.

        Returns:
        labels: Array with labels.
        confs: Array with confidence scores.
        bboxes: Array with bounding boxes.
        """

        # Convert frame to blob
        blob = cv2.dnn.blobFromImage(
            frame,
            1 / 255,
            (self.inputShape, self.inputShape),
            (0, 0, 0),
            swapRB=True,
            crop=False,
        )

        # Pass blob to the network
        self.model.setInput(blob)

        # Get outputs from the yolo network
        outputLayersNames = self.model.getUnconnectedOutLayersNames()
        outputs = self.model.forward(outputLayersNames)

        # Filter outputs and get detections
        classIds, confs, bboxes = self.filterPredictions(frame, outputs)
        labels = [self.classNames[id] for id in classIds]

        return labels, confs, bboxes
