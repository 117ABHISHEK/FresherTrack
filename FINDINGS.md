# Findings

## 1. Campaign data is not awaited

- **Line:** 49
- **What is wrong:** `loadCampaigns()` is asynchronous, but the result is assigned without `await`.
- **What breaks:** `campaigns` is a Promise, so the handler throws when it calls `.slice()` (or `.filter()` when `channel` is supplied). Every list request falls into the catch block instead of returning campaign data.

## 2. Pagination starts at the wrong record

- **Line:** 56
- **What is wrong:** The starting offset is calculated as `page * limit` instead of `(page - 1) * limit`.
- **What breaks:** Page 1 skips the first page of campaigns, page 2 skips the first 20 records when the limit is 10, and valid records can incorrectly appear to be missing from the report.

## 3. Request failures are reported as successful empty reports

- **Lines:** 62-71
- **What is wrong:** The catch block responds with HTTP 200 and `success: true` for any failure, including a missing or invalid data file and runtime errors.
- **What breaks:** Clients cannot distinguish a real empty report from a server failure and may show an empty dashboard while reporting that the request succeeded.

## 4. Pagination query values are parsed too permissively

- **Lines:** 44-45
- **What is wrong:** `parseInt()` accepts partial values such as `2abc`, and `||` silently replaces zero or other falsy values with defaults.
- **What breaks:** Malformed requests can return data for a different page or limit than the client requested, and a requested `limit=0` is treated as 10 instead of being handled explicitly.

## 5. Invalid campaign indexes are not handled

- **Lines:** 79-83
- **What is wrong:** The route parses the index but does not validate it or check whether a campaign exists before passing it to `buildRow()`.
- **What breaks:** An out-of-range or non-numeric index causes `buildRow(undefined)` to throw, so the client receives a generic HTTP 500 error instead of a controlled response for an invalid or missing campaign.
