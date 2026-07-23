import {
  ArrowUpDown,
  Download,
  ExternalLink,
  Filter,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { useApp } from "../context/AppContext";

export function TreeCatalogPage() {
  const { trees, search, setSearch } = useApp();
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return trees.filter((tree) =>
      !query
        ? true
        : [tree.id, tree.label, tree.sourceTile, tree.species]
            .join(" ")
            .toLowerCase()
            .includes(query),
    );
  }, [search, trees]);

  return (
    <div className="standard-page page-width">
      <PageHeader
        eyebrow="TREE DATABASE"
        title="Tree catalog"
        description="Search individual observations and inspect linked scientific assets."
        actions={
          <button className="button secondary" disabled>
            <Download size={16} /> Export selection
          </button>
        }
      />

      <div className="catalog-toolbar">
        <label className="search-field large">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tree ID, source tile or species"
          />
        </label>
        <button className="button secondary"><Filter size={16} /> Filters</button>
        <button className="button secondary"><SlidersHorizontal size={16} /> Columns</button>
        <span>{visible.length} observations</span>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tree <ArrowUpDown size={13} /></th>
              <th>Source tile</th>
              <th>DBH</th>
              <th>Height</th>
              <th>Species</th>
              <th>Health</th>
              <th>Assets</th>
              <th aria-label="Open" />
            </tr>
          </thead>
          <tbody>
            {visible.map((tree) => (
              <tr key={tree.id}>
                <td>
                  <span className="table-tree-id">{tree.label.slice(-3)}</span>
                  <span><b>{tree.label}</b><small>{tree.id}</small></span>
                </td>
                <td><code>{tree.sourceTile}</code></td>
                <td>{tree.dbhM?.toFixed(3) ?? "—"} m</td>
                <td>{tree.heightM?.toFixed(1) ?? "—"}</td>
                <td><span className="placeholder-inline">{tree.species}</span></td>
                <td>{tree.health}</td>
                <td><span className="asset-count">{tree.assets.filter((item) => item.status === "available").length}</span> / {tree.assets.length}</td>
                <td>
                  <Link className="icon-button subtle" to={`/trees/${encodeURIComponent(tree.id)}`}>
                    <ExternalLink size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
