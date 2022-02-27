class Detection:
    def __init__(
        self,
        label,
        conf,
        bbox,
        identity="Unknown",
        faceDistance=1,
        trackId=None,
        trailPts=[],
    ):
        self.label = label
        self.conf = conf
        self.bbox = bbox
        self.identity = identity
        self.faceDistance = faceDistance
        self.trackId = trackId
        self.trail = trailPts

    def setIdentity(self, name, faceDistance):
        self.identity = name
        self.faceDistance = faceDistance
