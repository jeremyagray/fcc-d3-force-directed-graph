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

// React.
import React from 'react';

export const LoadingError = (props) => {
  if (props.errors.length) {
    return (
      <React.Fragment key="loadingErrors">
        {props.errors.map((error) => {
          return (
            <p className="loadingError" key={error.name}>
              Error loading data:  {error.message}
            </p>
          );
        })}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment key="noError">
    </React.Fragment>
  );
};

export default LoadingError;
