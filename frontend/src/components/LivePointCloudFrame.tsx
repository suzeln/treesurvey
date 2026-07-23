import { LoaderCircle } from "lucide-react";

interface LivePointCloudFrameProps {
  mode?: "presentation" | "workspace";
  loading?: "eager" | "lazy";
}

const baseUrl = import.meta.env.BASE_URL;

export function LivePointCloudFrame({
  mode = "presentation",
  loading = "lazy",
}: LivePointCloudFrameProps) {
  const sidebar = mode === "presentation" ? "1" : "0";
  const viewerUrl = `${baseUrl}legacy/embed.html?sidebar=${sidebar}`;
  return (
    <div className={`live-pointcloud-frame frame-${mode}`}>
      <div className="live-frame-loading" aria-hidden="true">
        <LoaderCircle size={19} />
        <span>Loading HKUST point cloud</span>
      </div>
      <iframe
        src={viewerUrl}
        title="Interactive HKUST tree point cloud"
        loading={loading}
        allowFullScreen
      />
    </div>
  );
}
