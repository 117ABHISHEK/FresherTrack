# Notes

## 1. Part A ambiguity

The spec says pagination values must not be negative, but it does not explicitly say whether zero is valid. I treated zero as invalid because page and limit are intended to select a non-empty page size, while keeping the required defaults for omitted values.

## 2. Use of AI

I used AI to inspect the supplied files, draft the Express endpoint, and identify likely defects in the controller. I reviewed the generated implementation and verified it with actual requests rather than relying on the draft. I also kept the implementation limited to the requested endpoint and Express dependency.

## 3. Part A improvement

The application currently loads the JSON file through Node's JSON module loading. With more time, I would add a small focused validation or test harness for the endpoint contract, especially boundary cases such as zero pagination values, without adding that to the submission unless requested.
