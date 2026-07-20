# HKUST Tree Survey Viewer

This directory is a static Potree viewer designed for GitHub Pages. It joins a
PointTree inventory with a multi-resolution Potree point cloud in one browser
page: select a tree from the catalog, inspect DBH/provenance, and view its
position in the cloud.

## Prepare the current inventory

From the repository root:

```bash
python scripts/export_tree_web_data.py \
  data/my_data/big/processed_2026_05_06_13_16_34/inventory/tree_inventory_summary.csv \
  --session HKUST-S20-2026-05-06-13-16-34
```

This makes the catalog/map usable immediately. It does not publish raw point
clouds or absolute local paths.

## Add a Potree cloud

First create a *derived*, de-identified/publishable cloud. Do not use the raw
multi-GB survey file in Git. With PotreeConverter available locally:

```bash
python scripts/build_tree_viewer.py \
  data/my_data/big/processed_2026_05_06_13_16_34/inventory/tree_inventory_summary.csv \
  --session HKUST-S20-2026-05-06-13-16-34 \
  --pointcloud /path/to/publishable_cloud.laz \
  --cloud-id hkust_s20_13_16_34
```

The converter command is equivalent to the official Potree workflow:
`PotreeConverter input.laz -o web/pointclouds/<cloud-id>`. The viewer then loads
`metadata.json` through `web/app-config.js`.

When the cloud is a single tile, add `--source-tile tile_x002_y003` so only its
tree observations are annotated in the 3D scene.

For a large cloud, host the converted directory in an S3/MinIO/CDN bucket and
pass `--external-metadata-url https://…/metadata.json`; ensure CORS allows the
GitHub Pages origin. GitHub Pages has a 1 GB published-site limit, so it should
host the UI and lightweight inventory only, not the current raw surveys.

## GitHub Pages

The workflow in `.github/workflows/deploy-tree-viewer.yml` deploys this directory
after a push that changes `web/**` or manually from the Actions tab. In the
repository settings, choose **Settings → Pages → Source: GitHub Actions**. A
fork of the upstream PointTree project should disable its unrelated documentation
Pages deployment, because one repository has one active Pages site.
