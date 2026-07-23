import {
  Box,
  CircleDot,
  ExternalLink,
  Info,
  MousePointer2,
  Move3D,
  ScanSearch,
  TreePine,
} from "lucide-react";
import { LivePointCloudFrame } from "../components/LivePointCloudFrame";

const baseUrl = import.meta.env.BASE_URL;

const facts = [
  { label: "Survey", value: "HKUST S20 · 2026-05-06" },
  { label: "Published tile", value: "tile_x002_y003" },
  { label: "Point count", value: "8,176,810" },
  { label: "Tree instances", value: "30 classifications" },
];

const gestures = [
  {
    icon: Move3D,
    label: "Orbit",
    detail: "Drag with the left mouse button to inspect the stand.",
  },
  {
    icon: ScanSearch,
    label: "Zoom",
    detail: "Use the wheel to move between canopy and stem detail.",
  },
  {
    icon: MousePointer2,
    label: "Inspect",
    detail: "Use the Potree sidebar tools for measurements and clipping.",
  },
];

export function LiveDataPage() {
  return (
    <div className="live-data-page">
      <section className="live-data-intro page-width">
        <div>
          <p className="eyebrow">REAL DATA PRESENTATION</p>
          <h1>Explore the HKUST forest survey in 3D.</h1>
        </div>
        <p>
          A browser-streamed TreeX result from the campus roadside survey.
          Rotate, zoom, measure and inspect tree instances directly in Potree.
        </p>
      </section>

      <section className="live-presentation page-width">
        <header className="live-presentation-bar">
          <div className="live-dataset-title">
            <span className="live-mark"><TreePine size={18} /></span>
            <span>
              <strong>HKUST S20 forest corridor</strong>
              <small>TreeX segmented point cloud · local survey metres</small>
            </span>
          </div>
          <div className="live-dataset-state">
            <span><CircleDot size={13} /> Live dataset</span>
            <span><Box size={13} /> Potree 2.0 derivative</span>
          </div>
          <a
            className="button secondary"
            href={`${baseUrl}legacy/`}
            target="_blank"
            rel="noreferrer"
          >
            Full workspace <ExternalLink size={15} />
          </a>
        </header>

        <LivePointCloudFrame mode="presentation" loading="eager" />

        <div className="live-fact-grid">
          {facts.map((fact) => (
            <div key={fact.label}>
              <small>{fact.label}</small>
              <strong>{fact.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="live-data-notes page-width">
        <div className="interaction-guide">
          <p className="eyebrow">INTERACTION GUIDE</p>
          <h2>Work with the data, not a screenshot.</h2>
          <div className="gesture-grid">
            {gestures.map(({ icon: Icon, label, detail }) => (
              <article key={label}>
                <Icon size={20} />
                <div>
                  <strong>{label}</strong>
                  <p>{detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="dataset-note">
          <Info size={21} />
          <div>
            <p className="eyebrow">DATA PROVENANCE</p>
            <h2>Reproducible research derivative</h2>
            <p>
              The browser loads a multi-resolution Potree conversion, while the
              original LAS/LAZ and processing records remain outside the static
              website. Classification 0 is hidden and classifications 1–30
              represent segmented tree instances.
            </p>
            <code>HKUST-S20-2026-05-06-13-16-34 / tile_x002_y003</code>
          </div>
        </aside>
      </section>
    </div>
  );
}
