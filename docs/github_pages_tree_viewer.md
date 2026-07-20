# GitHub Pages 树木点云查看网站

日期：2026-07-18

## 已实现内容

`web/` 是一个不依赖 Python 后端的静态网站，可直接由 GitHub Pages
发布。它包含：

- Potree WebGL 三维视窗；
- 树木搜索、测绘批次筛选、DBH/位置/来源瓦片信息面板；
- 当三维点云尚未配置时仍可工作的树木二维清单地图；
- `data/tree_inventory.json` 中的真实 HKUST S20 13:16:34 基线清单（167
  条树木观测）；
- GitHub Actions Pages 发布工作流。

网页与数据的关系如下：

```text
PointTree inventory CSV ── export_tree_web_data.py ──> web/data/tree_inventory.json
                                                         │
PotreeConverter(LAS/LAZ) ─────────────────────────> metadata.json + octree files
                                                         │
GitHub Pages ── index.html/app.js ──> 树木目录 + Potree 点云 + 树木注释
```

## 为什么不直接上传原始点云

GitHub Pages 只托管静态文件，发布站点上限为 1 GB；普通 Git 推送会拒绝大于
100 MiB 的单个文件。当前 LAS/LAZ 和 ROS bag 均明显超过这个范围。因此，仓库
只保存网页、轻量级树木目录和（可选）小型演示瓦片；原始测绘数据保持在本地。

Potree 适合这个场景：它将 LAS/LAZ 转为带层级细节的浏览器流式格式，再由网页
按视角按需加载。官方示例也使用 `metadata.json` 作为加载入口。

## 本地准备

先更新网站中的树木目录：

```bash
cd /home/su/treesurvey/pointtree
conda run -n pointtree python scripts/export_tree_web_data.py \
  data/my_data/big/processed_2026_05_06_13_16_34/inventory/tree_inventory_summary.csv \
  --session HKUST-S20-2026-05-06-13-16-34
```

此时网站已经能展示树木清单和二维位置。要加载三维点云，需要使用
`PotreeConverter` 转换**可公开发布的派生 LAZ/LAS**。建议先使用 42 MiB 的
`tile_x002_y003_segmented.laz` 验证效果，而不是立即转换整幅数据：

```bash
conda run -n pointtree python scripts/build_tree_viewer.py \
  data/my_data/big/processed_2026_05_06_13_16_34/inventory/tree_inventory_summary.csv \
  --session HKUST-S20-2026-05-06-13-16-34 \
  --pointcloud data/my_data/big/processed_2026_05_06_13_16_34/seg_result_tiles/tile_x002_y003_segmented.laz \
  --cloud-id hkust_s20_tile_x002_y003 \
  --source-tile tile_x002_y003
```

脚本会：导出目录、调用 `PotreeConverter`、并把 `web/app-config.js` 的
`pointcloudUrl` 设置为生成的 `metadata.json`。目前开发机未发现
`PotreeConverter`，因此这一步需要先安装官方二进制或在另一台处理机器完成。

如果转换结果超过 1 GB，应上传整个 Potree 输出目录到 MinIO/S3/CDN，并运行：

```bash
python scripts/build_tree_viewer.py ... \
  --external-metadata-url https://your-storage.example/hkust/metadata.json
```

对象存储必须为 GitHub Pages 域名开启 CORS；不要只上传 `metadata.json`，它引用的
octree 数据文件也必须位于同一可访问目录。

## 发布到 github.io

1. 将此项目推送到你自己的 GitHub 仓库；不要把原始 LAS/LAZ/bag 提交到 Git。
2. 在仓库 **Settings → Pages** 中选择 **GitHub Actions** 作为发布源。
3. 推送 `web/` 或在 Actions 页面手动运行 **Deploy tree viewer**。
4. 部署完成后，GitHub 会在 Actions 的 deployment 输出中显示页面 URL，通常为
   `https://<account>.github.io/<repository>/`。

这个仓库已有上游文档 Pages 工作流。GitHub 仓库一次只应有一个实际 Pages 发布物：
在个人 fork 中，该上游工作流因仓库名条件不会执行；若你修改该条件，请保留树木
查看网站工作流或把网站并入文档构建，而不要同时部署两个独立 artifact。

## 验证状态

- `web/data/tree_inventory.json` 已由真实库存 CSV 导出，并按当前三维瓦片筛选为
  29 条匹配树木观测；
- 当前 GitHub Pages 演示配置使用 `tile_x002_y003`：约 817 万 Potree 点，Brotli
  输出约 32 MiB；
- `scripts/build_tree_viewer.py --dry-run` 已生成预期 PotreeConverter 命令；
- 本机未安装 `PotreeConverter`，所以尚未产生/发布三维 `metadata.json`；
- GitHub Pages 发布需要仓库所有者在 GitHub 设置中启用，当前未对外推送或开启。

参考： [Potree](https://github.com/potree/potree)、
[PotreeConverter](https://github.com/potree/PotreeConverter)、
[GitHub Pages 部署工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)、
[GitHub Pages 限制](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)。
