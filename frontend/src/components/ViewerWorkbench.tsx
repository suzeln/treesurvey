import {
  Box,
  Camera,
  CircleDotDashed,
  Cloud,
  Focus,
  GitFork,
  Layers3,
  Maximize2,
  Plane,
  Rotate3D,
  SlidersHorizontal,
} from "lucide-react";
import type { ComponentType } from "react";
import { useApp } from "../context/AppContext";
import type { ViewerKind } from "../types";
import { viewerRegistry } from "../viewers/registry";

const tabs: {
  kind: ViewerKind;
  label: string;
  icon: ComponentType<{ size?: number }>;
}[] = [
  { kind: "point-cloud", label: "Point Cloud", icon: Cloud },
  { kind: "qsm", label: "Tree QSM", icon: Box },
  { kind: "tree-graph", label: "Tree Graph", icon: GitFork },
  { kind: "gaussian-splat", label: "3DGS", icon: CircleDotDashed },
  { kind: "rgb", label: "RGB", icon: Camera },
  { kind: "uav", label: "UAV", icon: Plane },
];

export function ViewerWorkbench() {
  const { activeViewer, setActiveViewer, selectedTree } = useApp();
  const definition = viewerRegistry[activeViewer];
  const Adapter = definition.component;
  const asset = selectedTree?.assets.find((item) => item.kind === activeViewer);

  return (
    <section className="viewer-workbench">
      <div className="viewer-tabs" role="tablist" aria-label="Viewer modes">
        {tabs.map(({ kind, label, icon: Icon }) => (
          <button
            key={kind}
            role="tab"
            aria-selected={activeViewer === kind}
            className={activeViewer === kind ? "active" : ""}
            onClick={() => setActiveViewer(kind)}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
        <span className="viewer-tab-spacer" />
        <button className="icon-button square" aria-label="Fullscreen">
          <Maximize2 size={16} />
        </button>
      </div>

      <div className="viewer-toolbar">
        <button><Rotate3D size={15} /> Orbit</button>
        <button><Focus size={15} /> Focus tree</button>
        <button><Layers3 size={15} /> Layers</button>
        <span />
        <button><SlidersHorizontal size={15} /> Display</button>
      </div>

      <div className="viewer-stage">
        <Adapter tree={selectedTree} asset={asset} />
        <div className="viewer-data-chip">
          <span className="status-dot" />
          {selectedTree?.label ?? "No tree"} · {selectedTree?.sourceTile ?? "No source"}
        </div>
      </div>
    </section>
  );
}
