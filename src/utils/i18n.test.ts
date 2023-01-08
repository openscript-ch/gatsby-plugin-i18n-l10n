import { createLocalePagesId, findClosestLocale, parseFilenameSuffix } from './i18n';

describe('findClosestLocale', () => {
  it('should match exact locale', () => {
    const locale = findClosestLocale('zh-CN', ['de-CH', 'en-US', 'zh-CN']);
    expect(locale).toBe('zh-CN');
  });

  it('should match languages to locale', () => {
    const locale = findClosestLocale('zh', ['de-CH', 'en-US', 'zh-CN']);
    expect(locale).toBe('zh-CN');
  });
});

describe('parseFilenameSuffix', () => {
  it('should estimate the language in a filename', () => {
    const { estimatedLocale } = parseFilenameSuffix('index.de.md', 'en');
    expect(estimatedLocale).toBe('de');
  });

  it('should estimate the exact locale in a filename', () => {
    const { estimatedLocale } = parseFilenameSuffix('index.de-CH.md', 'en');
    expect(estimatedLocale).toBe('de-CH');
  });

  it('should return the default locale if no locale was found in filename', () => {
    const { estimatedLocale } = parseFilenameSuffix('index.md', 'en');
    expect(estimatedLocale).toBe('en');
  });

  it('should return the filename without extensions, even when there is no locale', () => {
    const { filename } = parseFilenameSuffix('index.md', 'en');
    expect(filename).toBe('index');
  });

  it('should return the filename without extensions', () => {
    const { filename } = parseFilenameSuffix('index.en-US.md', 'en');
    expect(filename).toBe('index');
  });
});

describe('createLocalePageId', () => {
  it('should return the locale page id', () => {
    const localePageId = createLocalePagesId('/this/is/an/english-page');
    expect(localePageId).toBe('this.is.an.english-page');
  });
  it('should return the locale page id without prefix', () => {
    const localePageId = createLocalePagesId('/en/this/is/an/english-page', 'en');
    expect(localePageId).toBe('this.is.an.english-page');
  });
  it('should return index for index pages', () => {
    const localePageId = createLocalePagesId('/');
    expect(localePageId).toBe('index');
  });
  it('should return index for index pages without prefix', () => {
    const localePageId = createLocalePagesId('/en/', 'en');
    expect(localePageId).toBe('index');
  });
});
