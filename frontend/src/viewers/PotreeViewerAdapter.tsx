import { PlaceholderViewer } from "../components/PlaceholderViewer";
import type { ViewerAdapterProps } from "./ViewerAdapter";

/**
 * Potree integration boundary.
 *
 * The current production viewer remains in `web/`. When the migration is
 * enabled, this adapter owns Potree lifecycle, classification styling, camera
 * focus and cleanup without leaking imperative globals into React pages.
 */
export function PotreeViewerAdapter({ tree, asset }: ViewerAdapterProps) {
  return (
    <div
      className="viewer-adapter"
      data-adapter="potree"
      data-tree-id={tree?.id}
      data-asset-uri={asset?.uri}
    >
      <PlaceholderViewer kind="point-cloud" />
    </div>
  );
}
