# Backend Task — Fresher Track

**Return within 24 hours of receiving this.** The work itself is scoped to about 3 hours — please don't spend your whole day on it. If you run out of time, submit what you have and say so.

You may use AI tools. We expect you to. Part B asks you where and how.

---

## Part A — Build exactly this endpoint

Build one HTTP endpoint using Node.js and Express. Read the data from the `customers.json` file provided. No database.

### The endpoint

```
GET /api/customers
```

### Query parameters

| Param | Type | Required | Default |
|---|---|---|---|
| `page` | number | no | `1` |
| `limit` | number | no | `10` |
| `status` | string | no | none — return all statuses |
| `search` | string | no | none |

- `status` filters on exact match. Valid values: `active`, `paused`, `churned`.
- `search` matches if the text appears anywhere in the customer's `name`, case-insensitive.
- If both `status` and `search` are given, both must match.
- Maximum allowed `limit` is `50`.

### Success response — status 200

Exactly this shape. Field names and nesting must match.

```json
{
  "success": true,
  "data": [
    {
      "id": "cus_001",
      "name": "Rohan Nair",
      "city": "Pune",
      "status": "paused",
      "channel": "email"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 28,
    "totalPages": 3
  }
}
```

- `total` is the number of records matching the filters, **not** the number returned on this page.
- `totalSpent` and `createdAt` must **not** appear in the response.

### Error response — status 400

```json
{
  "success": false,
  "error": "message here"
}
```

### Required behaviour for each case

| Case | Status | Body |
|---|---|---|
| Normal request | 200 | Success shape above |
| Filters match nothing | 200 | Success shape, `data` is `[]`, `total` is `0` |
| `page` is beyond the last page | 200 | Success shape, `data` is `[]`, `total` unchanged |
| `page` or `limit` is not a number, or is negative | 400 | `"Invalid pagination parameters"` |
| `limit` is greater than 50 | 400 | `"Limit cannot exceed 50"` |
| `status` is not one of the three valid values | 400 | `"Invalid status"` |

### Constraints

Staying inside these is part of what we're assessing.

- Only `express` as a dependency. Nothing else — no lodash, no zod, no dotenv, no nodemon.
- One file for the application code. JavaScript or TypeScript, your choice.
- Do not add any other endpoint, including a health check or a root route.
- Do not add any field to the response that isn't listed above.
- Do not modify `customers.json`.
- No tests, no Docker, no folder structure, no README beyond how to run it.

**Extra features are not a bonus. They count against you.** We are hiring for the ability to build what was asked, at the size it was asked for. A submission that does exactly this and nothing else scores higher than one that does this plus three things we didn't ask for.

---

## Part B — Find what's wrong

`part-b/reportController.js` is AI-generated code from a different project. It runs, but it has bugs.

Write a file called `FINDINGS.md` listing what you find. For each one:

- The line number
- What is wrong
- What actually breaks because of it — the user-visible consequence, not just "this is bad practice"

Do **not** rewrite the file. We only want the list.

Style issues (naming, formatting, `var` vs `const`) are not what we're looking for. We want things that produce wrong behaviour.

---

## Also include: NOTES.md

Three short answers. A few lines each is fine.

1. Was there anything in the Part A spec you found unclear or contradictory? What did you decide to do, and why?
2. Where did you use AI on this task? Was there any point where you disagreed with what it gave you and did something different? **Using AI is expected and is not penalised** — we're asking about your judgement over its output, so be specific.
3. What is one thing in your Part A code you're not happy with, and what would you do about it with more time?

---

## Submitting

Push to a public GitHub repo and reply with the link. Your repo should contain:

```
/  (your Part A code + customers.json + how to run it)
FINDINGS.md
NOTES.md
```

If anything in this brief is unclear, email us and ask. Asking is not a mark against you.
