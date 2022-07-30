'use strict';

export default (money, roads) => {
  const N = money.length;
  const connect = (g, u, v) => {
    let adj = g[u];
    if (!adj) {
      adj = [];
      g[u] = adj;
    }
    adj.push(v);
  };

  const g = new Array(N);
  for (const [u, v] of roads) {
    connect(g, u - 1, v - 1);
    connect(g, v - 1, u - 1);
  }
  // console.log(g);

  const getKey = items => {
    let key = 0n;
    for (const v of items) {
      key |= 1n << BigInt(v);
    }
    return key;
  };

  const cache = new Map();

  const f = unvisitedBits => {
    if (unvisitedBits === 0n) {
      return [0, 1];
    }
    let result = cache.get(unvisitedBits);
    if (!result) {
      let u = 0n;
      for (; u < BigInt(N) && (unvisitedBits & 1n << u) === 0n; u++);
      unvisitedBits ^= 1n << u;
      const adj = g[u] || [];
      let nextUnvisited = 0n;
      for (const v of adj) {
        if ((unvisitedBits & 1n << BigInt(v)) > 0n) {
          unvisitedBits ^= 1n << BigInt(v)
          nextUnvisited |= 1n << BigInt(v);
        }
      }
      const [currentSum, count] = f(unvisitedBits);
      const sum = money[u] + currentSum;

      for (let i = 0n; 1n << i <= nextUnvisited; i++) {
        if ((nextUnvisited & 1n << i) > 0n) {
          unvisitedBits |= 1n << i;
        }
      }
      const [alternativeSum, alternativeCount] = f(unvisitedBits);

      if (sum > alternativeSum) {
        result = [sum, count];
      } else if (sum === alternativeSum) {
        result = [sum, count + alternativeCount];
      } else {
        result = [alternativeSum, alternativeCount];
      }

      unvisitedBits |= 1n << u;
      cache.set(unvisitedBits, result);
    }
    return result;
  };
  const unvisited = new Set();
  for (let i = 0; i < N; i++) {
    unvisited.add(i);
  }
  const unvisitedKey = getKey(unvisited);
  const result = f(unvisitedKey);
  return result;
};