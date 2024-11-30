const http = require('http');
const pug = require('pug');

const PORT = 11111;
const X_API_KEY = process.env.X_API_KEY;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

if (!X_API_KEY) {
  throw new Error("Missing mandatory X_API_KEY environment variable!");
}

if (!AUTH_TOKEN) {
  throw new Error("Missing mandatory AUTH_TOKEN environment variable!");
}

const HEVY_HEADERS = {
  'x-api-key': X_API_KEY,
  'auth-token': AUTH_TOKEN
};

const EXERCISE_ID_TO_NAME = new Map([
  ['C6272009', 'deadlift'],
  ['79D0BB3A', 'benchPress'],
  ['D04AC939', 'squat']
]);

const excerciseSetCompareFn = (v1, v2) => { 
  if (v1.weight == v2.weight) return v2.reps - v1.reps;
  return v2.weight - v1.weight
};

const getResults = async () => {
  const exercises = await Promise.all([
      ...EXERCISE_ID_TO_NAME.entries()
    ].map(async ([id, name]) => {
      const url =`https://api.hevyapp.com/user_exercise_sets/${id}/2024-09-06T21:44:53+02:00`;
      const response = await fetch(url, { headers: HEVY_HEADERS });
      console.debug(`Request for id=${id}: status=${response.status}`);
      
      const body = await response.json();      
      const best = body
        .map(excerciseSet => ({ 
          weight: excerciseSet.weight_kg, 
          reps: excerciseSet.reps,
          unit: 'kg'
        }))
        .sort(excerciseSetCompareFn)[0];

      const result = {};
      
      if (best) {
        result[name] = best;
      }
    
      return result;
    }
  ));
  const results = Object.assign({}, ...exercises);
  return { results };
}

const renderFn = pug.compileFile('templates/widget.pug');

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET') {
    const results = await getResults();
    console.debug(JSON.stringify(results, undefined, 2));
    
    res.writeHead(200, { 'content-type': 'image/svg+xml' })
    res.end(renderFn(results))
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
