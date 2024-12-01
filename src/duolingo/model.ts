export interface DuolingoResponse {
  achievements: unknown[];
  hasFacebookId: boolean;
  totalXp: number;
  id: number;
  acquisitionSurveyReason: string;
  fromLanguage: string;
  picture: string;
  canUseModerationTools: boolean;
  emailVerified: boolean;
  currentCourseId: string;
  joinedClassroomIds: unknown[];
  hasPhoneNumber: boolean;
  hasRecentActivity15: boolean;
  courses: Course[];
  streak: number;
  creationDate: number;
  name: string;
  _achievements: unknown[];
  globalAmbassadorStatus: unknown;
  roles: string[];
  motivation: string;
  hasPlus: boolean;
  observedClassroomIds: unknown[];
  hasGoogleId: boolean;
  privacySettings: string[];
  streakData: StreakData;
  learningLanguage: string;
  subscriberLevel: string;
  location: string;
  username: string;
}

export interface Course {
  preload: boolean;
  placementTestAvailable: boolean;
  authorId: string;
  title: string;
  learningLanguage: string;
  xp: number;
  healthEnabled: boolean;
  fromLanguage: string;
  id: string;
  crowns: number;
}

export interface StreakData {
  currentStreak: Streak;
  previousStreak: Streak;
  length: number;
  xpGoal: number;
  longestStreak: LongestStreak;
  churnedStreakTimestamp: number;
  updatedTimeZone: string;
  updatedTimestamp: number;
  startTimestamp: number;
}

export interface Streak {
  endDate: string;
  length: number;
  lastExtendedDate: string;
  startDate: string;
}

export interface LongestStreak {
  endDate: string;
  length: number;
  achieveDate: unknown;
  startDate: string;
}
