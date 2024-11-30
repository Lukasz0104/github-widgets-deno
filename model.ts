export interface ExerciseSet {
  workout_id: string;
  workout_short_id: string;
  workout_title: string;
  created_at: string;
  start_time: number;
  end_time: number;
  exercise_template_id: string;
  weight_kg: number;
  reps: number;
  duration_seconds: unknown;
  distance_meters: unknown;
  rpe: unknown;
  user_bodyweight_kg: number;
}

export interface Result {
  weight: number;
  reps: number;
  unit: "kg";
}
