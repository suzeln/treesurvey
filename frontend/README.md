# HKUST Tree Digital Twin Frontend

This directory contains the modular research frontend inspired by the
viewport-first workflow of 3D Forest. It does not copy 3D Forest code, assets, or
branding.

## Local development

The project-specific Node environment is stored outside the repository:

```bash
conda run -p /home/su/treesurvey/.tools/treesurvey-web npm install
conda run -p /home/su/treesurvey/.tools/treesurvey-web npm run dev
```

Open the URL printed by Vite. Production verification:

```bash
conda run -p /home/su/treesurvey/.tools/treesurvey-web npm run typecheck
conda run -p /home/su/treesurvey/.tools/treesurvey-web npm run build
```

## Routes

- `#/` — platform overview;
- `#/explorer` — viewport-first forest workspace;
- `#/trees` and `#/trees/:id` — inventory and single-tree workspace;
- `#/surveys` — survey sessions and aerial imagery;
- `#/digital-twin` — ROS bag to 3DGS product page;
- `#/analysis` — species, health, and structure evidence;
- `#/methods` — architecture and provenance.

Hash routing is intentional so every route works on GitHub Pages.

## Integration boundaries

- `src/data/StaticDataProvider.ts` supplies the current framework data.
- `src/data/ApiDataProvider.ts` reserves the future `/api/v1` integration.
- `src/viewers/registry.tsx` maps product types to isolated viewer adapters.
- `src/viewers/PotreeViewerAdapter.tsx` is the lifecycle boundary for the
  existing Potree viewer.
- QSM, Tree Graph, 3DGS, RGB, and UAV adapters currently use the shared
  placeholder component.

Missing data must remain visibly marked as `Placeholder`, `Processing`, or
`Review required`; do not represent simulated values as field-verified results.
