# github-widgets-deno

Collection of README widgets created with
[Deno](https://deno.com/)&[Pug](https://pugjs.org/) and made public with
[Deno Deploy](https://deno.com/deploy).

## Preview

### Powerlifting PRs 🏋️

[![My powerlifting PRs](https://lukasz0104-github-widgets.deno.dev/hevy?username=lukasz0104)](https://github.com/Lukasz0104/github-widgets-deno)

### Duolingo stats

[![My Duolingo stats](https://lukasz0104-github-widgets.deno.dev/duolingo?id=452738409)](https://github.com/Lukasz0104/github-widgets-deno)

## Running locally

### Requirements

- [Deno](https://deno.com/)
- `.env` file created based on the template: [`.env.template`](./.env.template)

```bash
deno run dev
```

## Adding to your profile

### Powerlifting PRs

Replace `<HEVY_USERNAME>` with your username from
[Hevy](https://www.hevyapp.com/):

```md
[![My powerlifting PRs](https://lukasz0104-github-widgets.deno.dev/hevy?username=<HEVY_USERNAME>)](https://github.com/Lukasz0104/github-widgets-deno)
```

> [!NOTE]
> The PR for each exercise (bench press, deadlift, squat) is calculated from
> your last 50 public workouts by taking the set with highest weight (and most
> reps).

### Duolingo

Replace `<DUOLINGO_ID>` with your id from Duolingo:

```md
[![My Duolingo stats](https://lukasz0104-github-widgets.deno.dev/duolingo?id=<DUOLINGO_ID>)](https://github.com/Lukasz0104/github-widgets-deno)
```
