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

// Components.
import ForceDirectedGraph from './ForceDirectedGraph';

// Styling.
import './App.css';

const App = (props) => {
  return (
    <div className="App">
      <h1 id="title">
        FCC D3 Force Directed Graph
      </h1>
      <p id="description">
        Browserify Package Dependency Graph
      </p>
      <ForceDirectedGraph />
    </div>
  );
}

export default App;
