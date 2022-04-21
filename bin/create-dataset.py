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


def dependency(line):
    """Find the dependency listed on a line."""
    return re.sub(prefix, "", line.rstrip()).split("@")[0]


def version(line):
    """Find the version of the dependency listed on a line."""
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


def treeify(dependencies):
    """Treeify a list of dependencies."""
    tree = {}
    ancestors = []

    for dependency in dependencies:
        # Dependency is the root of the tree.
        if dependency["level"] == 0 and tree == {}:
            tree = {
                "children": None,
                "level": 0,
                "dependency": dependency["dependency"],
                "version": dependency["version"],
            }

            ancestors.append(tree)

        # Dependency is a daughter of the last ancestor.
        elif dependency["level"] == ancestors[-1]["level"] + 1:
            if ancestors[-1]["children"] is None:
                ancestors[-1]["children"] = []

            ancestors[-1]["children"].append({
                "children": None,
                "level": dependency["level"],
                "dependency": dependency["dependency"],
                "version": dependency["version"],
            })

            ancestors.append(ancestors[-1]["children"][-1])

        # Dependency is an aunt/sister of the last ancestor.
        elif dependency["level"] <= ancestors[-1]["level"]:
            while dependency["level"] <= ancestors[-1]["level"]:
                ancestors.pop()

            if ancestors[-1]["children"] is None:
                ancestors[-1]["children"] = []

            ancestors[-1]["children"].append({
                "children": None,
                "level": dependency["level"],
                "dependency": dependency["dependency"],
                "version": dependency["version"],
            })

            ancestors.append(ancestors[-1]["children"][-1])

    return tree


def nodes(tree):
    """Produce a list of nodes from a tree of dependencies."""
    dependencies = [
        {
            "dependency": tree["dependency"],
            "level": tree["level"],
            "version": tree["version"],
            "group": tree["group"],
        },
    ]

    if tree["children"]:
        for child in tree["children"]:
            dependencies += nodes(child)

    return dependencies


def snowflake(nodes, ignore_version=True):
    """Make a unique list."""
    names = []
    filtered = []
    rejects = 0

    for node in nodes:
        if ignore_version and node["dependency"] not in names:
            names.append(node["dependency"])
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
            my_pairs.append((tree["dependency"], child["dependency"],))
            my_pairs += pairs(child)

    return my_pairs


def _set_group(tree, group):
    """Set the group for a tree of dependencies."""
    grouped = {
        "dependency": tree["dependency"],
        "level": tree["level"],
        "version": tree["version"],
        "group": group,
        "children": [],
    }

    if tree["children"]:
        for child in tree["children"]:
            grouped["children"].append(_set_group(child, group))

    return grouped


def group(tree, ignore_version=True):
    """Group by the top level dependencies."""
    group = 0
    grouped = {
        "dependency": tree["dependency"],
        "level": tree["level"],
        "version": tree["version"],
        "group": group,
        "children": [],
    }

    if tree["children"]:
        for child in tree["children"]:
            group += 1
            grouped["children"].append(_set_group(child, group))

    return grouped


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
    dependencies = []

    with open(filename, "r") as file:
        for line in file:
            dependencies.append({
                "dependency": dependency(line),
                "version": version(line),
                "level": level(line),
            })

    tree = treeify(dependencies)

    print(json.dumps({
        "nodes": snowflake(nodes(group(tree))),
        "links": links(tree),
    }, indent=2))
    # print(json.dumps(tree, indent=2))
    # print(json.dumps(group(tree), indent=2))

    return


if __name__ == "__main__":
    main()
