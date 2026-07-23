import {
  ArrowRight,
  CalendarDays,
  Database,
  Radio,
  Satellite,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { PlaceholderViewer } from "../components/PlaceholderViewer";
import { StatusBadge } from "../components/StatusBadge";
import { sessions } from "../data/staticData";

export function SurveysPage() {
  return (
    <div className="standard-page page-width">
      <PageHeader
        eyebrow="FIELD CAMPAIGNS"
        title="Survey sessions"
        description="Capture context, sensor provenance and derived data products."
        actions={<button className="button primary" disabled>Register session</button>}
      />
      <div className="survey-layout">
        <div className="survey-list">
          {sessions.map((session, index) => (
            <article className="survey-card" key={session.id}>
              <div className="survey-card-head">
                <span className="session-icon large"><Radio size={21} /></span>
                <div>
                  <p className="eyebrow">SESSION {String(index + 1).padStart(2, "0")}</p>
                  <h2>{session.name}</h2>
                </div>
                <StatusBadge status={session.status} />
              </div>
              <div className="survey-facts">
                <span><CalendarDays size={15} /><small>Captured</small><b>{session.capturedAt}</b></span>
                <span><Satellite size={15} /><small>Sensor rig</small><b>{session.sensorRig}</b></span>
                <span><Database size={15} /><small>Tree records</small><b>{session.treeCount || "—"}</b></span>
              </div>
              <div className="progress-row">
                <span>Derived products</span><b>{session.progress}%</b>
                <div><i style={{ width: `${session.progress}%` }} /></div>
              </div>
              <button className="text-link">Inspect session <ArrowRight size={15} /></button>
            </article>
          ))}
        </div>
        <div className="survey-aside">
          <div className="aside-heading">
            <p className="eyebrow">AERIAL CONTEXT</p>
            <h2>UAV imagery</h2>
          </div>
          <PlaceholderViewer kind="uav" compact />
          <div className="mini-note">
            <strong>Future connection</strong>
            <p>Orthomosaic, flight path, camera metadata and canopy comparison.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
