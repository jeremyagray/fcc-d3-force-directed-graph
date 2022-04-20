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

import json
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


def descendants(node):
    """Count the descendants of a node."""
    num = 0

    if node["children"]:
        for child in node["children"]:
            # Add the current child.
            num += 1
            # Add the current child's descendants.
            num += descendants(child)

    return num


def treeify(packages):
    """Treeify a list of packages."""
    tree = {}
    ancestors = []

    for package in packages:
        # Package is the root of the tree.
        if package["level"] == 0 and tree == {}:
            tree = {
                "children": None,
                "level": 0,
                "package": package["package"],
                "version": package["version"],
            }

            ancestors.append(tree)

        # Package is a daughter of the last ancestor.
        elif package["level"] == ancestors[-1]["level"] + 1:
            if ancestors[-1]["children"] is None:
                ancestors[-1]["children"] = []

            ancestors[-1]["children"].append({
                "children": None,
                "level": package["level"],
                "package": package["package"],
                "version": package["version"],
            })

            ancestors.append(ancestors[-1]["children"][-1])

        # Package is an aunt/sister of the last ancestor.
        elif package["level"] <= ancestors[-1]["level"]:
            while package["level"] <= ancestors[-1]["level"]:
                ancestors.pop()

            if ancestors[-1]["children"] is None:
                ancestors[-1]["children"] = []

            ancestors[-1]["children"].append({
                "children": None,
                "level": package["level"],
                "package": package["package"],
                "version": package["version"],
            })

            ancestors.append(ancestors[-1]["children"][-1])

    return tree


def nodes(tree):
    """Produce a list of nodes from a tree of dependencies."""
    packages = [
        {
            "package": tree["package"],
            "level": tree["level"],
            "version": tree["version"],
        },
    ]

    if tree["children"]:
        for child in tree["children"]:
            packages += nodes(child)

    return packages


def snowflake(nodes, ignore_version=True):
    """Make a unique list."""
    names = []
    filtered = []
    rejects = 0

    for node in nodes:
        if ignore_version and node["package"] not in names:
            names.append(node["package"])
            filtered.append(node)
        elif not ignore_version and node not in filtered:
            filtered.append(node)
        else:
            rejects += 1

    assert len(nodes) == len(filtered) + rejects

    return filtered


def pairs(tree, ignore_version=True):
    """Produce a list of pairs from a tree of dependencies."""
    my_pairs = []

    if tree["children"]:
        for child in tree["children"]:
            my_pairs.append((tree["package"], child["package"],))
            my_pairs += pairs(child)

    return my_pairs


def links(tree, ignore_version=True):
    """Produce a list of links from a tree of dependencies."""
    all_pairs = pairs(tree)
    accepted_pairs = []
    rejected_pairs = []
    counts = {}

    for pair in all_pairs:
        # print(f"pair: {pair}")
        if pair in accepted_pairs:
            rejected_pairs.append(pair)
            counts[pair] += 1
        elif (pair[1], pair[0],) in accepted_pairs:
            rejected_pairs.append(pair)
            counts[(pair[1], pair[0],)] += 1
        else:
            accepted_pairs.append(pair)
            counts[pair] = 1

    assert len(all_pairs) == len(accepted_pairs) + len(rejected_pairs)

    my_links = []
    for (k, v) in counts.items():
        my_links.append({
            "source": k[0],
            "target": k[1],
            "links": v,
        })

    return my_links


def main():
    """Convert npm-ls output to JSON force-directed graph data."""
    filename = sys.argv[1]
    packages = []

    with open(filename, "r") as file:
        for line in file:
            packages.append({
                "package": package(line),
                "version": version(line),
                "level": level(line),
            })

    tree = treeify(packages)

    print(json.dumps({
        "nodes": nodes(tree),
        "links": links(tree),
    }, indent=2))

    return


if __name__ == "__main__":
    main()
