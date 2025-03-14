import React, { useCallback } from 'react';
import * as d3 from 'd3';

type InitFunction = (
  d3Instance: typeof d3,
  svg: SVGElement | null,
) => Promise<SVGElement>;

export function useD3(): [
  React.RefObject<SVGElement | null>,
  (i: InitFunction) => Promise<void>,
] {
  const ref = React.useRef<SVGElement>(null);

  const updateD3 = useCallback(async (init: InitFunction) => {
    await init(d3, ref.current);
  }, []);

  return [ref, updateD3];
}
