import {
  BestResult,
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
]);

const EXERCISE_NAMES = new Set(EXERCISE_ID_TO_NAME.values());

const bestResultCompareFn = (v1: BestResult, v2: BestResult) => {
  if (v1.weight == v2.weight) return v2.reps - v1.reps;
  return v2.weight - v1.weight;
};

export const getResultsByUsername = async (
  username: string,
): Promise<UserBestResults> => {
  const url =
    `https://api.hevyapp.com/user_workouts_paged?username=${username}&limit=50`;
  const response = await fetch(url, { headers: HEVY_HEADERS });

  if (response.status !== 200) {
    return { username, results: {} };
  }

  const userWorkouts = await response.json() as UserWorkouts;

  const filteredExercises = userWorkouts
    .workouts
    .flatMap((workout) => workout.exercises)
    .filter((exercise) =>
      EXERCISE_ID_TO_NAME.has(exercise.exercise_template_id)
    );

  const grouped = Object.groupBy(
    filteredExercises,
    (e) => e.exercise_template_id,
  );

  const bestResults = Object.entries(grouped).map(([id, exercises]) => {
    const best = exercises!
      .flatMap((exercise) => exercise.sets)
      .map((set) =>
        <BestResult> {
          reps: set.reps,
          weight: set.weight_kg,
          unit: "kg",
        }
      )
      .sort(bestResultCompareFn)
      .at(0);

    const result: Partial<Record<ExerciseName, BestResult>> = {};
    if (best) {
      const name = EXERCISE_ID_TO_NAME.get(id)!;
      result[name] = best;
    }
    return result;
  });

  const results = bestResults.reduce(
    (prev, current) => Object.assign(prev, current),
  );

  let total: WeightWithUnit | undefined;
  if (
    Object.keys(results).every((key) => EXERCISE_NAMES.has(key as ExerciseName))
  ) {
    const sum = Object.values(results).reduce(
      (sum, { weight }) => sum + weight,
      0,
    );
    total = { unit: "kg", weight: sum };
  }

  return { username, results, total };
};
