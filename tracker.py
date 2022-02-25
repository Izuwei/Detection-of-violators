from pyexpat import features
from deep_sort import generate_detections as gdet
from deep_sort import nn_matching
from deep_sort import tracker
from deep_sort.tracker import Tracker as DeepSortTracker
from deep_sort.detection import Detection
import numpy as np
import cv2


class Tracker:

    # Inicializace trackeru DeepSort
    def __init__(self):
        self.model = "deep_sort\mars-small128.pb"
        self.matchingThreshold = 0.7
        self.nnBudget = None
        self.timeSinceUpdate = 2  # Počet snímků od poslední aktualizace měření.

        self.encoder = gdet.create_box_encoder(self.model, batch_size=1)
        self.metric = nn_matching.NearestNeighborDistanceMetric(
            "cosine", self.matchingThreshold, self.nnBudget
        )
        self.tracker = DeepSortTracker(self.metric, max_age=900)

    def track(self, frame, labels, confs, bboxes, recognitions):
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        confs = np.array(confs)
        bboxes = np.array(bboxes)
        features = np.array(self.encoder(frame, bboxes))
        detections = [
            Detection(bbox, conf, label, recognition[0], recognition[1], feature)
            for bbox, conf, label, recognition, feature in zip(
                bboxes, confs, labels, recognitions, features
            )
        ]

        self.tracker.predict()
        self.tracker.update(detections)

        labels = []
        confs = []
        bboxes = []
        recognitions = []
        trackIds = []

        for track in self.tracker.tracks:
            if (
                not track.is_confirmed()
                or track.time_since_update > self.timeSinceUpdate
            ):
                continue

            bbox = track.to_tlwh()
            labels.append(track.get_label())
            confs.append(track.get_confidence())
            bboxes.append([int(bbox[0]), int(bbox[1]), int(bbox[2]), int(bbox[3])])
            recognitions.append([track.get_identity(), track.get_faceDistance()])
            trackIds.append(track.track_id)

        return labels, confs, bboxes, recognitions, trackIds
