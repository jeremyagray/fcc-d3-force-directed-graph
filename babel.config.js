/*
 *
 * fcc-d3-force-directed-graph, fCC D3 Force Directed Graph Project
 *
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Copyright 2021-2022 Jeremy A Gray <gray@flyquackswim.com>.
 *
 * All rights reserved.
 *
 */

module.exports = {
  'presets': [
    [
      '@babel/preset-env',
      {
        'targets': {
          'node': 'current',
        },
      },
    ],
    [
      '@babel/preset-react',
      {'runtime': 'automatic'}
    ]
  ]
};
