#!/usr/bin/env python3
"""Create a browser-safe tree-segmentation LAZ derivative for Potree."""

from __future__ import annotations

import argparse
from pathlib import Path

import laspy
import numpy as np


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--instance-dimension", default="instance_id")
    args = parser.parse_args()
    cloud = laspy.read(args.input)
    if args.instance_dimension not in cloud.point_format.extra_dimension_names:
        parser.error(f"missing extra dimension: {args.instance_dimension}")
    instances = np.asarray(cloud[args.instance_dimension])
    if instances.size and (instances.max() > 254 or instances.min() < -1):
        parser.error("instance IDs must be in the range -1..254")
    cloud.classification = np.where(instances >= 0, instances + 1, 0).astype(np.uint8)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    cloud.write(args.output)
    print({"output": str(args.output), "point_count": len(cloud.points)})


if __name__ == "__main__":
    main()
