# Score Distribution Feature Documentation

## Overview

The Score Distribution feature helps users understand their evaluation metrics by providing visual insights into the alignment between expected scores and Atla scores. The feature includes:

1. A summary panel showing the percentage of perfect matches
2. A detailed modal with three views:
   - Score Distribution: A bar chart showing the distribution of expected vs. Atla scores
   - Version Comparison: A line chart showing how score alignment changes across prompt versions
   - Test Case Details: A table showing the detailed match status for each test case

## Key Features

### Score Summary Panel

Located below the header in the alignment screen, this panel shows:

- The percentage of perfect matches between expected and Atla scores
- Improvement/decline compared to previous versions (when applicable)
- A button to open the detailed Score Analysis modal

### Score Distribution Chart

This bar chart visualizes:

- The count of expected scores for each score value
- The count of Atla scores for each score value
- Allows easy comparison to see where the evaluation model is most aligned

### Version Comparison

The version comparison chart shows:

- How score alignment changes across different prompt versions
- Which versions have better alignment
- Trends in alignment as the prompt is refined

### Test Case Details

A detailed table showing:

- Each test case with its input
- The expected and Atla scores
- A color-coded match status (perfect, close, or significant difference)

## Technical Implementation

The feature uses:

- Recharts library for data visualization
- Custom hooks to fetch and process version history data
- Tailwind CSS for styling
- React context and state for data management

## How to Use

1. Create test cases and run evaluations
2. View the summary score alignment in the header
3. Click "View score distribution" to open the detailed analysis
4. Use the tabs to switch between different analysis views
5. Create new prompt versions to compare alignment across versions

## Future Enhancements

Potential improvements for this feature:

- Filtering test cases by match status
- Exporting score data for external analysis
- Adding more statistical metrics beyond perfect match percentage
- Custom score thresholds for determining match quality
