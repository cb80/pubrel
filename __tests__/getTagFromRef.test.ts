import { getTagFromRef } from '../src/getTagFromRef';

test('Parse ref', () => {
  expect(getTagFromRef('refs/heads/main')).toBe('latest');
  expect(getTagFromRef('refs/tags/latest')).toBe('latest');
  expect(getTagFromRef('refs/tags/v0.0.0')).toBe('v0.0.0');
  expect(() => {
    getTagFromRef('foo/bar/baz');
  }).toThrow();
});
