/* global Potree, TREE_SURVEY_CONFIG */
(() => {
  "use strict";
  const config = window.TREE_SURVEY_CONFIG || {};
  const state = { records: [], selected: null, viewer: null, cloud: null, annotations: [] };
  const byId = (id) => document.getElementById(id);
  const stateNode = byId("connection-state");
  const messageNode = byId("viewer-message");

  const text = (value, fallback = "未记录") => value === null || value === undefined || value === "" ? fallback : String(value);
  const number = (value, precision = 3) => Number.isFinite(Number(value)) ? Number(value).toFixed(precision) : "未记录";
  const escapeHtml = (value) => text(value, "").replace(/[&<>'"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c]));

  function setMessage(message) { messageNode.textContent = message || ""; }

  function visibleRecords() {
    const query = byId("tree-search").value.trim().toLowerCase();
    const session = byId("session-select").value;
    return state.records.filter((record) => (!session || record.session === session) && (!query || [record.id, record.method, record.source_tile, record.x, record.y].join(" ").toLowerCase().includes(query)));
  }

  function renderMetrics(records) {
    const dbhs = records.map((r) => Number(r.dbh_m)).filter(Number.isFinite);
    byId("metrics").innerHTML = [
      ["树木观测", records.length],
      ["可用 DBH", dbhs.length],
      ["平均 DBH", dbhs.length ? `${(dbhs.reduce((a, b) => a + b, 0) / dbhs.length).toFixed(2)} m` : "—"],
      ["坐标", config.coordinateSystem || "Local"],
    ].map(([label, value]) => `<div class="metric"><small>${label}</small><b>${value}</b></div>`).join("");
  }

  function renderList() {
    const records = visibleRecords();
    renderMetrics(records);
    byId("tree-list").innerHTML = records.map((r) => `<button class="tree-item ${state.selected && state.selected.id === r.id ? "active" : ""}" data-tree-id="${escapeHtml(r.id)}"><b>${escapeHtml(r.label || r.id)}</b><small>DBH ${number(r.dbh_m)} m · (${number(r.x)}, ${number(r.y)})</small></button>`).join("") || "<p>没有匹配的树木。</p>";
    document.querySelectorAll("[data-tree-id]").forEach((node) => node.addEventListener("click", () => selectTree(node.dataset.treeId)));
    drawFallbackMap(records);
  }

  function selectTree(id) {
    const record = state.records.find((item) => item.id === id);
    if (!record) return;
    state.selected = record;
    byId("tree-title").textContent = record.label || record.id;
    byId("tree-details").innerHTML = `<dl>
      <dt>观测 ID</dt><dd>${escapeHtml(record.id)}</dd>
      <dt>测绘批次 / 算法</dt><dd>${escapeHtml(text(record.session))} / ${escapeHtml(text(record.method))}</dd>
      <dt>树干位置</dt><dd>X ${number(record.x)}，Y ${number(record.y)} ${record.z !== null ? `，Z ${number(record.z)}` : ""}</dd>
      <dt>DBH</dt><dd>${number(record.dbh_m)} m</dd>
      <dt>点数</dt><dd>${text(record.point_count)}</dd>
      <dt>结构置信度</dt><dd>${number(record.structural_confidence, 2)}</dd>
      <dt>来源瓦片</dt><dd>${escapeHtml(text(record.source_tile))}</dd>
      <dt>点云树木编号</dt><dd>${text(record.cloud_classification_id)}</dd>
    </dl>`;
    if (state.cloud && Number.isFinite(Number(record.x)) && Number.isFinite(Number(record.y))) {
      try {
        const target = new THREE.Vector3(Number(record.x), Number(record.y), Number(record.z || 0));
        state.viewer.scene.view.lookAt(target);
      } catch (error) { console.warn("Unable to focus Potree camera", error); }
    }
    renderList();
  }

  function drawFallbackMap(records) {
    const canvas = byId("inventory-map");
    if (state.cloud) { canvas.style.display = "none"; return; }
    canvas.style.display = "block";
    const rect = canvas.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, rect.width, rect.height);
    const points = records.filter((r) => Number.isFinite(Number(r.x)) && Number.isFinite(Number(r.y)));
    if (!points.length) return;
    const xs = points.map((r) => Number(r.x)); const ys = points.map((r) => Number(r.y));
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const scaleX = (rect.width - 60) / Math.max(maxX - minX, 1); const scaleY = (rect.height - 60) / Math.max(maxY - minY, 1);
    ctx.fillStyle = "#46685b"; ctx.font = "12px system-ui"; ctx.fillText("尚未配置 Potree 点云；当前显示树木平面清单", 20, 24);
    points.forEach((r) => { const x = 30 + (Number(r.x) - minX) * scaleX; const y = rect.height - 30 - (Number(r.y) - minY) * scaleY; ctx.beginPath(); ctx.arc(x, y, state.selected && state.selected.id === r.id ? 7 : 4, 0, Math.PI * 2); ctx.fillStyle = state.selected && state.selected.id === r.id ? "#c55d2c" : "#16735a"; ctx.fill(); });
  }

  function addAnnotations() {
    if (!state.viewer || !state.cloud || !window.Potree) return;
    const displayed = visibleRecords().slice(0, 400);
    state.annotations.forEach((annotation) => {
      try { state.viewer.scene.annotations.remove(annotation); } catch (error) { console.warn("Unable to remove Potree annotation", error); }
    });
    state.annotations = displayed.filter((r) => Number.isFinite(Number(r.x)) && Number.isFinite(Number(r.y))).map((r) => {
      const annotation = new Potree.Annotation({ position: [Number(r.x), Number(r.y), Number(r.z || 0)], title: r.label || r.id, description: `DBH: ${number(r.dbh_m)} m` });
      state.viewer.scene.annotations.add(annotation); return annotation;
    });
  }

  function initialisePotree() {
    if (!config.pointcloudUrl) { setMessage("树木清单已可浏览。完成 PotreeConverter 转换后，在 app-config.js 中填写 metadata.json 路径即可加载三维点云。"); return; }
    if (!window.Potree) { setMessage("Potree 脚本未载入；请检查网络访问或改为本地托管 Potree 依赖。"); return; }
    try {
      state.viewer = new Potree.Viewer(byId("potree_render_area"));
      state.viewer.setEDLEnabled(true); state.viewer.setEDLRadius(1.4); state.viewer.setEDLStrength(0.4);
      state.viewer.setPointBudget(1_500_000); state.viewer.setFOV(60); state.viewer.setBackground("gradient");
      Potree.loadPointCloud(config.pointcloudUrl, config.pointcloudName || "Point cloud", (event) => {
        state.cloud = event.pointcloud;
        state.cloud.material.activeAttributeName = config.treeInstanceAttribute || "classification";
        state.cloud.material.pointSizeType = Potree.PointSizeType.FIXED;
        state.cloud.material.size = 2;
        state.viewer.scene.addPointCloud(state.cloud); state.viewer.fitToScreen(); setMessage(""); addAnnotations(); drawFallbackMap([]);
      });
    } catch (error) { console.error(error); setMessage(`Potree 初始化失败：${error.message}`); }
  }

  async function initialise() {
    try {
      const response = await fetch(config.inventoryUrl || "./data/tree_inventory.json");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json(); state.records = payload.trees || [];
      const sessions = [...new Set(state.records.map((r) => r.session).filter(Boolean))];
      byId("session-select").innerHTML = `<option value="">全部批次 (${state.records.length})</option>${sessions.map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join("")}`;
      byId("session-select").addEventListener("change", () => { renderList(); addAnnotations(); });
      byId("tree-search").addEventListener("input", renderList); window.addEventListener("resize", () => drawFallbackMap(visibleRecords()));
      stateNode.textContent = `${payload.title || config.title || "Tree survey"} · ${state.records.length} 条树木记录`;
      renderList(); initialisePotree();
    } catch (error) { console.error(error); stateNode.textContent = "无法载入树木清单"; setMessage(`请先运行导出脚本生成 data/tree_inventory.json。错误：${error.message}`); }
  }
  initialise();
})();
