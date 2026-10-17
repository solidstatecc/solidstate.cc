// Zero-dependency resolver hook for `node --test`.
//
// The lib/ sources use extensionless relative imports ("./types", "./skillsSh")
// because the Next.js bundler resolves them. Node's native ESM loader does not,
// so this hook appends `.ts` to bare relative specifiers that lack an extension.
// Node v23.6+ strips TypeScript types on its own; we only fix resolution.

import { registerHooks } from "node:module"

registerHooks({
  resolve(specifier, context, nextResolve) {
    const isRelative = specifier.startsWith("./") || specifier.startsWith("../")
    const hasExtension = /\.[mc]?[jt]sx?$/.test(specifier)
    if (isRelative && !hasExtension) {
      try {
        return nextResolve(specifier + ".ts", context)
      } catch {
        // fall through to default resolution for .js/.json/etc.
      }
    }
    return nextResolve(specifier, context)
  },
})
