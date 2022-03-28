class Detection:
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
        self.identity = name
        self.faceDistance = faceDistance
        self.personId = personId
        self.faceId = faceId
