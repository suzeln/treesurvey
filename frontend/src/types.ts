export type DataStatus = "available" | "processing" | "placeholder" | "review";

export type ViewerKind =
  | "point-cloud"
  | "qsm"
  | "tree-graph"
  | "gaussian-splat"
  | "rgb"
  | "uav";

export interface SurveySession {
  id: string;
  name: string;
  capturedAt: string;
  sensorRig: string;
  treeCount: number;
  extent: string;
  status: DataStatus;
  progress: number;
}

export interface Prediction {
  task: "species" | "health" | "structure";
  label: string;
  confidence: number | null;
  model: string;
  reviewStatus: "unreviewed" | "review-required" | "verified";
}

export interface TreeAsset {
  kind: ViewerKind;
  label: string;
  format: string;
  status: DataStatus;
  uri?: string;
}

export interface TreeRecord {
  id: string;
  label: string;
  sessionId: string;
  sourceTile: string;
  x: number;
  y: number;
  z: number | null;
  dbhM: number | null;
  heightM: number | null;
  species: string;
  health: string;
  structuralConfidence: number | null;
  pointCount: number | null;
  classificationId: number;
  predictions: Prediction[];
  assets: TreeAsset[];
}

export interface PlatformMetric {
  label: string;
  value: string;
  detail: string;
  tone?: "green" | "amber" | "neutral";
}

export interface DataProduct {
  kind: ViewerKind;
  eyebrow: string;
  title: string;
  description: string;
  format: string;
  status: DataStatus;
}

export interface DataProvider {
  listSessions(): Promise<SurveySession[]>;
  listTrees(sessionId?: string): Promise<TreeRecord[]>;
  getTree(id: string): Promise<TreeRecord | undefined>;
}
