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

import LoadingError from './LoadingError';

test('renders with no errors', () => {
  let props = {
    'errors': [
    ]
  };

  render(<LoadingError {...props} />);
  
  expect(() => { screen.getByText('Error loading'); }).toThrow();
});

test('renders with one error', () => {
  let props = {
    'errors': [
      {
        'name': 'error',
        'message': 'this is an error'
      }
    ]
  };

  render(<LoadingError {...props} />);
  
  const renderedErrors = screen.getAllByText(/\s*Error loading data:.*/i);

  expect(renderedErrors.length).toBe(props.errors.length);

  for (let i = 0; i < renderedErrors.length; i++) {
    expect(renderedErrors[i]).toBeInTheDocument();
  }
});

test('renders with multiple errors', () => {
  let props = {
    'errors': [
      {
        'name': 'error',
        'message': 'this is an error'
      },
      {
        'name': 'warning',
        'message': 'this is only a warning'
      }
    ]
  };

  render(<LoadingError {...props} />);
  
  const renderedErrors = screen.getAllByText(/\s*Error loading data:.*/i);

  expect(renderedErrors.length).toBe(props.errors.length);

  for (let i = 0; i < renderedErrors.length; i++) {
    expect(renderedErrors[i]).toBeInTheDocument();
  }
});
