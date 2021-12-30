import React from 'react';
import { IntlProvider } from 'react-intl';
import { SitePageContext, Translation, WrapPageElement } from '../types';
import I18nHead from './components/I18nHead';

export const PageContext = React.createContext<SitePageContext>({});

export const wrapPageElement: WrapPageElement = ({ element, props }, options) => {
  const pageContext = props.pageContext as SitePageContext;
  const translations = (props.pageContext.translations as Translation[]) || [];
  const locale = pageContext.locale ?? options.defaultLocale;
  const prefix = pageContext.prefix ?? options.locales.find(l => l.locale === locale)?.prefix;
  const currentMessages = options.locales.find(l => l.locale === locale)?.messages;

  if (currentMessages) {
    // Inject language names of all available languages into current messages
    options.locales.forEach(l => (currentMessages[`languages.${l.locale}`] = l.messages['language']));
  }

  return (
    <PageContext.Provider value={{ locale, prefix }}>
      <IntlProvider defaultLocale={options.defaultLocale} locale={locale} messages={currentMessages}>
        <I18nHead currentLocale={locale} translations={translations} pathname={props.location.pathname} />
        {element}
      </IntlProvider>
    </PageContext.Provider>
  );
};
