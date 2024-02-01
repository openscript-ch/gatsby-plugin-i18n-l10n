import { PluginOptions } from 'gatsby';
import { addLocalePrefix, generatePageContextByPath, handleTrailingSlash, parsePathPrefix, translatePagePaths, trimSlashes } from './path';

const options: PluginOptions = {
  defaultLocale: `en-US`,
  siteUrl: '',
  locales: [
    {
      locale: `en-US`,
      prefix: `en`,
      slugs: {},
      messages: {},
    },
    {
      locale: `de-CH`,
      prefix: `de`,
      slugs: {
        '/imprint/': '/impressum/',
      },
      messages: {},
    },
    {
      locale: `zh-CN`,
      prefix: `zh`,
      slugs: {},
      messages: {},
    },
  ],
  plugins: [],
};

describe('handleTrailingSlash', () => {
  it('should leave trailing slahes, when the option is set to always', () => {
    const expectation = handleTrailingSlash('https://example.com/', 'always');
    expect(expectation).toBe('https://example.com/');
  });

  it('should add trailing slahes, when the option is set to always', () => {
    const expectation = handleTrailingSlash('https://example.com', 'always');
    expect(expectation).toBe('https://example.com/');
  });

  it('should remove trailing slahes, when the option is set to never', () => {
    const expectation = handleTrailingSlash('https://example.com/', 'never');
    expect(expectation).toBe('https://example.com');
  });

  it('should not add trailing slahes, when the option is set to never', () => {
    const expectation = handleTrailingSlash('https://example.com', 'never');
    expect(expectation).toBe('https://example.com');
  });

  it('should return root paths', () => {
    const expectation = handleTrailingSlash('/', 'never');
    expect(expectation).toBe('/');
  });

  it('should return empty paths', () => {
    const expectation = handleTrailingSlash('', 'never');
    expect(expectation).toBe('');
  });

  it('should return empty paths', () => {
    const expectation = handleTrailingSlash('', 'never');
    expect(expectation).toBe('');
  });

  it('should return paths, when the option is set to ignore', () => {
    let expectation = handleTrailingSlash('https://example.com', 'ignore');
    expect(expectation).toBe('https://example.com');
    expectation = handleTrailingSlash('https://example.com/', 'ignore');
    expect(expectation).toBe('https://example.com/');
  });

  it('should default to always', () => {
    const expectation = handleTrailingSlash('https://example.com');
    expect(expectation).toBe('https://example.com/');
  });

  it('should never add trailing slashes to error pages', () => {
    let expectation = handleTrailingSlash('404.html', 'always');
    expect(expectation).toBe('404.html');
    expectation = handleTrailingSlash('https://example.com/403.html/403.html', 'always');
    expect(expectation).toBe('https://example.com/403.html/403.html');
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
    expect(prefixed).toBe('/it/');
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

describe('translatePagePaths', () => {
  it('returns an array of translated page paths', () => {
    const path = '/imprint';

    const pagePathTranslations = translatePagePaths(path, options);
    expect(pagePathTranslations).toEqual([
      { locale: 'en-US', path: '/imprint/' },
      { locale: 'de-CH', path: '/de/impressum/' },
      { locale: 'zh-CN', path: '/zh/imprint/' },
    ]);
  });

  describe('generatePageContextByPath', () => {
    const path = '/imprint';

    it('should generate the page context by path', () => {
      const expectation = generatePageContextByPath(path, options);
      expect(expectation).toMatchSnapshot();
    });

    it('should default to empty prefix', () => {
      const customOptions = { ...options, defaultLocale: 'fr-FR' };
      const expectation = generatePageContextByPath(path, customOptions);
      expect(expectation).toMatchSnapshot();
    });
  });
});
