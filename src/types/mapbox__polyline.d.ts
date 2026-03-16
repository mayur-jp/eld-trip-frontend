declare module "@mapbox/polyline" {
  const polyline: {
    decode: (input: string, precision?: number) => number[][];
    encode: (coordinates: number[][], precision?: number) => string;
  };

  export default polyline;
}

