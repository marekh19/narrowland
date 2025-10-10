export type RaiseOptions = { name?: string; code?: string; cause?: unknown }

export function raiseError(message: string, opts: RaiseOptions = {}): never {
  const err = new Error(message, { cause: opts.cause })
  err.name = opts.name ?? 'InvariantError'
  //@ts-expect-error - augmenting for convenience
  err.code = opts.code
  throw err
}

export function raiseAssertError(
  message: string,
  opts: Omit<RaiseOptions, 'name'> = {},
): never {
  return raiseError(message, { name: 'AssertionError', ...opts })
}

export function raiseEnsureError(
  message: string,
  opts: Omit<RaiseOptions, 'name'> = {},
): never {
  return raiseError(message, { name: 'EnsureError', ...opts })
}
