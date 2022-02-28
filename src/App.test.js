/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

import {
  render,
  screen,
} from '@testing-library/react';

// import {
//   ShallowRenderer
// } from 'react-test-renderer/shallow';

import App from './App';

test('renders the app', async () => {
  const props = {};

  render(<App {...props} />);
  
  const ele = await screen.findByText(/This is React from Scratch/i);
  expect(ele).toBeInTheDocument();
});
