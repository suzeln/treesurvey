import {
  ArrowDown,
  Boxes,
  Braces,
  Cloud,
  Database,
  FileCheck2,
  GitBranch,
  ScanSearch,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";

const flow = [
  { icon: ScanSearch, label: "Survey capture", detail: "LiDAR · RGB · RTK/IMU · ROS bag" },
  { icon: GitBranch, label: "TreeX processing", detail: "Tiles · segmentation · inventory" },
  { icon: Database, label: "Research catalog", detail: "Trees · assets · provenance" },
  { icon: Boxes, label: "Digital products", detail: "Potree · QSM · Graph · 3DGS" },
];

export function MethodsPage() {
  return (
    <div className="standard-page page-width methods-page">
      <PageHeader
        eyebrow="METHODS & PROVENANCE"
        title="A reproducible data product architecture"
        description="The interface is separated from algorithms, storage and visualization engines."
      />
      <section className="method-flow">
        {flow.map(({ icon: Icon, label, detail }, index) => (
          <div className="method-flow-item" key={label}>
            <span><Icon size={22} /></span>
            <div><b>{label}</b><small>{detail}</small></div>
            {index < flow.length - 1 && <ArrowDown className="flow-arrow" size={18} />}
          </div>
        ))}
      </section>

      <div className="methods-grid">
        <section>
          <p className="eyebrow">FRONTEND BOUNDARY</p>
          <h2>Viewer adapters</h2>
          <p>Every visualization implements a shared slot contract, so its rendering engine can change independently.</p>
          <ul className="method-list">
            <li><Cloud size={16} /><span><b>PotreeViewerAdapter</b><small>Current point cloud integration boundary</small></span></li>
            <li><Braces size={16} /><span><b>QsmViewerAdapter</b><small>GLB or cylinder JSON renderer</small></span></li>
            <li><GitBranch size={16} /><span><b>TreeGraphAdapter</b><small>Topology graph renderer</small></span></li>
            <li><Boxes size={16} /><span><b>GaussianSplatAdapter</b><small>Future 3DGS viewer integration</small></span></li>
          </ul>
        </section>
        <section>
          <p className="eyebrow">DATA BOUNDARY</p>
          <h2>Provider contract</h2>
          <p>The current static provider can later be replaced by the versioned tree platform API.</p>
          <pre className="contract-code">{`interface DataProvider {
  listSessions(): Promise<SurveySession[]>
  listTrees(sessionId?): Promise<TreeRecord[]>
  getTree(id): Promise<TreeRecord | undefined>
}`}</pre>
        </section>
      </div>

      <section className="provenance-callout">
        <FileCheck2 size={25} />
        <div>
          <p className="eyebrow">SCIENTIFIC SAFETY</p>
          <h2>Missing evidence is shown as missing.</h2>
          <p>Placeholder, processing, unreviewed and verified states remain visually distinct throughout the platform.</p>
        </div>
      </section>
    </div>
  );
}
