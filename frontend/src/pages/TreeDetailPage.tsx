import { ArrowLeft, Copy, Download } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { TreeInspector } from "../components/TreeInspector";
import { ViewerWorkbench } from "../components/ViewerWorkbench";
import { useApp } from "../context/AppContext";

export function TreeDetailPage() {
  const { treeId } = useParams();
  const { selectedTree, setSelectedTreeId } = useApp();

  useEffect(() => {
    if (treeId) setSelectedTreeId(decodeURIComponent(treeId));
  }, [setSelectedTreeId, treeId]);

  return (
    <div className="tree-detail-page">
      <div className="tree-detail-topbar">
        <Link to="/trees" className="text-link"><ArrowLeft size={16} /> Tree catalog</Link>
        <span className="breadcrumb-separator">/</span>
        <strong>{selectedTree?.label ?? "Tree observation"}</strong>
        <span className="topbar-spacer" />
        <button className="button secondary"><Copy size={15} /> Copy link</button>
        <button className="button secondary" disabled><Download size={15} /> Download</button>
      </div>
      <div className="tree-detail-workspace">
        <ViewerWorkbench />
        <TreeInspector />
      </div>
    </div>
  );
}
