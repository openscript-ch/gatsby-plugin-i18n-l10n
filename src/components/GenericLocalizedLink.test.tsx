import { Link } from 'gatsby';
import { IntlProvider } from 'react-intl';
import renderer from 'react-test-renderer';
import { I18nL10nContext } from '../contexts/I18nL10nContext';
import GenericLocalizedLink from './GenericLocalizedLink';

const defaultLocale = 'en-US';
const locale = 'de-CH';
const prefix = 'de';
const translations = [
  { locale: 'en-US', path: '/imprint' },
  { locale: 'fr-FR', path: '/fr/imprimer' },
];
const context = { locale, prefix, translations };
const contextWithoutPrefix = { locale, translations };
const currentMessages = {
  '/imprint': '/impressum',
};

describe('<LocalizedLink />', () => {
  it('should generate a navigation of available languages', async () => {
    const component = renderer
      .create(
        <I18nL10nContext.Provider value={context}>
          <IntlProvider defaultLocale={defaultLocale} locale={locale} messages={currentMessages}>
            <GenericLocalizedLink to="/imprint">{(args) => <Link to={args.to}>Impressum</Link>}</GenericLocalizedLink>
          </IntlProvider>
        </I18nL10nContext.Provider>,
      )
      .toJSON();

    expect(component).toMatchInlineSnapshot(`
      <a
        href="/de/impressum/"
        onClick={[Function]}
        onMouseEnter={[Function]}
      >
        Impressum
      </a>
    `);
  });
  it('should generate a navigation of available languages with no slug available', async () => {
    const component = renderer
      .create(
        <I18nL10nContext.Provider value={context}>
          <IntlProvider defaultLocale={defaultLocale} locale={locale} messages={currentMessages}>
            <GenericLocalizedLink to="/contact">{(args) => <Link to={args.to}>Kontakt</Link>}</GenericLocalizedLink>
          </IntlProvider>
        </I18nL10nContext.Provider>,
      )
      .toJSON();

    expect(component).toMatchInlineSnapshot(`
      <a
        href="/de/contact/"
        onClick={[Function]}
        onMouseEnter={[Function]}
      >
        Kontakt
      </a>
    `);
  });
  it('should generate a navigation of available languages with default locale', async () => {
    const component = renderer
      .create(
        <I18nL10nContext.Provider value={contextWithoutPrefix}>
          <IntlProvider defaultLocale={defaultLocale} locale="en-US" messages={currentMessages}>
            <GenericLocalizedLink to="/contact">{(args) => <Link to={args.to}>Contact</Link>}</GenericLocalizedLink>
          </IntlProvider>
        </I18nL10nContext.Provider>,
      )
      .toJSON();

    expect(component).toMatchInlineSnapshot(`
      <a
        href="/contact"
        onClick={[Function]}
        onMouseEnter={[Function]}
      >
        Contact
      </a>
    `);
  });
  it('should generate a navigation of available languages with default locale', async () => {
    const component = renderer
      .create(
        <I18nL10nContext.Provider value={context}>
          <IntlProvider defaultLocale={defaultLocale} locale="en-US" messages={currentMessages}>
            <GenericLocalizedLink to="/">{(args) => <Link to={args.to}>Home</Link>}</GenericLocalizedLink>
          </IntlProvider>
        </I18nL10nContext.Provider>,
      )
      .toJSON();

    expect(component).toMatchInlineSnapshot(`
      <a
        aria-current="page"
        className=""
        href="/"
        onClick={[Function]}
        onMouseEnter={[Function]}
        style={{}}
      >
        Home
      </a>
    `);
  });
});
