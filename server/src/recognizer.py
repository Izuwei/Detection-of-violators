# Author: Jakub Sadilek
#
# Faculty of Information Technology
# Brno University of Technology
# 2022

import sys
from deepface import DeepFace
from deepface.basemodels import Facenet, VGGFace


class Recognizer:
    """
    Class represents a recognizer that is used to recognize people by their face.

    Parameters:
    db_path: Path to the directory with face images.
    modelName: Name of recognition model to be used (default: Facenet).
    """

    def __init__(self, db_path, modelName="Facenet"):
        self.database = db_path
        self.modelName = modelName
        self.model = None

        if modelName == "Facenet":
            self.model = Facenet.loadModel()
        else:
            self.modelName = "VGG-Face"
            self.model = VGGFace.loadModel()

        print(f"Recognizer: {self.modelName}")

    def find(self, person_bbox):
        """
        Function will try to recognize the person in the input image against the face database.

        Parameters:
        person_bbox: Image of a person.

        Returns:
        name: Name of person.
        faceDistance: Measured face distance.
        personId: Person id.
        faceId: Id of recognized face image.
        """

        name = "Unknown"
        faceDistance = 1
        personId = ""
        faceId = ""

        try:
            df = DeepFace.find(
                person_bbox,
                self.database,
                model_name=self.modelName,
                model=self.model,
                distance_metric="cosine",
                enforce_detection=False,
            )

            if df.shape[0] > 0:
                identity = df.iloc[0].identity
                faceDistance = df.iloc[0, 1]
                identity = (
                    identity.replace("\\", "/").split("/")[-1].split(".")[0].split("_")
                )
                name = identity[0] + " " + identity[1]
                personId = identity[2]
                faceId = identity[3]
        except:
            # sys.stderr.write("Face recognition failed.\n")
            pass

        return name.title(), faceDistance, personId, faceId
