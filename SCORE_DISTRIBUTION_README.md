# Score Distribution Feature Documentation

## Installation

Run the following command to install the required dependencies:

```bash
npm install
```

The only extra package that was installed is the [recharts](https://www.npmjs.com/package/recharts) package used to help visualise charts.

## Overview

The Score Distribution feature helps users understand their evaluation metrics by providing visual insights into the alignment between expected scores and Atla scores. The feature includes:

1. A summary panel showing the percentage of perfect matches.
2. A detailed modal with three views:
   - <u>Score Distribution</u>: A bar chart showing the distribution of expected vs. Atla scores.
   - <u>Version Comparison</u>: A line chart showing how score alignment changes across prompt versions
   - <u>Test Case Details</u>: A table showing the detailed match status for each test case

## Key Features

### Score Summary Panel

Located below the header in the alignment screen, this panel shows:

- The percentage of perfect matches between expected and Atla scores.
- A button to open the detailed Score Analysis modal.
- A color-coded perfect match status (perfect, close, or significant difference).

I added this summary panel to offer users a quick glance into how well their prompts are doing at a particular point in time without having to disrupt their flow with a detailed analysis unless they choose to view it themselves.

### Score Distribution Chart

This bar chart visualizes:

- The count of expected scores for each score value.
- The count of Atla scores for each score value.

I added this to allow users to easily compare where the evaluation model is most aligned.

### Version Comparison

The version comparison chart shows:

- How score alignment changes across different prompt versions.
- Which versions have better alignment.
- Trends in alignment as the prompt is refined.

### Test Case Details

A detailed table showing:

- Each test case with its input.
- The expected and Atla scores.
- A color-coded match status (perfect, close, or significant difference).

## Alignment Score Calculation

The alignment score is a weighted metric that measures how well the Atla scores match the expected scores:

1. **Perfect Matches**: Test cases where the Atla score exactly matches the expected score are given full weight (1.0).
2. **Close Matches**: Test cases where the Atla score is within a threshold of the expected score are given half weight (0.5).
3. **Significant Differences**: Test cases with larger differences are given no weight (0.0).

The thresholds for determining "close matches" vary by scoring criteria:

- **Binary (0/1)**: No threshold - any difference is significant (threshold = 0)
- **OneToFive (1-5)**: Threshold of 1 point
- **FloatZeroToOne (0.0-1.0)**: Threshold of 0.2 (20%)

The alignment score is calculated as:

```
Alignment Score = (Perfect Matches + (Close Matches × 0.5)) ÷ Total Test Cases
```

This weighted approach provides a more nuanced view of alignment than simply counting perfect matches, allowing for minor variations while still prioritising exact matches.

## Technical Implementation

The feature uses:

- [Recharts](https://www.npmjs.com/package/recharts) library for data visualisation.
- Custom hooks to fetch and process version history data.
- Tailwind CSS for styling.
- React context and state for data management.

## Additional Fixes

1. Fixed z-indexing issues between various modals.
2. Unified code structure using Prettier.
3. Addressed re-rendering issues flagged by linting.

## How to Use

1. Create test cases and run evaluations.
2. View the summary score alignment in the header.
3. Click "View score distribution" to open the detailed analysis.
4. Use the tabs to switch between different analysis views.
5. Create new prompt versions to compare alignment across versions.

## Future Enhancements

Potential improvements for this feature:

- Filtering test cases by match status.
- Exporting score data for external analysis.
- Adding more statistical metrics beyond perfect match percentage.
- Custom score thresholds for determining match quality.
