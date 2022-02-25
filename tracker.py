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

        self.encoder = gdet.create_box_encoder(self.model, batch_size=1)
        self.metric = nn_matching.NearestNeighborDistanceMetric(
            "cosine", self.matchingThreshold, self.nnBudget
        )
        self.tracker = DeepSortTracker(self.metric, max_age=600)

    def track(self, frame, labels, confs, bboxes):
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        confs = np.array(confs)
        bboxes = np.array(bboxes)
        features = np.array(self.encoder(frame, bboxes))
        detections = [
            Detection(bbox, conf, label, feature)
            for bbox, conf, label, feature in zip(bboxes, confs, labels, features)
        ]

        self.tracker.predict()
        self.tracker.update(detections)

        labels = []
        confs = []
        bboxes = []
        trackIds = []

        for track in self.tracker.tracks:
            if not track.is_confirmed() or track.time_since_update > 5:
                continue

            bbox = track.to_tlwh()
            labels.append(track.get_label())
            confs.append(track.get_confidence())
            bboxes.append([int(bbox[0]), int(bbox[1]), int(bbox[2]), int(bbox[3])])
            trackIds.append(track.track_id)

        return labels, confs, bboxes, trackIds
