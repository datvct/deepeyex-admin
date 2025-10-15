type Prediction = {
  label: EyeDiseaseLabel;
  index: number;
  probability: number;
};

type DiagnosisResponse = {
  predictions: Prediction[];
  top1: Prediction;
};

type EyeDiseaseLabel =
  | "conjunctivitis"
  | "eyelidedema"
  | "healthy_eye"
  | "hordeolum"
  | "keratitiswithulcer"
  | "subconjunctival_hemorrhage";

export type { Prediction, DiagnosisResponse, EyeDiseaseLabel };
