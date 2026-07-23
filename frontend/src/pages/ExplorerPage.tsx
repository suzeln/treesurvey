import { DataExplorer } from "../components/DataExplorer";
import { TreeInspector } from "../components/TreeInspector";
import { ViewerWorkbench } from "../components/ViewerWorkbench";

export function ExplorerPage() {
  return (
    <div className="workspace-page">
      <DataExplorer />
      <ViewerWorkbench />
      <TreeInspector />
    </div>
  );
}
