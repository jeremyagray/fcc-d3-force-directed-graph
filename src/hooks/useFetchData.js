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
import {
  useEffect,
  useState
} from 'react';

// Other stuff.
import axios from 'axios';

export const useFetchData = (url, dataDefault = null, config = {}) => {
  // Data state.
  const [data, setData] = useState(dataDefault);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchData = async () => {
      try {
        let response = {};

        if (! url) {
          response.data = dataDefault;
        } else {
          response = await axios.get(url, config);
        }

        if (isMounted) {
          setData(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        /* istanbul ignore else */
        if (isMounted) {
          setError(error);
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, isLoading, error };
};

export default useFetchData;
