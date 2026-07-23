import { ChevronRight, Filter, Layers3, Search, Trees } from "lucide-react";
import { useMemo } from "react";
import { useApp } from "../context/AppContext";

export function DataExplorer() {
  const {
    sessions,
    trees,
    selectedSessionId,
    selectedTree,
    search,
    setSelectedSessionId,
    setSelectedTreeId,
    setSearch,
  } = useApp();

  const visibleTrees = useMemo(() => {
    const query = search.trim().toLowerCase();
    return trees.filter(
      (tree) =>
        tree.sessionId === selectedSessionId &&
        (!query ||
          [tree.id, tree.label, tree.sourceTile]
            .join(" ")
            .toLowerCase()
            .includes(query)),
    );
  }, [search, selectedSessionId, trees]);

  return (
    <aside className="workspace-panel data-explorer">
      <div className="panel-heading">
        <span>
          <p className="eyebrow">DATA</p>
          <h2>Explorer</h2>
        </span>
        <button className="icon-button subtle" aria-label="Filter data">
          <Filter size={17} />
        </button>
      </div>

      <label className="field-label" htmlFor="session-select">Survey session</label>
      <select
        id="session-select"
        value={selectedSessionId}
        onChange={(event) => setSelectedSessionId(event.target.value)}
      >
        {sessions.map((session) => (
          <option value={session.id} key={session.id}>{session.name}</option>
        ))}
      </select>

      <label className="search-field">
        <Search size={16} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tree ID or tile"
          aria-label="Search trees"
        />
        <kbd>⌘K</kbd>
      </label>

      <div className="layer-summary">
        <span><Layers3 size={16} /> TreeX segmentation</span>
        <b>{visibleTrees.length}</b>
      </div>

      <div className="tree-list" role="list">
        {visibleTrees.map((tree) => (
          <button
            key={tree.id}
            className={`tree-list-item ${selectedTree?.id === tree.id ? "selected" : ""}`}
            onClick={() => setSelectedTreeId(tree.id)}
            role="listitem"
          >
            <span className="tree-token"><Trees size={15} /></span>
            <span>
              <strong>{tree.label}</strong>
              <small>DBH {tree.dbhM?.toFixed(3) ?? "—"} m</small>
            </span>
            <ChevronRight size={15} />
          </button>
        ))}
      </div>

      <div className="panel-footnote">
        <span className="status-dot" />
        Static provider · tile_x002_y003
      </div>
    </aside>
  );
}
