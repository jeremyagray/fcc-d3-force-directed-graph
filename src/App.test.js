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

import {
  render,
  screen,
} from '@testing-library/react';

import App from './App';

test('renders the app', async () => {
  const props = {};

  render(<App {...props} />);
  
  const ele = await screen.findByText(/fCC D3 Force Directed Graph: React Demo/i);
  expect(ele).toBeInTheDocument();
});
