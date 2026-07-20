# HKUST Tree Survey

一个可部署到 GitHub Pages 的树木调查网站。网页将 PointTree 生成的树木清单与
Potree 多分辨率点云关联：可搜索树木、查看 DBH/位置/来源瓦片，并在配置完成后
在浏览器中查看三维点云。

## 在线网站

合并到 `main` 并启用 **Settings → Pages → GitHub Actions** 后，网站地址为：

```text
https://suzeln.github.io/treesurvey/
```

## 仓库内容

- `web/`：GitHub Pages 静态站点，内含 167 条 HKUST 树木观测目录；
- `scripts/export_tree_web_data.py`：从 PointTree 清单导出可公开的网页 JSON；
- `scripts/build_tree_viewer.py`：调用 PotreeConverter 并配置点云入口；
- `docs/github_pages_tree_viewer.md`：数据发布、CORS 与部署说明。

原始 LAS/LAZ、ROS bag 和大规模 Potree 输出不提交到 Git。小型演示瓦片可显式
添加；生产点云应托管在 MinIO、S3 或 CDN，并在 `web/app-config.js` 指向其
`metadata.json`。
