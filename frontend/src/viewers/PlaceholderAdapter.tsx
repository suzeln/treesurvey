import { PlaceholderViewer } from "../components/PlaceholderViewer";
import type { ViewerKind } from "../types";
import type { ViewerAdapterProps } from "./ViewerAdapter";

export function createPlaceholderAdapter(kind: ViewerKind) {
  return function PlaceholderAdapter(_props: ViewerAdapterProps) {
    return <PlaceholderViewer kind={kind} />;
  };
}
