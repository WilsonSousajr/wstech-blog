---
title: "Don't Blame the Hammer: Agentic Engineering Is Just Engineering"
date: 2026-10-16
draft: false
description: "AI agents are tools, you're the engineer. Skip the orchestration hype: small tasks, test-first and a real quality gate still win."
slug: dont-blame-the-hammer
tags:
  - ai
  - software-engineering
---
> **TL;DR:** An AI agent is a tool, and a tool serves YOU. You're the engineer, you make the decisions, you take the call. You don't need the newest agent methodology. Just prompt it, small tasks, test first, keep it simple, stupid.

Every week I see a new methodology for working with AI. Orchestration. Spec-driven development. Loops. Whatever comes next week. And honestly, almost all of it is bullshit.

Don't blame a hammer for being a hammer. An AI agent is a tool, and the purpose of this tool is to serve you. You're the responsible engineer. You make the decisions, you take the call. The agent drives, you navigate. Separate navigation from execution, and most of these shiny methodologies stop making sense.

With the agentic AI era the software engineering workflow changed again. The way we do things changed, the technologies we used changed, and that's not bad. We were all taught that this is normal in our area. But one thing didn't change: the basics. The core of the job, the things we learned from our own mistakes before any LLM existed. That's what this post is about.

## I use AI every day

Before anyone reads this as an anti-AI rant: it isn't. I've been using AI since the beginning of the LLM wave, and today, more than ever, I use it every single day in my development workflow. At work, in personal projects, everywhere.

