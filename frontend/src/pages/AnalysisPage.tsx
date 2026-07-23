import {
  Activity,
  BrainCircuit,
  CircleAlert,
  Dna,
  GitCompare,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";

const analyses = [
  {
    icon: Dna,
    eyebrow: "SPECIES",
    title: "Tree species recognition",
    description: "RGB and multimodal classification with calibrated top-k confidence.",
    model: "BioCLIP / project adapter",
  },
  {
    icon: ShieldCheck,
    eyebrow: "HEALTH",
    title: "Health status screening",
    description: "Evidence-based risk flags combining images and structural indicators.",
    model: "Health adapter placeholder",
  },
  {
    icon: Activity,
    eyebrow: "STRUCTURE",
    title: "Structural assessment",
    description: "DBH support, vertical continuity, fit residual and topology evidence.",
    model: "TreeX inventory evidence",
  },
];

export function AnalysisPage() {
  return (
    <div className="standard-page page-width">
      <PageHeader
        eyebrow="MULTIMODAL INFERENCE"
        title="Analysis and diagnostics"
        description="Replaceable model adapters with visible confidence, provenance and review state."
      />

      <div className="analysis-banner">
        <CircleAlert size={19} />
        <div>
          <b>Research evidence only</b>
          <p>Species and health results remain unverified until field labels and calibration are available.</p>
        </div>
      </div>

      <div className="analysis-grid">
        {analyses.map(({ icon: Icon, eyebrow, title, description, model }) => (
          <article className="analysis-card" key={title}>
            <div className="analysis-icon"><Icon size={23} /></div>
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
            <p>{description}</p>
            <div className="analysis-placeholder">
              <BrainCircuit size={22} />
              <span><b>PLACEHOLDER</b><small>No inference result connected</small></span>
            </div>
            <div className="model-row">
              <small>Adapter</small><code>{model}</code>
            </div>
          </article>
        ))}
      </div>

      <section className="comparison-section">
        <div>
          <p className="eyebrow">MODEL PROVENANCE</p>
          <h2>Comparable, versioned results</h2>
          <p>New models append results instead of silently replacing earlier predictions.</p>
        </div>
        <div className="comparison-placeholder">
          <GitCompare size={25} />
          <span><b>MODEL COMPARISON PLACEHOLDER</b><small>Accuracy · calibration · field review</small></span>
        </div>
      </section>
    </div>
  );
}
