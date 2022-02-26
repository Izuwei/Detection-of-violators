from deep_sort import generate_detections as gdet
from deep_sort import nn_matching
from deep_sort.tracker import Tracker as DeepSortTracker
from deep_sort.detection import Detection as DeepSortDetection
from detection import Detection
import cv2


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

    def track(self, frame, detections):
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        bboxes = [detection.bbox for detection in detections]
        features = self.encoder(frame, bboxes)
        detections = [
            DeepSortDetection(
                detection.bbox,
                detection.conf,
                detection.label,
                detection.identity,
                detection.faceDistance,
                feature,
            )
            for detection, feature in zip(detections, features)
        ]

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
                    track.track_id,
                )
            )

        return detections
