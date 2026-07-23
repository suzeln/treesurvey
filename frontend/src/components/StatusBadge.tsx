import type { DataStatus } from "../types";

const labels: Record<DataStatus, string> = {
  available: "Available",
  processing: "Processing",
  placeholder: "Placeholder",
  review: "Review required",
};

export function StatusBadge({ status }: { status: DataStatus }) {
  return <span className={`status-badge status-${status}`}>{labels[status]}</span>;
}
