# Code review

This guidance applies to every code review, regardless of the harness or workflow.
Apply the principle review obligations in [AGENTS.md](../AGENTS.md).

Review the complete change and its consequences.
Treat harness focus areas as added emphasis.
Trace affected callers, consumers, contracts, and lifecycle paths beyond the diff.
Include concrete downstream regressions in unchanged code.

Use agreed requirements and applicable principle Rules as the review criteria.
Treat a harness outcome summary as context, not the complete set of requirements.
Assess intentional choices against the same criteria.
Do not dismiss a defect solely because the author intended the behavior.

If the change exposes or worsens an existing defect, explain the causal connection.
Keep unrelated pre-existing defects separate.
Require concrete evidence for each finding.
Avoid speculative redesign and personal style preferences.

With the verdict, briefly state the affected paths inspected and any material gaps.
If governing instructions restrict coverage, state that restriction.
