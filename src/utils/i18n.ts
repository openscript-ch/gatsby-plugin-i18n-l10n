const FILENAME_SUFFIX_PATTERN = /^([^.]+)\.?(.*)?(?=\.\w+)/;

export function findClosestLocale(locale: string, locales: string[]) {
  if (locale.length === 5) {
    return locales.find((l) => l === locale);
  }
  return locales.find((l) => l.indexOf(locale) !== -1);
}

export const parseFilenameSuffix = (name: string, defaultLocale: string) => {
  const nameMatch = name.match(FILENAME_SUFFIX_PATTERN);
  const filename = nameMatch && nameMatch[1] ? nameMatch[1] : name;
  const estimatedLocale = nameMatch && nameMatch[2] ? nameMatch[2] : defaultLocale;

  return { filename, estimatedLocale };
};
