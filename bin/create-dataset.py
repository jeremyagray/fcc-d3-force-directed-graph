#!/usr/bin/env python
#
# ******************************************************************************
#
# fcc-d3-force-directed-graph, fCC D3 Force Directed Graph Project
#
# SPDX-License-Identifier: BSD-3-Clause
#
# Copyright 2021-2022 Jeremy A Gray <gray@flyquackswim.com>.
#
# All rights reserved.
#
# ******************************************************************************

# import json
import re
import sys

prefix = r"[ ├└─│]+"


def level(line):
    """Find the nesting level of a line."""
    length = len(line.rstrip()) - len(re.sub(prefix, "", line.rstrip()))

    return (length // 3) - 1


def package(line):
    """Find the package listed on a line."""
    return re.sub(prefix, "", line.rstrip()).split("@")[0]


def version(line):
    """Find the version of the package listed on a line."""
    return re.sub(prefix, "", line.rstrip()).split("@")[1]


def treeify(packages):
    """Treeify a list of packages."""
    tree = {}
    current = tree

    for package in packages:
        # Package is the root of the tree.
        if package["level"] == 0 and tree == {}:
            tree = {
                "parent": None,
                "children": None,
                "level": 0,
                "package": package["package"],
                "version": package["version"],
            }

            current = tree

        # Package is a sibling of the current package.
        elif package["level"] == current["level"]:
            if current["level"] == 0:
                parent = current
            else:
                parent = current["parent"]

            if parent["children"] is None:
                parent["children"] = []

            parent["children"].append({
                "parent": parent if package["level"] > 0 else None,
                "children": None,
                "level": package["level"],
                "package": package["package"],
                "version": package["version"],
            })

            current = parent["children"][-1]

        # Package is a child of the current package.
        elif package["level"] == current["level"] + 1:
            if current["children"] is None:
                current["children"] = []

            current["children"].append({
                "parent": current,
                "children": None,
                "level": package["level"],
                "package": package["package"],
                "version": package["version"],
            })

            current = current["children"][-1]

        # Package is an ancestor of the current package.
        elif package["level"] < current["level"]:
            while package["level"] <= current["level"]:
                current = current["parent"]

            if current["children"] is None:
                current["children"] = []

            current["children"].append({
                "parent": current,
                "children": None,
                "level": package["level"],
                "package": package["package"],
                "version": package["version"],
            })

            current = current["children"][-1]

    return tree


def main():
    """Convert a list of package dependencies to a tree."""
    filename = sys.argv[1]
    packages = []

    with open(filename, "r") as file:
        for line in file:
            packages.append({
                "package": package(line),
                "version": version(line),
                "level": level(line),
            })

    # print(json.dumps(treeify(packages), indent=2))
    # print(treeify(packages))
    tree = treeify(packages)
    for child in tree["children"]:
        print(f"package: {child['package']} version: {child['version']}")

    return


if __name__ == "__main__":
    main()
