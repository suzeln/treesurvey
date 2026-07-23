import type {
  DataProduct,
  PlatformMetric,
  SurveySession,
  TreeAsset,
  TreeRecord,
  ViewerKind,
} from "../types";

const asset = (
  kind: ViewerKind,
  label: string,
  format: string,
  status: TreeAsset["status"] = "placeholder",
  uri?: string,
): TreeAsset => ({ kind, label, format, status, uri });

const defaultAssets: TreeAsset[] = [
  asset("point-cloud", "Tree point cloud", "Potree / LAZ", "available"),
  asset("qsm", "Tree QSM", "GLB / JSON"),
  asset("tree-graph", "Tree topology graph", "JSON / GraphML"),
  asset("gaussian-splat", "Gaussian splat", "PLY / Splat"),
  asset("rgb", "Tree RGB imagery", "JPEG / PNG"),
  asset("uav", "UAV aerial imagery", "GeoTIFF / JPEG"),
];

const sessionId = "HKUST-S20-2026-05-06-13-16-34";

export const sessions: SurveySession[] = [
  {
    id: sessionId,
    name: "S20 · 13:16 Campus Route",
    capturedAt: "2026-05-06 13:16",
    sensorRig: "Livox LiDAR + RGB + RTK/IMU",
    treeCount: 167,
    extent: "147.1 × 423.7 m",
    status: "available",
    progress: 72,
  },
  {
    id: "HKUST-S20-2026-05-06-14-12-56",
    name: "S20 · 14:12 Campus Route",
    capturedAt: "2026-05-06 14:12",
    sensorRig: "LiDAR + RGB survey rig",
    treeCount: 179,
    extent: "Campus roadside corridor",
    status: "processing",
    progress: 54,
  },
  {
    id: "HKUST-S20-FUTURE-SURVEY",
    name: "Future longitudinal survey",
    capturedAt: "Not scheduled",
    sensorRig: "Placeholder",
    treeCount: 0,
    extent: "Placeholder",
    status: "placeholder",
    progress: 0,
  },
];

const treeSeed = [
  ["86", -1.0808, 43.3174, 0.1793, 1],
  ["87", 0.1599, 44.3274, 0.1837, 3],
  ["88", -1.6241, 46.6604, 0.2649, 4],
  ["89", -1.7461, 46.8732, 0.2173, 5],
  ["90", -0.1093, 49.2435, 0.1582, 6],
  ["91", 0.0022, 42.3734, 0.7743, 7],
  ["92", -1.1309, 40.9012, 0.031, 8],
  ["93", -0.0879, 43.4232, 0.4537, 9],
] as const;

export const trees: TreeRecord[] = treeSeed.map(
  ([id, x, y, dbhM, classificationId], index) => ({
    id: `${sessionId}:${id}`,
    label: `Tree ${id}`,
    sessionId,
    sourceTile: "tile_x002_y003",
    x,
    y,
    z: null,
    dbhM,
    heightM: index === 2 ? 9.8 : null,
    species: "Pending field label",
    health: index === 5 ? "Review recommended" : "Not assessed",
    structuralConfidence: index === 2 ? 0.87 : null,
    pointCount: null,
    classificationId,
    predictions: [
      {
        task: "species",
        label: "Placeholder",
        confidence: null,
        model: "Species adapter not connected",
        reviewStatus: "unreviewed",
      },
      {
        task: "health",
        label: index === 5 ? "Review recommended" : "Placeholder",
        confidence: index === 5 ? 0.61 : null,
        model: "Structural evidence adapter",
        reviewStatus: "review-required",
      },
    ],
    assets: defaultAssets.map((item) => ({ ...item })),
  }),
);

export const metrics: PlatformMetric[] = [
  {
    label: "Tree observations",
    value: "346",
    detail: "Across two processed survey sessions",
    tone: "green",
  },
  {
    label: "Published point cloud",
    value: "8.18 M",
    detail: "Points in the current Potree demonstration",
  },
  {
    label: "Digital twin readiness",
    value: "ROS audited",
    detail: "Camera, LiDAR and pose products discovered",
    tone: "amber",
  },
  {
    label: "Field validation",
    value: "Pending",
    detail: "Species and health labels are not yet verified",
    tone: "neutral",
  },
];

export const products: DataProduct[] = [
  {
    kind: "point-cloud",
    eyebrow: "LIDAR",
    title: "Tree point cloud",
    description: "Stream individual TreeX instances and survey context.",
    format: "Potree · LAZ",
    status: "available",
  },
  {
    kind: "qsm",
    eyebrow: "STRUCTURE",
    title: "Tree QSM",
    description: "Quantitative structural cylinder model and measurements.",
    format: "GLB · JSON",
    status: "placeholder",
  },
  {
    kind: "tree-graph",
    eyebrow: "TOPOLOGY",
    title: "Tree graph",
    description: "Branch hierarchy, adjacency and structural graph evidence.",
    format: "JSON · GraphML",
    status: "placeholder",
  },
  {
    kind: "gaussian-splat",
    eyebrow: "DIGITAL TWIN",
    title: "3D Gaussian Splatting",
    description: "Photorealistic forest reconstruction from ROS bag imagery.",
    format: "PLY · SPLAT",
    status: "processing",
  },
  {
    kind: "rgb",
    eyebrow: "GROUND IMAGERY",
    title: "Tree RGB images",
    description: "Tree-level evidence for species and health assessment.",
    format: "JPEG · PNG",
    status: "placeholder",
  },
  {
    kind: "uav",
    eyebrow: "AERIAL IMAGERY",
    title: "UAV survey",
    description: "Canopy context and future geospatial survey comparison.",
    format: "GeoTIFF · JPEG",
    status: "placeholder",
  },
];
