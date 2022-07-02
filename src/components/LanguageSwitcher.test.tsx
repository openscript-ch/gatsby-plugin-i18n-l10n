import renderer from 'react-test-renderer';
import { I18nL10nContext } from '../contexts/I18nL10nContext';
import LanguageSwitcher from './LanguageSwitcher';

const locale = 'de-CH';
const prefix = 'en';
const translations = [
  { locale: 'en-US', path: '/imprint' },
  { locale: 'fr-FR', path: '/fr/imprimer' },
];
const context = { locale, prefix, translations };
const resolveLanguageName = (language: string) => {
  switch (language) {
    case 'en-US':
      return 'English';
    case 'de-CH':
      return 'Deutsch';
    case 'fr-FR':
      return 'Français';
    default:
      return 'Unknown';
  }
};

describe('<LanguageSwitcher />', () => {
  it('should generate a navigation of available languages', async () => {
    const component = renderer
      .create(
        <I18nL10nContext.Provider value={context}>
          <LanguageSwitcher resolveLanguageName={resolveLanguageName} />
        </I18nL10nContext.Provider>,
      )
      .toJSON();

    expect(component).toMatchInlineSnapshot(`
      <nav>
        <ul>
          <li>
            <a
              href="/imprint"
              onClick={[Function]}
              onMouseEnter={[Function]}
            >
              English
            </a>
          </li>
          <li>
            <a
              href="/fr/imprimer"
              onClick={[Function]}
              onMouseEnter={[Function]}
            >
              Français
            </a>
          </li>
        </ul>
      </nav>
    `);
  });
});
