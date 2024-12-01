import { UserWorkouts, BestResult } from "./model.ts";

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

const EXERCISE_ID_TO_NAME = new Map([
  ["C6272009", "deadlift"],
  ["79D0BB3A", "benchPress"],
  ["D04AC939", "squat"],
]);

const excerciseSetCompareFn = (v1: BestResult, v2: BestResult) => {
  if (v1.weight == v2.weight) return v2.reps - v1.reps;
  return v2.weight - v1.weight;
};

// export const getOwnResults = async () => {
//   const exercises = await Promise.all([
//     ...EXERCISE_ID_TO_NAME.entries(),
//   ].map(async ([id, name]) => {
//     const url =
//       `https://api.hevyapp.com/user_exercise_sets/${id}/2024-09-06T21:44:53+02:00`;
//     const response = await fetch(url, { headers: HEVY_HEADERS });
//     console.debug(`Request for id=${id}: status=${response.status}`);

//     const body = await response.json() as ExerciseSet[];
//     const best = body.map(({ weight_kg, reps }: ExerciseSet) => (<Result> {
//       weight: weight_kg,
//       reps: reps,
//       unit: "kg",
//     })).sort(excerciseSetCompareFn).at(0);

//     const result: Record<string, Result> = {};

//     if (best) {
//       result[name] = best;
//     }

//     return result;
//   }));

//   const results = Object.assign({}, ...exercises);
//   return { results };
// };

export const getResultsByUsername = async (username: string) => {
  const url =
    `https://api.hevyapp.com/user_workouts_paged?username=${username}&limit=50`;
  const response = await fetch(url, { headers: HEVY_HEADERS });
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

  const exercises = Object.entries(grouped).map(([id, exercises]) => {
    const best = exercises!
      .flatMap((exercise) => exercise.sets)
      .map((set) => <BestResult>{
        reps: set.reps,
        weight: set.weight_kg,
        unit: "kg",
      })
      .sort(excerciseSetCompareFn)
      .at(0);

    const result: Record<string, BestResult> = {};
    if (best) {
      const name = EXERCISE_ID_TO_NAME.get(id)!;
      result[name] = best;
    }
    return result;
  });

  const results = Object.assign({}, ...exercises);
  return { results };
};
