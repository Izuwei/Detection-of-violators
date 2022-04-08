# Author: Jakub Sadilek
#
# Faculty of Information Technology
# Brno University of Technology
# 2022


class Detection:
    """
    Class represents an individual detection in image and keeps information about it.

    Parameters:
    label: Detection class.
    conf: Confidence score of detection.
    bbox: Array representing bounding box of detection in format [x, y, w, h].
    indentity: Identity of the person, if any (default: "Unknown").
    faceDistance: Face distance of recognized person, if any (default: 1).
    personId: Person identifier, if any.
    faceId: Recognized face image identifier, if any.
    trackId: Detection identifier for tracking.
    trailPts: Array of points for drawing paths.
    bboxColor: Color of bounding box.
    cornerColor: Color of bounding box corners.
    textColor: Color of text inside the bounding box.
    """

    def __init__(
        self,
        label,
        conf,
        bbox,
        identity="Unknown",
        faceDistance=1,
        personId="",
        faceId="",
        trackId=None,
        trailPts=None,
        bboxColor=(30, 128, 255),  # BGR
        cornerColor=(27, 26, 222),  # BGR
        textColor=(0, 255, 0),  # BGR
    ):
        self.label = label
        self.conf = conf
        self.bbox = bbox
        self.identity = identity
        self.faceDistance = faceDistance
        self.personId = personId
        self.faceId = faceId
        self.trackId = trackId
        self.bboxColor = bboxColor
        self.cornerColor = cornerColor
        self.textColor = textColor
        self.trail = [] if trailPts == None else trailPts
        self.center = [
            int(bbox[0] + (bbox[2] >> 1)),
            int(bbox[1] + (bbox[3] >> 1)),
        ]  # [centerX, centerY]

    def setIdentity(self, name, faceDistance, personId, faceId):
        """
        Function sets identity of the detected person.

        Parameters:
        name: Name of the person.
        faceDistance: Face distance of recognized person.
        personId: Person identifier.
        faceId: Identifier of the face image against which it was recognized.
        """

        self.identity = name
        self.faceDistance = faceDistance
        self.personId = personId
        self.faceId = faceId
