# Tree Digital Twin Frontend Architecture

Date: 2026-07-23

## Purpose

The frontend provides a stable information architecture for the HKUST tree
survey database, TreeX outputs, single-tree structural products, multimodal
inference, and forest-scale 3D Gaussian Splatting.

The design borrows three principles from 3D Forest:

1. keep scientific visualization as the dominant workspace;
2. separate data objects, viewport controls, and property inspection;
3. expose processing state and parameters instead of hiding them behind a
   presentation-only interface.

It does not copy 3D Forest source code, images, icons, text, or branding.

## Selected implementation

- React and TypeScript for modular components and typed data contracts;
- Vite for a small static production build;
- Hash Router for GitHub Pages compatibility;
- CSS design tokens and component classes for a project-owned visual system;
- Lucide icons rather than copied application artwork;
- static provider now, API provider later;
- independent viewer registry for Potree, QSM, Tree Graph, 3DGS, RGB, and UAV.

The existing build-free Potree site remains in `web/`. New source belongs in
`frontend/`; production output belongs in `frontend/dist/`.

## Page hierarchy

```text
Overview
├── metrics
├── data product cards
└── session state

Forest Explorer
├── data explorer
├── central viewer workbench
└── tree inspector

Tree Catalog
└── Tree Detail
    ├── Point Cloud
    ├── QSM
    ├── Tree Graph
    ├── 3DGS
    ├── RGB
    └── UAV

Survey Sessions
Digital Twin
Analysis
Methods
```

## Data boundary

Pages consume the following frontend types:

- `SurveySession`;
- `TreeRecord`;
- `TreeAsset`;
- `Prediction`;
- `ViewerKind`.

`DataProvider` is the only catalog boundary:

```typescript
interface DataProvider {
  listSessions(): Promise<SurveySession[]>;
  listTrees(sessionId?: string): Promise<TreeRecord[]>;
  getTree(id: string): Promise<TreeRecord | undefined>;
}
```

Static fixtures are based on verified project counts and current
`tile_x002_y003` inventory rows. Species, health, QSM, graph, imagery, and 3DGS
values are explicitly placeholders.

## Viewer boundary

Every visual product is registered in `src/viewers/registry.tsx`. A viewer
receives the selected tree and matching asset. It owns its rendering engine and
cleanup.

The Potree adapter will later:

1. load the self-hosted Potree runtime;
2. create and dispose the viewer;
3. load the asset `metadata.json`;
4. apply the safe classification palette;
5. keep EDL disabled unless a browser capability check passes;
6. focus the camera when the selected tree changes.

QSM, Graph, and 3DGS integrations can be implemented without modifying pages or
navigation.

## Visual state rules

- `Available`: a real derived asset can be opened.
- `Processing`: a reproducible pipeline exists but the product is incomplete.
- `Placeholder`: the slot and expected format exist, but there is no asset.
- `Review required`: a result is not field verified.

Coordinates, model versions, asset formats, and processing identifiers use a
monospace font. The central viewer uses a charcoal background; catalog and
inspector panels use neutral research-workstation colors.

## Deployment migration

The safe migration keeps two applications:

```text
/                 new React research platform
/legacy/          current working Potree viewer
```

The deployment workflow builds `frontend/`, copies `frontend/dist/` into a
staging directory, then copies the existing `web/` directory into
`staging/legacy/`. This prevents the new placeholder framework from removing the
currently working point-cloud page.

Only switch GitHub Pages after:

- `npm run typecheck` succeeds;
- `npm run build` succeeds;
- overview and explorer screenshots are inspected;
- the legacy point cloud still loads from `/legacy/`;
- Range requests for legacy Potree data return HTTP 206.

## Next integrations

1. complete `PotreeViewerAdapter` using the existing viewer lifecycle;
2. replace the static provider with `/api/v1`;
3. add QSM GLB/cylinder rendering;
4. select a Tree Graph renderer after confirming whether graphs are 2D or 3D;
5. select a 3DGS web renderer after the first exported model is available;
6. map RGB and UAV assets through `TreeAsset`;
7. add browser tests for route rendering and selected-tree synchronization.
