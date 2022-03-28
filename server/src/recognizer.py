import sys
from deepface import DeepFace
from deepface.basemodels import Facenet, VGGFace


class Recognizer:
    def __init__(self, db_path, modelName="Facenet"):
        self.database = db_path
        self.modelName = modelName
        self.model = None

        if modelName == "Facenet":
            self.model = Facenet.loadModel()
        else:
            self.modelName = "VGG-Face"
            self.model = VGGFace.loadModel()

        print("Recognizer: Model " + self.modelName + " loaded.")

    def find(self, person_bbox):
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
            sys.stderr.write("Face recognition failed.\n")

        return name.title(), faceDistance, personId, faceId
