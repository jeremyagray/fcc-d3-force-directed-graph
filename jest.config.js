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
  'collectCoverage': true,
  'coverageDirectory': 'coverage',
  'moduleNameMapper': {
    '\\.css$': '<rootDir>/__mocks__/cssMock.js'
  },
  'setupFilesAfterEnv': [
    '<rootDir>/src/setupTests.js'
  ],
  'testEnvironment': 'jsdom',
  'transformIgnorePatterns': [
    '/node_modules/(?!(d3-?|internmap|delaunator|robust-predicates))'
  ]
};
