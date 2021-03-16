# SQLiteConnBenchmark
A series of tests were run to measure the relative performance of SQLite in difference num of connection and rows data. <br>
All phase in run with WAL mode config. Relation auto clear before a session insert excute. <br>
With this benchmar, we consider time, cpu and memory ussaged for:
- 100% SELECT
- 100% INSERT
- 50% SELECT - 50% INSERT (MIX)
- 95% SELECT - 5% INSERT (MIX)
You also special num connection and ratio of OPERATOR in package.json.
<br>

# Prepare data
In this test, we need two type of data.<br>
- First, the text we will insert to relation: node data/gentext.js [num-of-rows] . Data will write in *.txt file<br>
- Second, the ranges we use to compare records and select: node data/genIRange.js . this will create one milion ranges.
<br>

# Run benchmark
Benchmark run on two phase: <br>
- First, It run in no-index colums, in the end it may take amount of times to SELECT. <br>
- Second, It clear Relation and run in index mode, as result it may insert slower and select faster.<br>
run benchmark by: npm run benchmark
<br>

# Quick benchmark
Flowing there steps:
- npm install
- node data/gentext.js 1000
- node data/gentext.js 10000
- node data/gentext.js 100000
- node data/gentext.js 1000000
- npm run benchmark