The best example is [Omatty](https://omatty.com). I love the terminal. I love TUIs. But Claude Code on the terminal, and the other TUI tools for AI agents, didn't have the view I wanted. I wanted a sidebar with all my projects. A file tree that follows the agent, so I don't need to open another application or keep closing and opening Neovim in the agent's worktree. I wanted to see issues and PRs without opening GitHub, Azure or GitLab. One centralized place for doing software engineering.

Yeah, GUI tools already do this. But they're GUIs, and almost all of them are orchestrators. I don't want an orchestrator, because I don't need one.

So I built my own, in Go, a language I had never used before. I picked it because it was the right tool for a TUI like this one, not because it was trending. Same with the AI. I used it to build Omatty because I had a problem and I wanted to solve it, not because AI is the trend of the moment. And I built it the same way I'd build anything: with extreme programming. The [source is on GitHub](https://github.com/WilsonSousajr/omatty).

## We've had this discussion before

I'm very devoted to KISS. Keep it simple, stupid.

None of this is new. For years we argued about the same thing with architecture. You don't need a big distributed system with tons of microservices, cross connections, shared databases and clean architecture layers on top of layers, like Netflix or Google, if you're not Netflix or Google.

The discussion is the same. Only the methodology changed.

You don't need a big orchestration pipeline. You don't need the most recent agent engineering methodology, unless you're working on a big, BIG, BIG and complex system. And you're probably not.

Small releases. Small iterations. Fast feedback. Pair programming. Requirements. Understanding the product. Testing. Security. None of these became useless with AI. It's the other way around: they're more important now than they've ever been.

## The hammer trying to cut wood

Here's what happens when you forget that.

I've seen the same combo more than once: ambiguous requirements, short deadlines, and systems where a mistake actually costs something. Add agents to that without the fundamentals, and the obvious thing happens. A lot of AI slop gets deployed. Files that shouldn't be there get committed. Tests that assert nothing get shipped. All the classic AI slop.

Short deadline, complex system, and a hammer trying to cut wood. Of course it doesn't work.

The work that held up, in my experience, was the boring kind. Small things one at a time. Small achievements. Test first, with real tests. Every extreme programming technique, just like we did before AI. That's the work that came back with the fewest problems, and the people using it were the happiest with it.

The problem is never the agent. It's technology used for the sake of the technology. Not to solve a problem, not to actually do something useful. Just a new way to make simple things harder.

> AI is a mirror. If you're good, it makes you ten times faster. If you're bad, you'll create ten times more junk, ten times faster.

## Why not ten agents at once?

Because almost nothing in programming is parallelizable.

The AI is your sidecar, but you need to be there. Launch ten agents to build ten different features at the same time and you get the same problems we got when ten humans did exactly that: duplicated code, security holes, and a pile of code nobody can audit.

Humans aren't multitaskers by nature. So stick to the good practices. One thing, work on it, then go to the next, work on it.

Yeah, in that flow we're the bottleneck. That's the point. LLMs are probabilistic. It doesn't matter how much better they get or how far their harness goes; a human still needs to be in the loop, making the decisions an LLM can't make.

## Pair programming, not code generation

LLMs have some very bad habits. They love god files. They love to over-engineer. Cyclomatic complexity is something they simply don't give a fuck about.

So you go there and say: "Hey, this isn't good. Maybe break this into these three modules. Decouple this part." The goal is to treat the LLM as another programmer, a colleague, not a code generator. Every session is a pair programming session. The agent has the keyboard; you're the navigator.

In practice, my sessions look like this:

- A limited task, with a very bright end. I know what the result should look like before it starts.
- Restrictions: what needs to stay true, and what it must not touch.
- I review the decisions, not the lines. I don't read the diff line by line, I question it. Why this approach and not the other one? What could be simpler?
- The agent runs the verifications: tests, fixtures, the project's own checks.

Then comes the part that matters most. After every session I check what went wrong and what took too long, and I fix the process together with the code. Every failed session, every bug, becomes a test or a rule, so the next session doesn't repeat the same error.

Kaizen. Keep improving. But in a simple way.

## A rule nothing runs is a suggestion

The story that taught me this was at work.

I was building some endpoints with an agent, adding the business rules for each endpoint into its service file. We kept working, kept adding things. I wasn't watching the file structure. When I finally looked, the agent had built a big-ass 3,000-line service file. A textbook god file.

That one's on me. I wasn't checking. So I turned it into a rule: no file above 500 lines.

We moved on to other services and other endpoints. Files with 700, 600, 900 lines kept appearing anyway.

So a rule wasn't enough. A rule in a prompt is probabilistic. The agent follows it most of the time, which means it doesn't follow it some of the time. A CI check is deterministic. It fails every single time. So the rule became a CI step: no file above 500 lines, and the build breaks if there is one.

Omatty went through the exact same thing, and the check is public. The comment at the top of `scripts/check-file-length.sh` says it better than I can here:

```bash
# The rule was written down and never checked, so #136 brought model.go and
# main.go under it before M7 and six files were back over it by v0.9.0. A rule
# nothing runs is a suggestion. Longer means the package boundary is wrong,
# so the answer to a failure is a split by responsibility, never a higher
# limit: the number is a ratchet that only moves down.
```

And CI runs it on every push to main and on every pull request:

```yaml
- name: file length
  run: ./scripts/check-file-length.sh 500
```

No orchestration pipeline, no fancy methodology. A `wc -l` over every Go file and a number that only goes down. That's my quality gate, and that's what kaizen looks like in a codebase: every mistake makes the process a bit stricter, so the agent can't make it again.

## Where orchestration actually fits

I'm not going to be unfair here. Orchestration has its place, at two extremes.

The first is really big distributed systems, or systems that need to run 24/7. They exist, and the machinery can make sense there.

The second is the opposite end: places where mistakes are cheap. Ticket support systems. Systems that are allowed to go wrong. MVP tests. If slop costs you almost nothing, sure, throw ten agents at it.

But your problem probably doesn't belong to either group. Most of us build things in the middle, where a mistake is expensive and the scale isn't Netflix's. And there, the fundamentals win.

## Just prompt it

So, on Monday: just prompt it. Small tasks. Test first. Keep it simple, stupid.

When something goes wrong, don't go looking for a new methodology. Turn the mistake into a test or a check, and move on to the next small thing.

The agent is a hammer. A very good one. Don't blame it for being a hammer. You're the engineer holding it.
