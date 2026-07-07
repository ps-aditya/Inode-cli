# Examples

This directory will hold example input/output pairs for every supported
command, e.g.:

```
$ tra check "git push --force"
```

```json
{
  "level": "HIGH",
  "confidence": 99,
  "effects": [
    { "description": "Rewrites remote history" },
    { "description": "Affects 2 collaborators" },
    { "description": "Replaces 11 commits" }
  ],
  "undoable": true,
  "undoHint": "git reflog"
}
```

Populated as each Git command is supported (Sprint 2 onward).
