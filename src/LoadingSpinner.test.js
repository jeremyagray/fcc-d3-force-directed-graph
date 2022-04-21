/**
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
  screen
} from '@testing-library/react';

import LoadingSpinner from './LoadingSpinner';

test('renders the spinner', () => {
  let props = {};

  render(<LoadingSpinner {...props} />);
  
  expect(screen.getByText('Loading data, please be patient.')).toBeInTheDocument();
});
