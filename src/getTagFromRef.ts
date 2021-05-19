export const getTagFromRef = function (argRef: string): string {
  if (argRef === 'refs/heads/main') {
    return 'latest';
  }
  if (argRef.startsWith('refs/tags/')) {
    return argRef.slice(10);
  }
  throw new Error(`Invalid ref: ${argRef}`);
};
