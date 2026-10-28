import { steelPixels } from './steel';

self.onmessage = (e: MessageEvent<{ seed: number; w: number; h: number }>) => {
  const { seed, w, h } = e.data;
  const px = steelPixels(seed, w, h);
  (self as unknown as Worker).postMessage({ seed, w, px }, [px.buffer]);
};
