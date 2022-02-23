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
        recognized = False
        identity = "Unknown"

        df = DeepFace.find(
            person_bbox,
            "./database",
            model_name=self.modelName,
            model=self.model,
            distance_metric="cosine",
            enforce_detection=False,
        )

        if df.shape[0] > 0:
            identity = df.iloc[0].identity
            identity = identity.split("\\")[-1].split("/")[0]
            recognized = True

        return recognized, identity
