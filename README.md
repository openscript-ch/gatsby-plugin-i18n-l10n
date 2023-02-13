# gatsby-plugin-i18n-l10n

[![Codecov](https://img.shields.io/codecov/c/github/openscript-ch/gatsby-plugin-i18n-l10n)](https://app.codecov.io/gh/openscript-ch/gatsby-plugin-i18n-l10n) [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/openscript-ch/gatsby-plugin-i18n-l10n/ci.yml?branch=main)](https://github.com/openscript-ch/gatsby-plugin-i18n-l10n/actions/workflows/ci.yml) [![npm](https://img.shields.io/npm/v/gatsby-plugin-i18n-l10n)](https://www.npmjs.com/package/gatsby-plugin-i18n-l10n) [![npm](https://img.shields.io/npm/dm/gatsby-plugin-i18n-l10n)](https://www.npmjs.com/package/gatsby-plugin-i18n-l10n)

Providing i18n and l10n to Gatsby. Besides translating pages and Markdown files, you can also translate the slugs and paths and still link between translated sibling pages. Batteries like a language switcher component are included. The plugin is written in Typescript, has some tests and has only one peer dependency:

- [**react-intl**](https://formatjs.io/docs/react-intl/): Wrapping the pages with a provider, which makes translation available throughout the app.

## Features

- **Generates translated** versions of **pages**.
  - For example, if you have a page `src/pages/about.tsx` and the languages `en-US` and `de-CH` configured, then it will create an `en-US` and `de-CH` version of this page. Via the page context of the translated pages, you get to know the locale.
- **Adds fields** on MarkdownRemark and Mdx **nodes**.
- Puts **prefixes** into the page paths, but not when it's the **default locale**.
- **Picks up locale** from Markdown file names and provides it via custom fields in GraphQL.
  - It works with `gatsby-transformer-remark` and `gatsby-plugin-mdx`.
- Makes it easy to **navigate between the translations** of a page.
- Sets **meta tags** to provide locale information to crawlers and other machines.
- Provides **useful components** like `<LocalizedLink>` and `<LanguageSwitcher>`.
- Helps to **translate paths**, while keeping the possibility to navigate between the translations of a page.

## Usage

1. Make sure the packages `"gatsby": "^5.x"` and `"react-intl": "^6.x"` are dependencies of your Gatsby project.
1. Install the plugin with `npm install gatsby-plugin-i18n-l10n` or `yarn add gatsby-plugin-i18n-l10n`.
1. Load and configure the plugin from your `gatsby-config.js` or `gatsby-config.ts`:

   ```typescript
   {
     resolve: `gatsby-plugin-i18n-l10n`,
     options: {
       // string: IETF BCP 47 language tag: default locale, which won't be prefixed
       defaultLocale: `de-CH`,
       // string: absolute site url
       siteUrl: `https://example.com`,
       // locales[]: all locales, which should be available
       locales: [
         {
           // string: IETF BCP 47 language tag of this language
           locale: `en-US`,
           // string: prefix for this language, which will be used to prefix the url, if it's not the default locale
           prefix: `en`,
           // object: mapping of given urls (by filename) to translated urls, if no mapping exists, given url will be used
           slugs: {},
           // object: this messages will be handed over to react-intl and available throughout the website
           messages: {
             "language": "English"
           },
         },
         // another language
         {
           locale: `de-CH`,
           prefix: `de`,
           slugs: {
             '/products': '/produkte',
             '/products#donut-filled-with-jam': '/produkte#berliner',
             '/services/software-development': '/dienstleistungen/softwareentwicklung'
           },
           messages: {
             "language": "Deutsch"
           },
         },
       ],
       // omit certain path segments (relative directories)
       // be careful not to cause path collisions
       pathBlacklist: [
         '/pages' // /pages/products/gummibears becomes /products/gummibears
       ]
     },
   }
   ```

### `<LanguageSwitcher>`

With the built-in `<LanguageSwitcher>` component users can change between the locales. With `resolveLanguageName` prop the language names can be provided to the component.

```jsx
<LanguageSwitcher resolveLanguageName={(locale) => intl.formatMessage({ id: `languages.${locale}` })} />
```

### `<GenericLocalizedLink>`

With the built-in `<GenericLocalizedLink>` component it's possible to use other plugins, which modify Gatsbys `<Link>` component. Here is an example with [Gatsby Plugin Transition Link](https://www.gatsbyjs.com/plugins/gatsby-plugin-transition-link/):

```jsx
<GenericLocalizedLink to="/imprint">
  {(args) => (
    <TransitionLink
      to={args.to}
      exit={{
        trigger: ({ exit, node }) => this.interestingExitAnimation(exit, node),
        length: 1,
      }}
      entry={{
        delay: 0.6,
      }}
    >
      Go to page 2
    </TransitionLink>
  )}
</GenericLocalizedLink>
```

### `createPage()`

When you create pages programmatically with `createPage()` by default the page will only try to set the locale and prefix to the context. With the following options you can instruct the plugin to internationalize the context further:

- `referTranslations: string[]`: Refers translations for given locales.
- `adjustPath: boolean`: Add locale prefix and replaces slugs.

### GraphQL data layer integration

All translation messages are sourced to Gatsbys GraphQL data layer with `translation` and `allTranslation`. Here is an example GraphQL query:

```typescript
export const query = graphql`
  query SomePage($locale: String) {
    pageTitle: translation(locale: { eq: $locale }, key: { eq: "page.some.title" }) {
      message
    }
    pageDescription: translation(locale: { eq: $locale }, key: { eq: "page.some.description" }) {
      message
    }
  }
`;
```

## Development

1. **Clone** the project
1. **Open** the freshly cloned project with Visual Studio Code and [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).
1. **Install** the projects dependencies with `npm install`.
1. **Run** the tests with `npm test`.
1. **Install** the examples dependencies with `npm run example install`.
1. **Run** the example project with `npm run example start`.

## Alternatives

- [gatsby-theme-i18n](https://www.gatsbyjs.com/plugins/gatsby-theme-i18n)
- [gatsby-plugin-i18n](https://github.com/angeloocana/gatsby-plugin-i18n)
- [gatsby-plugin-intl](https://www.gatsbyjs.com/plugins/gatsby-plugin-intl)
