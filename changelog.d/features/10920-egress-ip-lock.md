- `feat(resilience)`: when an allowlisted provider (opencode family) answers
  429 classified `quota_exhausted` or `rate_limit_exceeded` and its free-tier
  quota is bucketed by egress IP (#9611), every connection of that family
  sharing the IP is cooled down together before the rotation tries them — one
  guaranteed-failed upstream call per episode instead of N, on the combo path
  as well. For the allowlisted family a 429 now cools the connection instead
  of locking a single model. Exclusive allowlist, never terminal, best-effort
  when the egress IP is unknown (#10920).
