import type { ComponentType } from "react";
import type { TreeAsset, TreeRecord, ViewerKind } from "../types";

export interface ViewerAdapterProps {
  tree?: TreeRecord;
  asset?: TreeAsset;
}

export interface ViewerAdapterDefinition {
  kind: ViewerKind;
  label: string;
  component: ComponentType<ViewerAdapterProps>;
  supportedFormats: string[];
}
