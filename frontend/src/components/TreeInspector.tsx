import {
  BadgeCheck,
  CircleAlert,
  Database,
  Download,
  ExternalLink,
  MapPin,
  Ruler,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { StatusBadge } from "./StatusBadge";

const number = (value: number | null, digits = 3) =>
  value === null ? "Not recorded" : value.toFixed(digits);

export function TreeInspector() {
  const { selectedTree } = useApp();

  if (!selectedTree) {
    return (
      <aside className="workspace-panel inspector empty-inspector">
        <Database size={28} />
        <h2>No tree selected</h2>
        <p>Select a tree observation from the explorer.</p>
      </aside>
    );
  }

  return (
    <aside className="workspace-panel inspector">
      <div className="panel-heading">
        <span>
          <p className="eyebrow">TREE INSPECTOR</p>
          <h2>{selectedTree.label}</h2>
        </span>
        <button className="icon-button subtle" aria-label="Open tree page">
          <ExternalLink size={17} />
        </button>
      </div>

      <div className="inspector-identity">
        <div className="tree-monogram">T{selectedTree.label.replace(/\D/g, "")}</div>
        <div>
          <StatusBadge status="review" />
          <p>{selectedTree.sourceTile}</p>
        </div>
      </div>

      <section className="inspector-section">
        <div className="section-label"><Ruler size={15} /> Measurements</div>
        <dl className="property-grid">
          <div><dt>DBH</dt><dd>{number(selectedTree.dbhM)} m</dd></div>
          <div><dt>Height</dt><dd>{number(selectedTree.heightM, 1)} m</dd></div>
          <div><dt>Point count</dt><dd>{selectedTree.pointCount ?? "—"}</dd></div>
          <div><dt>TreeX class</dt><dd>{selectedTree.classificationId}</dd></div>
        </dl>
      </section>

      <section className="inspector-section">
        <div className="section-label"><MapPin size={15} /> Local coordinates</div>
        <code className="coordinate-readout">
          X {selectedTree.x.toFixed(4)}<br />
          Y {selectedTree.y.toFixed(4)}<br />
          Z {selectedTree.z ?? "Not recorded"}
        </code>
      </section>

      <section className="inspector-section">
        <div className="section-label"><Sparkles size={15} /> AI evidence</div>
        {selectedTree.predictions.map((prediction) => (
          <div className="prediction-row" key={prediction.task}>
            <span>
              <small>{prediction.task}</small>
              <b>{prediction.label}</b>
            </span>
            <strong>
              {prediction.confidence === null
                ? "—"
                : `${Math.round(prediction.confidence * 100)}%`}
            </strong>
          </div>
        ))}
        <div className="research-warning">
          <CircleAlert size={16} />
          <span>Predictions are unreviewed research evidence, not field diagnosis.</span>
        </div>
      </section>

      <section className="inspector-section provenance">
        <div className="section-label"><BadgeCheck size={15} /> Provenance</div>
        <p>TreeX summary CSV · classification mapping · local survey CRS</p>
      </section>

      <button className="button secondary full-width" disabled>
        <Download size={16} /> Download asset placeholder
      </button>
    </aside>
  );
}
