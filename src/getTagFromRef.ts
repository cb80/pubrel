export function getTagFromRef(argRef: string): string {
  if (argRef === 'refs/heads/main') {
    return 'latest'
  }
  if (argRef.startsWith('refs/tags/')) {
    return argRef.substring(10)
  }
  throw new Error(`Invalid ref: ${argRef}`)
}
