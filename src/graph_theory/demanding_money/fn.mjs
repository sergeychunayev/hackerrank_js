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
    let mask = 0;
    for (const v of items) {
      mask |= 1 << v;
    }
    return mask;
  };

  const cache = new Map();

  const f = (unvisited) => {
    if (unvisited.size === 0) {
      return [0, 1];
    }
    const key = getKey(unvisited);
    let result = cache.get(key);
    if (!result) {
      // const u = unvisited.values().next().value;
      const u = Array.from(unvisited).reduce((r, v) => Math.min(r, v), Infinity);
      unvisited.delete(u);
      const adj = g[u] || [];
      const nextUnvisited = [];
      for (const v of adj) {
        if (unvisited.has(v)) {
          unvisited.delete(v);
          nextUnvisited.push(v);
        }
      }
      const [currentSum, count] = f(unvisited);
      const sum = money[u] + currentSum;

      for (const v of nextUnvisited) {
        unvisited.add(v);
      }
      const [alternativeSum, aleternativeCount] = f(unvisited);

      if (sum > alternativeSum) {
        result = [sum, count];
      } else if (sum === alternativeSum) {
        result = [sum, count + aleternativeCount];
      } else {
        result = [alternativeSum, aleternativeCount];
      }

      cache.set(key, result);
      unvisited.add(u);
    }
    return result;
  };
  const unvisited = new Set();
  for (let i = 0; i < N; i++) {
    unvisited.add(i);
  }
  const result = f(unvisited);
  return result;
};