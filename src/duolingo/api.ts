import { DuolingoResponse } from "./model.ts";

export const getStatsById = async (
  id: string,
  includeCourses: boolean = false,
) => {
  const url = `https://duolingo.com/2017-06-30/users/${id}`;
  const response = await fetch(url);
  if (response.status !== 200) {
    return {};
  }

  const body = await response.json() as DuolingoResponse;

  const { totalXp, name, streak, courses } = body;

  return {
    totalXp,
    id,
    name,
    streak,
    courses: includeCourses
      ? courses.map(({ learningLanguage, xp }) => ({ learningLanguage, xp }))
      : [],
  };
};
