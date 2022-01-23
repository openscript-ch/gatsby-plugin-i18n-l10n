import { addLocalePrefix, parsePathPrefix, trimRightSlash, trimSlashes } from './path';

describe('trimRightSlash', () => {
  it('should trim the right slash', () => {
    const trimmed = trimRightSlash('https://example.com/');
    expect(trimmed).toBe('https://example.com');
  });
});

describe('trimSlashes', () => {
  it('should trim the slashes', () => {
    const trimmed = trimSlashes('/de/page/');
    expect(trimmed).toBe('de/page');
  });

  it("shouldn't trim single slash", () => {
    const trimmed = trimSlashes('/');
    expect(trimmed).toBe('/');
  });

  it('should trim only leading slash if there is no trailing slash', () => {
    const trimmed = trimSlashes('/de/page');
    expect(trimmed).toBe('de/page');
  });

  it('should trim only trailing slash if there is no leading slash', () => {
    const trimmed = trimSlashes('de/page/');
    expect(trimmed).toBe('de/page');
  });
});

describe('addLocalePrefix', () => {
  it("adds locale as prefix if it's not the default locale", () => {
    const prefixed = addLocalePrefix('/path/to/rome', 'it', 'it', 'en');
    expect(prefixed).toBe('/it/path/to/rome');
  });
  it("adds locale as prefix if it's not the default locale to index routes", () => {
    const prefixed = addLocalePrefix('/', 'it', 'it', 'en');
    expect(prefixed).toBe('/it');
  });
  it("adds no locale if it's default locale", () => {
    const prefixed = addLocalePrefix('/path/to/rome', 'it', 'it', 'it');
    expect(prefixed).toBe('/path/to/rome');
  });
});

describe('parsePathPrefix', () => {
  it('returns the default prefix if there is no path', () => {
    const prefix = parsePathPrefix('/', 'de');
    expect(prefix).toBe('de');
  });
  it('returns the prefix from the path', () => {
    const prefix = parsePathPrefix('/en/pages/another', 'de');
    expect(prefix).toBe('en');
  });
  it('returns the default prefix on empty path', () => {
    const prefix = parsePathPrefix('./', 'de');
    expect(prefix).toBe('de');
  });
});
