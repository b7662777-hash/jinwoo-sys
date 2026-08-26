- fix(providers): correct the conol-web registry fallback-models import depth, which pointed at a
  non-existent `open-sse/config/services/` and made any suite loading the provider registry fail to
  resolve (#10140)
