# Author: Jakub Sadilek
#
# Faculty of Information Technology
# Brno University of Technology
# 2022

from deep_sort import generate_detections as gdet
from deep_sort import nn_matching
from deep_sort.tracker import Tracker as DeepSortTracker
from deep_sort.detection import Detection as DeepSortDetection
from detection import Detection
import cv2
import random


class Tracker:
    """
    Class serves as a tracker for object tracking, which is built on DeepSort.
    """

    def __init__(self):
        self.model = "deep_sort\mars-small128.pb"
        self.maxAge = 900
        self.matchingThreshold = 0.7
        self.nnBudget = None
        self.timeSinceUpdate = 2  # Number of frames since the last measurement update

        self.encoder = gdet.create_box_encoder(self.model, batch_size=1)
        self.metric = nn_matching.NearestNeighborDistanceMetric(
            "cosine", self.matchingThreshold, self.nnBudget
        )
        # Deepsort tracker initialization
        self.tracker = DeepSortTracker(self.metric, max_age=self.maxAge)
        self.colors = [  # [BGR]
            (0, 220, 0),  # Green
            (0, 111, 255),  # Orange
            (220, 220, 0),  # Turquoise
            (255, 170, 0),  # Light blue
            (255, 100, 0),  # Blue
            (255, 0, 255),  # Purple
            (160, 0, 255),  # Pink
            (0, 0, 220),  # Red
        ]

    def colorGenerator(self):
        """
        Function selects and returns a random color from predefined colors in init.
        """

        return random.choice(self.colors)

    def track(self, frame, inputDetections):
        """
        Function perform tracking on input detections and returns the same detections,
        but with supplemented data from previous iterations (possibly updated data).

        Parameters:
        frame: Frame on which the current detections were obtained.
        inputDetections: Obtained detections.

        Returns:
        detections: Supplemented input detections.
        """

        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        bboxes = [detection.bbox for detection in inputDetections]
        features = self.encoder(frame, bboxes)

        # Convert Detection class to the Detection class used by DeepSort
        detections = []
        for detection, feature in zip(inputDetections, features):
            color = self.colorGenerator()
            detections.append(
                DeepSortDetection(
                    detection.bbox,
                    detection.conf,
                    detection.label,
                    detection.identity,
                    detection.faceDistance,
                    detection.personId,
                    detection.faceId,
                    feature,
                    color,
                    color,
                    color,
                )
            )

        # Perform tracking
        self.tracker.predict()
        self.tracker.update(detections)

        # Parse results and return objects of Detection class again
        detections = []
        for track in self.tracker.tracks:
            if (
                not track.is_confirmed()
                or track.time_since_update > self.timeSinceUpdate
            ):
                continue

            bbox = track.to_tlwh()
            detections.append(
                Detection(
                    track.get_label(),
                    track.get_confidence(),
                    [int(bbox[0]), int(bbox[1]), int(bbox[2]), int(bbox[3])],
                    track.get_identity(),
                    track.get_faceDistance(),
                    track.get_personId(),
                    track.get_faceId(),
                    track.track_id,
                    track.trail,
                    track.bboxColor,
                    track.cornerColor,
                    track.textColor,
                )
            )

        return detections
