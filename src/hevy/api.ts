import {
  BestSet,
  ExerciseName,
  UserBestResults,
  UserWorkouts,
  WeightWithUnit,
} from "./model.ts";

const X_API_KEY = Deno.env.get("X_API_KEY");
const AUTH_TOKEN = Deno.env.get("AUTH_TOKEN");

if (!X_API_KEY) {
  throw new Error("Missing mandatory X_API_KEY environment variable!");
} else if (!AUTH_TOKEN) {
  throw new Error("Missing mandatory AUTH_TOKEN environment variable!");
}

const HEVY_HEADERS = {
  "x-api-key": X_API_KEY,
  "auth-token": AUTH_TOKEN,
};

const EXERCISE_ID_TO_NAME = new Map<string, ExerciseName>([
  ["C6272009", "deadlift"],
  ["79D0BB3A", "benchPress"],
  ["D04AC939", "squat"],
  ["D20D7BBE", "deadlift"], // sumo deadlift
]);

const BASE_URL = `https://api.hevyapp.com/user_workouts_paged`;

const bestResultCompareFn = (v1: BestSet, v2: BestSet) => {
  if (v1.weight == v2.weight) return v2.reps - v1.reps;
  return v2.weight - v1.weight;
};

export const getResultsByUsername = async (
  username: string,
  pages: number = 10,
): Promise<UserBestResults> => {
  const userWorkouts = await fetchUserWorkouts(username, pages);

  const filteredExercises = userWorkouts
    .workouts
    .flatMap((workout) => workout.exercises)
    .filter((exercise) =>
      EXERCISE_ID_TO_NAME.has(exercise.exercise_template_id)
    );

  const nameToExercises = Object.groupBy(
    filteredExercises,
    (e) => EXERCISE_ID_TO_NAME.get(e.exercise_template_id)!,
  );

  const bestResults: [ExerciseName, BestSet][] = Object.entries(nameToExercises)
    .map(([name, exercises]) => {
      const best = exercises!
        .flatMap((exercise) => exercise.sets)
        .map((set) =>
          <BestSet> {
            reps: set.reps,
            weight: set.weight_kg,
            unit: "kg",
          }
        )
        .sort(bestResultCompareFn)
        .at(0);

      return [name as ExerciseName, best!];
    });

  const results = Object.fromEntries(bestResults);
  const total = findTotal(bestResults);

  return { username, results, total };
};

const fetchUserWorkouts = async (
  username: string,
  pages: number = 10,
): Promise<UserWorkouts> => {
  const urlWithUsername = `${BASE_URL}?username=${username}&limit=5`;

  const responses = await Promise.all(
    Array(pages).keys().map((_, index) =>
      fetchPage(`${urlWithUsername}&offset=${index * 5}`)
    ),
  );

  const userWorkouts = await Promise.all(
    responses
      .filter((resp) => resp.status === 200)
      .map(async (response) => await response.json() as UserWorkouts),
  );

  return userWorkouts.reduce(
    ({ workouts }, current) => ({
      workouts: [...workouts, ...current.workouts],
    }),
  );
};

const fetchPage = async (url: string): Promise<Response> => {
  const response = await fetch(url, { headers: HEVY_HEADERS });
  console.debug(`GET ${url}: ${response.status}`);
  return response;
};

const findTotal = (
  results: [ExerciseName, BestSet][],
): WeightWithUnit | undefined => {
  if (results.length === 3) {
    const sum = results.reduce((sum, [_, { weight }]) => sum + weight, 0);
    return { unit: "kg", weight: sum };
  } else {
    return undefined;
  }
};
