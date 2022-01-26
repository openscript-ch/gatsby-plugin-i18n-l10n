import { Link } from 'gatsby';
import { useI18nL10nContext } from '../contexts/I18nL10nContext';

type LanguageSwitcherProps = {
  className?: string;
  resolveLanguageName: (locale: string) => string;
};

export default function LanguageSwitcher({ className, resolveLanguageName }: LanguageSwitcherProps) {
  const context = useI18nL10nContext();

  return (
    <nav className={className}>
      <ul>
        {context.translations?.map((p) => (
          <li key={p.locale}>
            <Link to={p.path}>{resolveLanguageName(p.locale)}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
