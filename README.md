# github-widgets-deno

Collection of README widgets created with
[Deno](https://deno.com/)&[Pug](https://pugjs.org/) and made public with
[Deno Deploy](https://deno.com/deploy).

## Preview

### Powerlifting PRs 🏋️

[![My powerlifting PRs](https://github-widgets-deno.lukasz0104.deno.net/hevy?username=lukasz0104)](https://lukasz0104-github-widgets.deno.dev/hevy?username=lukasz0104)

### Duolingo stats

[![My Duolingo stats](https://github-widgets-deno.lukasz0104.deno.net/duolingo?id=452738409)](https://lukasz0104-github-widgets.deno.dev/duolingo?id=452738409)

## Running locally

### Requirements

- [Deno](https://deno.com/)
- `.env` file created based on the template: [`.env.template`](./.env.template)

```bash
deno run dev
```

**In order to use OpenTelemetry integration for Deno** fill `OTEL_*` variables
in `.env` and run:

```bash
dotenv run deno run dev
```

## Adding to your profile

### Powerlifting PRs

Replace `<HEVY_USERNAME>` with your username from
[Hevy](https://www.hevyapp.com/):

```md
[![My powerlifting PRs](https://github-widgets-deno.lukasz0104.deno.net/hevy?username=<HEVY_USERNAME>)](https://github.com/Lukasz0104/github-widgets-deno)
```

> [!NOTE]
> The PR for each exercise (bench press, deadlift, squat) is calculated from
> your last 50 public workouts by taking the set with highest weight (and most
> reps).

### Duolingo

Replace `<DUOLINGO_ID>` with your id from Duolingo:

```md
[![My Duolingo stats](https://github-widgets-deno.lukasz0104.deno.net/duolingo?id=<DUOLINGO_ID>)](https://github.com/Lukasz0104/github-widgets-deno)
```
