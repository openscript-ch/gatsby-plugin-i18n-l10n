import { createContext, useContext } from 'react';
import { SitePageContext } from '../../types';

export const I18nL10nContext = createContext<SitePageContext>({});
export const useI18nL10nContext = () => useContext(I18nL10nContext);
