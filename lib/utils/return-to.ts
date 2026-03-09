function splitHash(input: string) {
  const [pathWithSearch, hash] = input.split("#", 2);

  return {
    pathWithSearch,
    hash: hash ? `#${hash}` : "",
  };
}

export function appendReturnToParams(
  returnTo: string,
  params: Record<string, string>,
  hash?: string,
) {
  const normalizedReturnTo = returnTo || "/";
  const { pathWithSearch, hash: existingHash } = splitHash(normalizedReturnTo);
  const [pathname, search = ""] = pathWithSearch.split("?", 2);
  const searchParams = new URLSearchParams(search);

  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, value);
  });

  const nextSearch = searchParams.toString();
  const nextHash = hash
    ? hash.startsWith("#")
      ? hash
      : `#${hash}`
    : existingHash;

  return `${pathname}${nextSearch ? `?${nextSearch}` : ""}${nextHash}`;
}
