/*
 * Originally from https://wattenberger.com/blog/react-hooks
 *
 * The original author maintains all copyright and licensing rights to
 * the original.
 *
 * Modifications:
 *
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 *
 * This copyright and licensing is only for modifications to the
 * original.
 */

// Dimensions object:
// {
//   height: h,
//   width: w,
//   marginTop: t,
//   marginRight: r,
//   marginBottom: b,
//   marginLeft: l,
//   boundedHeight: max(h - t - b, 0),
//   boundedWidth: max(w - r - l, 0)
// }

// React.
import {
  useEffect,
  useRef,
  useState
} from 'react';

// Polyfillable resize observer.
import { ResizeObserver } from '@juggle/resize-observer';

const combineChartDimensions = dimensions => {
  let parsedDimensions = {
    marginTop: 40,
    marginRight: 30,
    marginBottom: 40,
    marginLeft: 75,
    ...dimensions,
  };

  return {
    ...parsedDimensions,
    boundedHeight: Math.max(parsedDimensions.height - parsedDimensions.marginTop - parsedDimensions.marginBottom, 0),
    boundedWidth: Math.max(parsedDimensions.width - parsedDimensions.marginLeft - parsedDimensions.marginRight, 0),
  };
};

export const useChartDimensions = passedSettings => {
  const ref = useRef();
  const dimensions = combineChartDimensions(passedSettings);

  const [width, changeWidth] = useState(0);
  const [height, changeHeight] = useState(0);

  useEffect(() => {
    if (dimensions.width && dimensions.height) return;

    const element = ref.current;
    const resizeObserver = new ResizeObserver(entries => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;

      const entry = entries[0];

      if (width !== entry.contentRect.width) changeWidth(entry.contentRect.width);
      if (height !== entry.contentRect.height) changeHeight(entry.contentRect.height);
    });

    resizeObserver.observe(element);

    return () => resizeObserver.unobserve(element);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  });

  return {
    'ref': ref,
    ...newSettings
  };
};

export const useChartDimensionsWithRef = (passedSettings, ref) => {
  const dimensions = combineChartDimensions(passedSettings);

  const [width, changeWidth] = useState(0);
  const [height, changeHeight] = useState(0);

  useEffect(() => {
    if (dimensions.width && dimensions.height) return;

    const element = ref.current;
    const resizeObserver = new ResizeObserver(entries => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;

      const entry = entries[0];

      if (width !== entry.contentRect.width) changeWidth(entry.contentRect.width);
      if (height !== entry.contentRect.height) changeHeight(entry.contentRect.height);
    });

    resizeObserver.observe(element);

    return () => resizeObserver.unobserve(element);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  });

  return {...newSettings};
};

export const useShareChartDimensions = (passedSettings, ref, width, setWidth, height, setHeight) => {
  const dimensions = combineChartDimensions(passedSettings);

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      return;
    }

    const element = ref.current;
    const resizeObserver = new ResizeObserver(entries => {
      if (!Array.isArray(entries)) {
        return;
      }
      if (!entries.length) {
        return;
      }

      const entry = entries[0];

      if (width !== entry.contentRect.width) {
        setWidth(entry.contentRect.width);
      }
      if (height !== entry.contentRect.height) {
        setHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(element);

    return () => resizeObserver.unobserve(element);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  });

  return { ...newSettings };
};

export default useChartDimensions;
