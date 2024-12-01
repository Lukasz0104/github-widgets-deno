import { DuolingoResponse } from "./model.ts";

export const getStatsById = async (id: string) => {
  const url = `https://duolingo.com/2017-06-30/users/${id}`;
  const response = await fetch(url);
  if (response.status !== 200) {
    return {};
  }
  const body = await response.json() as DuolingoResponse;
  return {
    totalXp: body.totalXp,
    id: body.id,
    name: body.name,
    streak: body.streak,
    courses: body.courses.map(({ learningLanguage, xp }) => ({
      learningLanguage,
      xp,
    })),
  };
};
