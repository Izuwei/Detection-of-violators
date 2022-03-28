# vim: expandtab:ts=4:sw=4
import numpy as np


class Detection(object):
    """
    This class represents a bounding box detection in a single image.

    Parameters
    ----------
    tlwh : array_like
        Bounding box in format `(x, y, w, h)`.
    confidence : float
        Detector confidence score.
    feature : array_like
        A feature vector that describes the object contained in this image.

    Attributes
    ----------
    tlwh : ndarray
        Bounding box in format `(top left x, top left y, width, height)`.
    confidence : ndarray
        Detector confidence score.
    feature : ndarray | NoneType
        A feature vector that describes the object contained in this image.

    """

    def __init__(
        self,
        tlwh,
        confidence,
        label,
        identity,
        faceDistance,
        personId,
        faceId,
        feature,
        bboxColor,
        cornerColor,
        textColor,
    ):
        self.tlwh = np.asarray(tlwh, dtype=np.float)
        self.confidence = float(confidence)
        self.label = label
        self.identity = identity
        self.faceDistance = faceDistance
        self.personId = personId
        self.faceId = faceId
        self.bboxColor = bboxColor
        self.cornerColor = cornerColor
        self.textColor = textColor
        self.center = [
            int(tlwh[0] + (tlwh[2] >> 1)),
            int(tlwh[1] + (tlwh[3] >> 1)),
        ]  # [centerX, centerY]
        self.feature = np.asarray(feature, dtype=np.float32)

    def to_tlbr(self):
        """Convert bounding box to format `(min x, min y, max x, max y)`, i.e.,
        `(top left, bottom right)`.
        """
        ret = self.tlwh.copy()
        ret[2:] += ret[:2]
        return ret

    def to_xyah(self):
        """Convert bounding box to format `(center x, center y, aspect ratio,
        height)`, where the aspect ratio is `width / height`.
        """
        ret = self.tlwh.copy()
        ret[:2] += ret[2:] / 2
        ret[2] /= ret[3]
        return ret

    def get_label(self):
        """Returns label of the detected object."""
        return self.label

    def get_confidence(self):
        """Returns confidence score of the detected object."""
        return self.confidence

    def get_identity(self):
        """Returns identity of the detected person."""
        return self.identity

    def get_faceDistance(self):
        """Returns faceDistance of the detected person, measuring the similarity of the face."""
        return self.faceDistance

    def get_personId(self):
        """Returns ID of the detected person."""
        return self.personId

    def get_faceId(self):
        """Returns face image ID of the detected person."""
        return self.faceId
