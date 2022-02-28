/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021-2022 Jeremy A Gray <gray@flyquackswim.com>.
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
