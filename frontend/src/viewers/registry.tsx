import { PotreeViewerAdapter } from "./PotreeViewerAdapter";
import { createPlaceholderAdapter } from "./PlaceholderAdapter";
import type { ViewerAdapterDefinition } from "./ViewerAdapter";
import type { ViewerKind } from "../types";

const qsm = createPlaceholderAdapter("qsm");
const graph = createPlaceholderAdapter("tree-graph");
const splat = createPlaceholderAdapter("gaussian-splat");
const rgb = createPlaceholderAdapter("rgb");
const uav = createPlaceholderAdapter("uav");

export const viewerRegistry: Record<ViewerKind, ViewerAdapterDefinition> = {
  "point-cloud": {
    kind: "point-cloud",
    label: "Point Cloud",
    component: PotreeViewerAdapter,
    supportedFormats: ["Potree metadata.json", "LAZ derivative"],
  },
  qsm: {
    kind: "qsm",
    label: "Tree QSM",
    component: qsm,
    supportedFormats: ["GLB", "Cylinder JSON"],
  },
  "tree-graph": {
    kind: "tree-graph",
    label: "Tree Graph",
    component: graph,
    supportedFormats: ["JSON", "GraphML"],
  },
  "gaussian-splat": {
    kind: "gaussian-splat",
    label: "3DGS",
    component: splat,
    supportedFormats: ["PLY", "SPLAT", "KSplat"],
  },
  rgb: {
    kind: "rgb",
    label: "RGB",
    component: rgb,
    supportedFormats: ["JPEG", "PNG"],
  },
  uav: {
    kind: "uav",
    label: "UAV",
    component: uav,
    supportedFormats: ["GeoTIFF", "JPEG"],
  },
};
