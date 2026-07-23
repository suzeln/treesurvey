/* global Potree, TREE_SURVEY_CONFIG, $ */
(() => {
  "use strict";

  const config = window.TREE_SURVEY_CONFIG || {};
  const status = document.getElementById("embed-status");
  const statusText = document.getElementById("embed-status-text");
  const query = new URLSearchParams(window.location.search);
  const showSidebar = query.get("sidebar") === "1";

  function setStatus(message, state) {
    statusText.textContent = message;
    status.classList.remove("loaded", "error");
    if (state) status.classList.add(state);
  }

  function hslToRgb(hue, saturation = 0.78, lightness = 0.55) {
    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const sector = hue / 60;
    const x = chroma * (1 - Math.abs((sector % 2) - 1));
    const values =
      sector < 1 ? [chroma, x, 0]
        : sector < 2 ? [x, chroma, 0]
          : sector < 3 ? [0, chroma, x]
            : sector < 4 ? [0, x, chroma]
              : sector < 5 ? [x, 0, chroma]
                : [chroma, 0, x];
    const match = lightness - chroma / 2;
    return [values[0] + match, values[1] + match, values[2] + match, 1];
  }

  function treeClassifications() {
    const classifications = {
      0: { visible: false, name: "Background", color: [0.2, 0.2, 0.2, 0] },
      DEFAULT: { visible: true, name: "Tree", color: [0.2, 0.75, 0.55, 1] },
    };
    for (let classId = 1; classId <= 255; classId += 1) {
      classifications[classId] = {
        visible: true,
        name: `Tree instance ${classId}`,
        color: hslToRgb((classId * 137.508) % 360),
      };
    }
    return classifications;
  }

  if (!window.Potree) {
    setStatus("Potree library failed to load", "error");
    return;
  }
  if (!config.pointcloudUrl) {
    setStatus("No point-cloud dataset configured", "error");
    return;
  }

  try {
    const viewer = new Potree.Viewer(document.getElementById("potree_render_area"));
    window.viewer = viewer;
    viewer.setEDLEnabled(false);
    viewer.setFOV(60);
    viewer.setPointBudget(1_500_000);
    viewer.setBackground("gradient");

    if (showSidebar && typeof viewer.loadGUI === "function") {
      viewer.loadGUI(() => {
        viewer.setLanguage("en");
        $("#menu_appearance").next().show();
        $("#menu_tools").next().show();
        $("#menu_clipping").next().show();
        viewer.toggleSidebar();
      });
    }

    Potree.loadPointCloud(
      config.pointcloudUrl,
      config.pointcloudName || "HKUST tree point cloud",
      (event) => {
        const pointcloud = event.pointcloud;
        pointcloud.material.activeAttributeName =
          config.treeInstanceAttribute || "classification";
        pointcloud.material.pointSizeType = Potree.PointSizeType.FIXED;
        pointcloud.material.shape = Potree.PointShape.CIRCLE;
        pointcloud.material.size = 3;
        viewer.setClassifications(treeClassifications());
        viewer.scene.addPointCloud(pointcloud);
        viewer.fitToScreen();
        setStatus("8.18 M points · 30 tree instances", "loaded");
      },
    );
  } catch (error) {
    console.error(error);
    setStatus(`Viewer error: ${error.message}`, "error");
  }
})();
