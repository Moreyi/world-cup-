// Test-only ESM resolve hook: strips the `?v=...` cache-busting query from
// relative import specifiers so Node resolves every module to a single path
// (and thus a single instance). The browser already loads each file once
// because the whole import graph uses one consistent version token; the test
// runner imports some modules with a bare path, so without this hook a
// stateful module like i18n.js would load twice (bare + versioned) and the
// setLang/getLang singleton would split. See package.json "test" script.
export async function resolve(specifier, context, nextResolve) {
  const queryAt = specifier.indexOf("?v=");
  if (queryAt !== -1) {
    return nextResolve(specifier.slice(0, queryAt), context);
  }
  return nextResolve(specifier, context);
}
