import {
  Box,
  Camera,
  CircleDotDashed,
  Cloud,
  GitFork,
  Image,
  Plane,
  ScanLine,
} from "lucide-react";
import type { ComponentType } from "react";
import type { ViewerKind } from "../types";

const viewerMeta: Record<
  ViewerKind,
  {
    title: string;
    subtitle: string;
    format: string;
    icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  }
> = {
  "point-cloud": {
    title: "Tree point cloud",
    subtitle: "Potree streaming viewport",
    format: "metadata.json · hierarchy.bin · octree.bin",
    icon: Cloud,
  },
  qsm: {
    title: "Tree QSM",
    subtitle: "Quantitative structural model",
    format: "Expected GLB / cylinder JSON",
    icon: Box,
  },
  "tree-graph": {
    title: "Tree graph",
    subtitle: "Branch hierarchy and topology",
    format: "Expected JSON / GraphML",
    icon: GitFork,
  },
  "gaussian-splat": {
    title: "3D Gaussian Splatting",
    subtitle: "Photorealistic forest digital twin",
    format: "Expected PLY / SPLAT / KSplat",
    icon: CircleDotDashed,
  },
  rgb: {
    title: "Tree RGB imagery",
    subtitle: "Ground-level multimodal evidence",
    format: "Expected JPEG / PNG image set",
    icon: Camera,
  },
  uav: {
    title: "UAV aerial imagery",
    subtitle: "Canopy and survey context",
    format: "Expected GeoTIFF / JPEG",
    icon: Plane,
  },
};

export function PlaceholderViewer({
  kind,
  compact = false,
}: {
  kind: ViewerKind;
  compact?: boolean;
}) {
  const meta = viewerMeta[kind];
  const Icon = meta.icon;

  return (
    <div className={`placeholder-viewer viewer-${kind} ${compact ? "compact" : ""}`}>
      <div className="viewport-grid" />
      <div className="viewport-cloud" aria-hidden="true">
        {Array.from({ length: 34 }).map((_, index) => (
          <span
            key={index}
            style={{
              left: `${8 + index * 2.45}%`,
              top: `${80 - index * 1.7}%`,
              width: `${2 + (index % 3)}px`,
              height: `${2 + (index % 4)}px`,
            }}
          />
        ))}
      </div>
      <div className="axis-gizmo" aria-hidden="true">
        <i className="axis-x" />
        <i className="axis-y" />
        <i className="axis-z" />
      </div>
      <div className="placeholder-card">
        <span className="placeholder-icon"><Icon size={26} strokeWidth={1.5} /></span>
        <p className="eyebrow">PLACEHOLDER</p>
        <h3>{meta.title}</h3>
        <p>{meta.subtitle}</p>
        <code>{meta.format}</code>
      </div>
      {!compact && (
        <div className="viewport-caption">
          <span><ScanLine size={14} /> Adapter slot: {kind}</span>
          <span><Image size={14} /> No production asset connected</span>
        </div>
      )}
    </div>
  );
}
