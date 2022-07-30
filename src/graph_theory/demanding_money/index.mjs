'use strict';

import fs from 'fs';

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
  inputString += inputStdin;
});

process.stdin.on('end', function() {
  inputString = inputString.split('\n');

  main();
});

function readLine() {
  return inputString[currentLine++];
}

/*
 * Complete the 'demandingMoney' function below.
 *
 * The function is expected to return an INTEGER_ARRAY.
 * The function accepts following parameters:
 *  1. INTEGER_ARRAY money
 *  2. 2D_INTEGER_ARRAY roads
 */

function demandingMoney(money, roads) {
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

  const unvisitedKey = (1n << BigInt(N)) - 1n;
  const result = f(unvisitedKey);
  return result;
}

function main() {
  const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

  const firstMultipleInput = readLine().replace(/\s+$/g, '').split(' ');

  const n = parseInt(firstMultipleInput[0], 10);

  const m = parseInt(firstMultipleInput[1], 10);

  const money = readLine().replace(/\s+$/g, '').split(' ').map(moneyTemp => parseInt(moneyTemp, 10));

  let roads = Array(m);

  for (let i = 0; i < m; i++) {
    roads[i] = readLine().replace(/\s+$/g, '').split(' ').map(roadsTemp => parseInt(roadsTemp, 10));
  }

  const result = demandingMoney(money, roads);

  ws.write(result.join(' ') + '\n');

  ws.end();
}

export default demandingMoney;

