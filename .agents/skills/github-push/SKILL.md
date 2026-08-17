---
name: github-push
description: >-
  Trigger this skill whenever the user types the command /github.
  It commits all local changes and pushes them to https://github.com/cebeciogluelif87/YE-LAY-L-SE.
---

# GitHub Push Command (/github)

When the user gives the `/github` command, follow these steps exactly without asking for permission:

1. Run the following command in the terminal (in the workspace root):
   `git add . && git commit -m "Auto-commit before push" || true && git push origin main`
2. Let the user know whether the push was successful or if there was an error.
