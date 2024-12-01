export interface UserWorkouts {
  workouts: Workout[];
}

export interface Workout {
  id: string;
  name: string;
  index: number;
  media: unknown[];
  user_id: string;
  comments: unknown[];
  end_time: number;
  short_id: string;
  username: string;
  verified: boolean;
  exercises: Exercise[];
  created_at: string;
  image_urls: unknown[];
  is_private: boolean;
  like_count: number;
  routine_id?: string;
  start_time: number;
  updated_at: string;
  apple_watch: boolean;
  description: string;
  like_images: unknown[];
  nth_workout: number;
  wearos_watch: boolean;
  comment_count: number;
  profile_image: string;
  is_liked_by_user: boolean;
  estimated_volume_kg: number;
}

export interface Exercise {
  id: string;
  url?: string;
  sets: Set[];
  notes: string;
  title: string;
  de_title: string;
  es_title?: string;
  fr_title: string;
  it_title: string;
  ja_title: string;
  ko_title: string;
  priority: number;
  pt_title: string;
  ru_title: string;
  tr_title: string;
  media_type?: string;
  superset_id: unknown;
  zh_cn_title: string;
  zh_tw_title: string;
  muscle_group: string;
  rest_seconds: number;
  exercise_type: string;
  other_muscles: string[];
  thumbnail_url?: string;
  equipment_category: string;
  exercise_template_id: string;
  volume_doubling_enabled: boolean;
  custom_exercise_image_url: unknown;
  custom_exercise_image_thumbnail_url?: string;
}

export interface Set {
  id: string;
  prs: PersonalRecord[];
  rpe: unknown;
  reps: number;
  index: number;
  indicator: string;
  weight_kg: number;
  distance_meters?: number;
  personalRecords: PersonalRecord[];
  duration_seconds?: number;
}

export interface PersonalRecord {
  type: string;
  value: number;
}

export type ExerciseName = "benchPress" | "deadlift" | "squat";

export interface UserBestResults {
  username: string;
  results: Partial<Record<ExerciseName, BestResult>>;
}

export interface BestResult {
  weight: number;
  reps: number;
  unit: "kg";
}
