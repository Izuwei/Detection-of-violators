import json


class Recorder:
    def __init__(self, labels):
        self.records = {label: [] for label in labels}
        self.last = {
            label: -99 for label in labels
        }  # Time of last record of object (different for persons)
        self.timeDist = 5  # Time distance between image time record in seconds

    def add(self, detection, timestamp):
        # Person
        if detection.label == "person":
            # Loop over all recorded persons
            for person in self.records[detection.label]:
                # Person already has a record in recorder
                if person["id"] == detection.personId:
                    # Loop over all detected person's face images
                    for image in person["detections"]:
                        # Current face image is already recorded => append timestamp if time distance is sufficient
                        if detection.faceId == image["id"]:
                            if (timestamp - image["last"]) > self.timeDist:
                                image["timestamp"].append(timestamp)

                            image["last"] = timestamp
                            return

                    # Current face image is not recorded => append face detection
                    person["detections"].append(
                        {
                            "id": detection.faceId,
                            "last": timestamp,
                            "timestamp": [timestamp],
                        }
                    )
                    return

            # Person does not exits in records => create new record
            self.records[detection.label].append(
                {
                    "id": detection.personId,
                    "name": detection.identity,
                    "detections": [
                        {
                            "id": detection.faceId,
                            "last": timestamp,
                            "timestamp": [timestamp],
                        }
                    ],
                }
            )
            return

        # Other objects except person
        else:
            if (timestamp - self.last[detection.label]) > self.timeDist:
                self.last[detection.label] = timestamp
                self.records[detection.label].append(timestamp)

    def parseJSON(self):
        return json.dumps(self.records, indent=2)
