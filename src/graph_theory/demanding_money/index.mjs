'use strict';

import fs from 'fs';
import fn from './fn.mjs';

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
  return fn(money, roads);
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
