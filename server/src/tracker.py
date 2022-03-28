from deep_sort import generate_detections as gdet
from deep_sort import nn_matching
from deep_sort.tracker import Tracker as DeepSortTracker
from deep_sort.detection import Detection as DeepSortDetection
from detection import Detection
import cv2
import random


class Tracker:

    # Inicializace trackeru DeepSort
    def __init__(self):
        self.model = "deep_sort\mars-small128.pb"
        self.maxAge = 900
        self.matchingThreshold = 0.7
        self.nnBudget = None
        self.timeSinceUpdate = 2  # Počet snímků od poslední aktualizace měření.

        self.encoder = gdet.create_box_encoder(self.model, batch_size=1)
        self.metric = nn_matching.NearestNeighborDistanceMetric(
            "cosine", self.matchingThreshold, self.nnBudget
        )
        self.tracker = DeepSortTracker(self.metric, max_age=self.maxAge)
        self.colors = [  # [BGR]
            (0, 220, 0),  # Zelená
            (0, 111, 255),  # Oranžová
            (220, 220, 0),  # Tyrkysová
            (255, 170, 0),  # Světle modrá
            (255, 100, 0),  # Modrá
            (255, 0, 255),  # Fialová
            (160, 0, 255),  # Růžová
            (0, 0, 220),  # Červená
        ]

    def colorGenerator(self):
        return random.choice(self.colors)

    def track(self, frame, inputDetections):
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        bboxes = [detection.bbox for detection in inputDetections]
        features = self.encoder(frame, bboxes)

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

        self.tracker.predict()
        self.tracker.update(detections)

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
