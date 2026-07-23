import {
  ArrowRight,
  Braces,
  Check,
  CircleDotDashed,
  Database,
  Layers3,
  Map,
  Radio,
  Trees,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PlaceholderViewer } from "../components/PlaceholderViewer";
import { StatusBadge } from "../components/StatusBadge";
import { metrics, products, sessions } from "../data/staticData";

export function OverviewPage() {
  return (
    <div className="overview-page page-width">
      <section className="overview-hero">
        <div className="hero-copy">
          <p className="eyebrow">LIDAR · MULTIMODAL AI · DIGITAL TWIN</p>
          <h1>From individual trees<br />to a living forest twin.</h1>
          <p className="hero-lead">
            A reproducible research workspace for HKUST campus tree surveys,
            connecting TreeX segmentation, structural models, diagnostic evidence
            and immersive reconstruction.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/explorer">
              Open forest explorer <ArrowRight size={16} />
            </Link>
            <Link className="button secondary" to="/methods">
              View research methods
            </Link>
          </div>
          <div className="hero-proof">
            <span><Check size={14} /> Real HKUST survey inventory</span>
            <span><Check size={14} /> Versioned research assets</span>
            <span><Check size={14} /> Modular viewer adapters</span>
          </div>
        </div>
        <div className="hero-visual">
          <PlaceholderViewer kind="point-cloud" compact />
          <div className="hero-floating-card card-a">
            <Trees size={17} />
            <span><small>Tree observations</small><b>346</b></span>
          </div>
          <div className="hero-floating-card card-b">
            <CircleDotDashed size={17} />
            <span><small>3DGS pipeline</small><b>Preparation</b></span>
          </div>
        </div>
      </section>

      <section className="metric-strip" aria-label="Platform summary">
        {metrics.map((metric) => (
          <article key={metric.label} className={`metric-card tone-${metric.tone ?? "neutral"}`}>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">RESEARCH OBJECTS</p>
            <h2>One tree, multiple scientific views</h2>
            <p>Each panel is an independent data product with a stable adapter boundary.</p>
          </div>
          <Link to="/explorer" className="text-link">Explore workspace <ArrowRight size={15} /></Link>
        </div>
        <div className="product-grid">
          {products.map((product, index) => (
            <article className="product-card" key={product.kind}>
              <div className="product-number">{String(index + 1).padStart(2, "0")}</div>
              <div className={`product-visual product-${product.kind}`}>
                <div className="placeholder-word">PLACEHOLDER</div>
                {product.kind === "point-cloud" && <Layers3 size={31} />}
                {product.kind === "gaussian-splat" && <CircleDotDashed size={31} />}
                {product.kind === "uav" && <Map size={31} />}
                {!["point-cloud", "gaussian-splat", "uav"].includes(product.kind) && <Braces size={31} />}
              </div>
              <div className="product-body">
                <div className="product-meta">
                  <p className="eyebrow">{product.eyebrow}</p>
                  <StatusBadge status={product.status} />
                </div>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <code>{product.format}</code>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block session-overview">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SURVEY PROGRAMME</p>
            <h2>Sessions and processing state</h2>
          </div>
          <Link to="/surveys" className="text-link">All survey sessions <ArrowRight size={15} /></Link>
        </div>
        <div className="session-table">
          {sessions.map((session) => (
            <article key={session.id}>
              <span className="session-icon"><Radio size={18} /></span>
              <div>
                <strong>{session.name}</strong>
                <small>{session.capturedAt} · {session.sensorRig}</small>
              </div>
              <div><small>Trees</small><b>{session.treeCount || "—"}</b></div>
              <div><small>Coverage</small><b>{session.extent}</b></div>
              <StatusBadge status={session.status} />
              <ArrowRight size={17} />
            </article>
          ))}
        </div>
      </section>

      <section className="architecture-callout">
        <span className="architecture-icon"><Database size={22} /></span>
        <div>
          <p className="eyebrow">EXTENSIBLE BY DESIGN</p>
          <h2>Data products connect through manifests, not page rewrites.</h2>
          <p>Static placeholders today; TreeX, QSM, graph, 3DGS and inference providers tomorrow.</p>
        </div>
        <Link className="button secondary" to="/methods">Architecture</Link>
      </section>
    </div>
  );
}
