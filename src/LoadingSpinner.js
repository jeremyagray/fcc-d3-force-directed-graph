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

// React Bootstrap.
import Spinner from 'react-bootstrap/Spinner';

export const LoadingSpinner = (props) => {
  return (
    <div
      className="d-flex mx-auto"
    >
      <Spinner
        animation="border"
        role="status"
        className="mx-auto my-auto"
      >
        <span className="visually-hidden">
          Loading data, please be patient.
        </span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;
