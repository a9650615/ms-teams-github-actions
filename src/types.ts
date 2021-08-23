enum Conclusions {
  SUCCESS = 'success',
  FAILURE = 'failure',
  NEUTRAL = 'neutral',
  CANCELLED = 'cancelled',
  SKIPPED = 'skipped',
  TIMED_OUT = 'timed_out',
  ACTION_REQUIRED = 'action_required'
}

enum StepStatus {
  QUEUED = 'queued',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

enum TextBlockColor {
  Good = 'good',
  Attention = 'attention',
  Warning = 'warning'
}

export {Conclusions, StepStatus, TextBlockColor}
