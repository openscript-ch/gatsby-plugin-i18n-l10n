import { findClosestLocale, parseFilename } from './i18n';

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

describe('readFilename', () => {
  it('should estimate the language in a filename', () => {
    const { estimatedLocale } = parseFilename('index.de.md', 'en');
    expect(estimatedLocale).toBe('de');
  });

  it('should estimate the exact locale in a filename', () => {
    const { estimatedLocale } = parseFilename('index.de-CH.md', 'en');
    expect(estimatedLocale).toBe('de-CH');
  });

  it('should return the default locale if no locale was found in filename', () => {
    const { estimatedLocale } = parseFilename('index.md', 'en');
    expect(estimatedLocale).toBe('en');
  });

  it('should return the filename without extensions, even when there is no locale', () => {
    const { filename } = parseFilename('index.md', 'en');
    expect(filename).toBe('index');
  });

  it('should return the filename without extensions', () => {
    const { filename } = parseFilename('index.en-US.md', 'en');
    expect(filename).toBe('index');
  });
});
