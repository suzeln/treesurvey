import {
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleDotDashed,
  Clock3,
  Orbit,
  Play,
  Radio,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { PlaceholderViewer } from "../components/PlaceholderViewer";

const stages = [
  ["Bag audit", "Camera, LiDAR, IMU and timing", "complete"],
  ["Frame selection", "Blur and exposure filtering", "ready"],
  ["Pose export", "Calibrated transforms.json", "ready"],
  ["3DGS training", "Splatfacto / gsplat", "placeholder"],
  ["Evaluation", "Held-out views and metrics", "placeholder"],
] as const;

export function DigitalTwinPage() {
  return (
    <div className="standard-page page-width digital-twin-page">
      <PageHeader
        eyebrow="FOREST DIGITAL TWIN"
        title="3D Gaussian Splatting"
        description="A reusable ROS bag to immersive reconstruction workflow."
        actions={<button className="button primary" disabled><Play size={16} /> Open viewer</button>}
      />

      <div className="twin-main-grid">
        <section className="twin-viewport-card">
          <div className="card-toolbar">
            <span><CircleDotDashed size={17} /> Digital twin viewport</span>
            <div>
              <button className="icon-button subtle"><Orbit size={16} /></button>
              <button className="icon-button subtle"><Camera size={16} /></button>
            </div>
          </div>
          <PlaceholderViewer kind="gaussian-splat" />
        </section>

        <aside className="pipeline-panel">
          <p className="eyebrow">RECONSTRUCTION PIPELINE</p>
          <h2>Session readiness</h2>
          <p className="muted">S20 · 13:16 campus route</p>
          <div className="pipeline-stages">
            {stages.map(([title, detail, state], index) => (
              <div className={`pipeline-stage stage-${state}`} key={title}>
                <span className="stage-marker">
                  {state === "complete" ? <CheckCircle2 size={17} /> : index + 1}
                </span>
                <div><b>{title}</b><small>{detail}</small></div>
                <ChevronRight size={15} />
              </div>
            ))}
          </div>
          <div className="pipeline-meta">
            <span><Radio size={15} /> Source ROS bag</span>
            <span><Clock3 size={15} /> Timestamp-aligned poses</span>
          </div>
        </aside>
      </div>

      <div className="twin-metric-grid">
        {[
          ["Selected frames", "PLACEHOLDER", "Images passing quality filters"],
          ["Pose coverage", "PLACEHOLDER", "Calibrated camera trajectory"],
          ["Training state", "NOT STARTED", "GPU job not connected"],
          ["Quality score", "PLACEHOLDER", "PSNR · SSIM · LPIPS"],
        ].map(([label, value, detail]) => (
          <article key={label}>
            <small>{label}</small><b>{value}</b><p>{detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
