---
title: "Probabilistic Generation, Static Validation: Code Quality Still Matters in the Agentic Era"
date: 2026-11-02
draft: false
description: "LLMs never give the same answer twice and we ship more code than anyone can review. Stop reviewing lines and gate the patterns instead."
slug: probabilistic-generation-static-validation
tags:
  - ai
  - software-engineering
  - architecture
---
> **TL;DR:** LLMs are probabilistic. Ask the same thing twice and you get two different answers. So you put deterministic checks on top of everything they generate. Probabilistic generation, static validation. On Monday, look at your quality gate. No gate? Start with tests and formatting. Already have one? Ask if it's enough, then iterate.

The amount of code we ship as software engineers exploded since Claude Code, Copilot, Antigravity and friends showed up in our world. And that's exactly why I don't buy the "software engineering is dead" talk. If engineering were dying, we'd be shipping less code. We're shipping more. Way more.

So if you remember one thing from this post, make it this.

> **Probabilistic generation. Static validation.**

This post is for two kinds of people. Engineers who ship with agents every day and quietly decided that code quality doesn't matter anymore. And vibe coders who believe the agent takes care of everything, so nobody needs to think or decide what to do. I think both are wrong, and I think the fix is boring and cheap. It's probably already sitting in your package manager.

## Ask twice, get two answers

LLMs are probabilistic. They're not deterministic, and on their own they can't guarantee a pattern. Ask the same thing twice and you won't get the same answer, not 1:1. Sometimes close. Never guaranteed.

That's fine for a draft. It's a problem for a codebase. A codebase is a pile of decisions that have to stay consistent over time. How things are named, how files are structured, what a test looks like, which module is allowed to import which. If the thing writing the code can't promise consistency, something else has to.

You can write those decisions in the prompt, sure. Put them in a CLAUDE.md, in a skill, in a rules file. I do that too. But a rule in a prompt is something the model follows most of the time. Most of the time is not a guarantee.

