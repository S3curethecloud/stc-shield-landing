## Accessibility & ARIA Compliance — STC Shield Console Preview

STC Shield Console Preview implements an enterprise-grade ARIA interaction model
aligned with WCAG 2.1 AA guidance and common cloud security tooling patterns.

### Interaction Model

- Findings list is implemented as a `role="listbox"` with `role="option"` children.
- Keyboard navigation (↑ / ↓) moves selection without triggering side effects.
- Selection state is communicated via `aria-selected`.
- The active finding is announced by screen readers upon selection.

### Detail & AI Panels

- Finding details and AI explanations are rendered in separate `role="region"` panels.
- These panels do not automatically receive focus to avoid disruptive announcements.
- Findings reference their corresponding detail region via `aria-describedby`.

### AI Behavior

- AI explanations are read-only and deterministic.
- AI output updates are marked with `aria-live="polite"` to allow non-intrusive announcements.
- No automated remediation or configuration mutation is performed.

### Design Intent

This approach mirrors accessibility behavior found in mature security platforms
(AWS Console, Azure Portal, Datadog, Splunk) where findings drive context
and secondary panels update without focus theft.

This console is intentionally conservative, predictable, and operator-trust-first.
