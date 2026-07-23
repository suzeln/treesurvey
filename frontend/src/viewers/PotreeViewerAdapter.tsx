import { LivePointCloudFrame } from "../components/LivePointCloudFrame";
import type { ViewerAdapterProps } from "./ViewerAdapter";

/**
 * Potree integration boundary.
 *
 * Potree remains isolated in `web/embed.html` and is embedded here so its
 * imperative lifecycle does not leak into the React application.
 */
export function PotreeViewerAdapter({ tree, asset }: ViewerAdapterProps) {
  return (
    <div
      className="viewer-adapter"
      data-adapter="potree"
      data-tree-id={tree?.id}
      data-asset-uri={asset?.uri}
    >
      <LivePointCloudFrame mode="workspace" loading="eager" />
    </div>
  );
}