In my last post, [Don't Blame the Hammer](https://blog.wstech.tech/posts/dont-blame-the-hammer/), I wrote that a rule nothing runs is a suggestion. This post is the other half of that sentence. If the generator is probabilistic, the check has to be deterministic. Same input, same verdict, every single time.

I'm not alone here. Uncle Bob said in [a livestream](https://www.youtube.com/watch?v=zcLPGC-tvgk) that rules in a prompt work more like guidelines, and that the real checks should be deterministic tools that run after the fact.

## Nobody can review 8,000 lines

Now add volume. In the same task, an agent can open 10 small PRs or one big PR with 8k lines. Put that into a team of software engineers, each one with an agent, and you have thousands and thousands of new lines of code per day.

GitHub's own numbers point the same way. The [Octoverse 2025 report](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/) counted nearly 1 billion commits in 2025, up 25% year over year, and 518.7 million merged pull requests, up 29%. GitHub doesn't say how much of that an AI wrote, so I won't guess. But the curve only goes one way.

Reviewing every line of that by hand is humanly impossible. Be honest, you're not doing it. Nobody is. What actually happens is the reviewer scrolls, sees a green CI, leaves a comment about a variable name and approves.

So let's stop pretending. Line-by-line review is the wrong level now. Formatting, spacing, import order, that conversation should be over, a machine settles it in milliseconds. Our attention has to go one level up, to the patterns that emerge from the code.

## Review patterns, not lines

The idea is simple. You decide the patterns from scratch, as a team. Then you turn each one into a static validation and run it in your CI/CD workflow on every change.

And there's a lot you can check today.

- Formatting and linting. The boring baseline, nobody should review this by hand ever again.
- Naming and comments, how things are called and what a comment is allowed to say.
- Complexity. Cyclomatic complexity counts the paths through a function. Cognitive complexity, a metric from SonarSource, tries to measure how hard it is to read.
- Coverage, unit and integration, with a floor the build won't go below.
- Green tests and regression tests. Nothing gets merged red, and every bug fix comes with a test that would have caught it.
- Tests that assert nothing. A test that calls your code and checks nothing makes coverage go up and proves nothing. Agents write these, and my gate caught a bunch of them.
- CRAP. More on this one below.
- The dependency graph, which module can import which. Architecture as a rule instead of a wiki page.
- File size. A line cap per file, so god files never happen.

CRAP deserves its own section, because most people I talk to never heard of it.

### The CRAP metric

Alberto Savoia and Bob Evans created it [back in 2007](https://www.artima.com/weblogs/viewpost.jsp?thread=215899). It combines two numbers for each method, its cyclomatic complexity and how much of it your tests cover.

```text
CRAP(m) = comp(m)² × (1 − cov(m))³ + comp(m)
```

`comp` is the cyclomatic complexity and `cov` is the coverage, from 0 to 1. Look at what the formula does. A simple method stays low even with no tests. A complex method with full coverage also stays low. A complex method with no tests explodes, because the complexity is squared and the missing coverage is cubed.

Savoia used 30 as the line between fine and crappy. And here's my favorite part. With complexity 31 or more, no amount of coverage gets you under 30, because the `+ comp(m)` at the end is already over the line. The only way out is to split the method.

That's exactly the kind of feedback you want to give an agent. It can't just add a few tests to make the number go away. It has to make the code simpler.

### What exists per stack

Most of this already exists as tools. Here's what I found for the three stacks I work with the most.

| Check | Python | TypeScript | Go |
|---|---|---|---|
| Complexity | ruff `C901`, cyclomatic only; flake8-cognitive-complexity, last release 2020 | eslint-plugin-sonarjs `cognitive-complexity` | gocognit |
| Tests that assert nothing | pytest-tidy `PTD003`, new in 2026; mutmut | jest and vitest `expect-expect`; sonarjs `assertions-in-tests` | no lint rule I found; Gremlins for mutation testing |
| CRAP | crap4py; crapper | crapper; crap4js | crap4go; crapper |
| Dependency rules | import-linter | dependency-cruiser | go-arch-lint; depguard |

Python is my main stack, and it's the one with the most holes. Ruff has no cognitive complexity rule, only McCabe's cyclomatic one, and neither ruff nor flake8 flags a test without asserts. You end up wiring some of it yourself.

Then there's mutation testing. A tool like [mutmut](https://github.com/boxed/mutmut), [Stryker](https://stryker-mutator.io/) or [Gremlins](https://github.com/go-gremlins/gremlins) changes your code on purpose and checks if a test fails. If nothing fails, your tests weren't really testing that line. It catches the empty test and the weak one.

Uncle Bob built a lot of this for himself. His [crapper](https://github.com/unclebob/crapper) and [mutator](https://github.com/unclebob/mutator) cover Python, TypeScript, Go, Java, Rust and Clojure, and his agent pipeline, [as summarized here](https://blog.alexrusin.com/uncle-bob-ai-coding-agents/), goes coder, then a cleaner working on CRAP, then a hardener running mutation tests, then QA.

Fabio Akita, who has been shipping a lot with agents this year, leans on tests and process. One line of test for every line of code, a regression test before every bug fix, and only green commits on master, as he describes in [his six-day vibe coding post](https://akitaonrails.com/en/2026/02/16/vibe-code-zero-to-production-in-6-days-the-m-akita-chronicles/). I agree with all of it. Tests tell you the behavior is right. Static gates tell you the shape is right. You want both.

## The day I wrote `./quality-gate`

This isn't theory for me.

A while ago I was at the beginning of a project with a lot of services, each one deployed on its own. I was responsible for one of them. The requirements were clear, beginning, middle and end of what that service had to do. And it had to call and connect with a lot of other services.

I used the best approaches I knew, all the agentic engineering techniques. But we were almost out of time and the expectations on that implementation were high. We didn't have a CI/CD pipeline with quality gates, and the code was already too big to review everything by hand. And since we were a team of a lot of developers, I couldn't simply drop a quality gate into the shared CI out of nowhere.

So I built one locally. A command as simple as `./quality-gate`, and it worked as a skill for the agent before we ever put it into our CI. It ran pytest, black, a cyclomatic complexity check, a separate script that calculated CRAP, and a line cap of 500 per file, because of that problem with god files.

Then the loop. The agent writes code, the gate runs, the red flags go back to the agent. Again. Again. Again.

It caught exactly the stuff I listed above. Low test coverage. Tests that asserted nothing. High cyclomatic complexity in the implementations. Files with thousands of lines.

By the end, coverage went from around 50% to 99%. Files went from thousands of lines to around 500. The code became simpler, smaller, prettier. Not heavier, not messier.

It was engineering in its most pure form.

And notice what I didn't have to do. I didn't read every line. I decided what good looked like once, and the gate told the agent as many times as it took.

Here's what a minimal version of a gate like that can look like. **This is an illustration I wrote for this post, not the script from that project.**

```bash
#!/usr/bin/env bash
# quality-gate: illustration only, not the original script.
set -euo pipefail

# 1. Formatting
black --check src tests

# 2. Cyclomatic complexity, max 10 per function
ruff check --select C901 --config 'lint.mccabe.max-complexity = 10' src

# 3. Tests green, with a coverage floor
pytest --cov=src --cov-branch --cov-fail-under=90

# 4. CRAP, from your own script or a tool like crap4py
python scripts/crap.py --max 30

# 5. No god files, 500 lines max
find src -name '*.py' -print0 | xargs -0 wc -l \
  | awk '$2 != "total" && $1 > 500 { print "too long: " $2; bad = 1 } END { exit bad }'

echo "quality gate passed"
```

Every step exits non-zero when it fails, so the agent gets a red flag and a reason, and goes back to work.

## The gate isn't a rock

Now, I don't want anybody reading this as "write the perfect rule set once and carve it in stone". It's the opposite.

The gate has to evolve. It has to be moldable. Like everything in software engineering, it has to be almost organic. Contradictory, no? Static validation that keeps changing. But that's how it works. You make the rules looser or harder depending on the requirements of your software. The critical parts of the code get the stricter rules.

The CRAP threshold itself shows this. Savoia started at 30 in 2007, and he called it experimental. Uncle Bob's [crap4java](https://github.com/unclebob/crap4java) fails the build above 8, and his [ub-mode](https://github.com/unclebob/ub-mode) skill gates at under 10. In an interview he reportedly said he uses 6 for agents and under 4 for humans, according to [this summary of it](https://note.com/minilab/n/nd64fb35c7cab). Same metric, different numbers, depending on who writes the code and what's at stake. The threshold is a decision, not a law of physics.

A gate can also be gamed. Akita [warns about this](https://akitaonrails.com/2026/10/24/por-que-nao-fazemos-provas-formais-definitivas-de-codigo-sem-bug/) with formal proofs. Tell an AI to make a proof pass and it may rewrite the program into one that trivially passes. The same goes for any gate. If the agent learns to satisfy the check without satisfying the intent, you change the check.

So start small, look at what slips through, and tighten.

## "But code is cheap"

The strongest argument against all this is that code is cheap now. And that's not entirely wrong.

Code really is cheap today. If something breaks, you push a fix in 30 seconds. If the codebase is a mess, you're not the one dealing with it, the agent is going to suffer there, not you, haha.

But remember what we're working with right now. We have access to frontier models, and I believe the compute behind them is heavily subsidized. Sooner or later frontier models are going to get expensive, and not everyone will be able to access them. We'll be working with models that don't perform like Opus 5.5 or GPT 6. Simpler models. Good ones, competent enough, but smaller.

Now put that smaller model on a messy codebase. It has less context to work with and less reasoning to spend. It burns that budget reading files with thousands of lines, following coupled modules around, and editing 23123 files because of one small change. Most of its time goes to fixing bugs that the mess created.

Put the same model on a clean, simple codebase. Small files. Clear boundaries. A dependency graph that a tool enforces. It reads less and breaks less. Its job becomes implementing new features and making the existing ones better, not fixing bugs.

This is why architecture, file structure and clean code principles didn't stop mattering. They were never about making humans feel good. They reduce how much you need to hold in your head to change something safely. For an agent, that head is the context window.

Writing code got cheap. Changing it didn't.

With architecture, structure and clean code, we still have a lot to gain and nothing to lose. A clean codebase is good for engineers, big agents and small agents.

## What to do on Monday

Think about these concerns. Then open your pipeline and check your actual quality gate.

If none exists yet, create a simple one. Tests plus formatting. That's it for day one. Then iterate and make it better.

If one already exists, ask the question. Is this enough? Do your tests assert anything? Do you know the complexity of your worst function? Is there a file over 500 lines nobody wants to open? Add one check. Then iterate again.

The agent will keep giving you different answers. That's its nature, and it's not going to change. Your job is to make sure the gate always gives the same one.

Probabilistic generation, static validation.
