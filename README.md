# gatsby-plugin-i18n-l10n

Providing i18n and l10n to Gatsby with `react-intl` and `react-helmet`. Besides translating pages and labels, you can also translate the slugs and paths and still link between translated sibling pages. The plugin builts on two dependencies:

- [**react-intl**](https://formatjs.io/docs/react-intl/): Wrapping the pages with a provider, which makes translation available throughout the app.
- [**react-helmet**](https://github.com/nfl/react-helmet): Injecting meta tags into the head element, which links translated sibling pages.

## Usage

1. Make sure the peer dependencies `"gatsby": "^4.x"`, `"react-helmet": "^6.1.x"` and `"react-intl": "^5.20.x"` are dependencies of your Gatsby project.
1. Install the plugin with `npm install gatsby-plugin-i18n-l10n` or `yarn add gatsby-plugin-i18n-l10n`.
1. Load and configure the plugin from your `gatsby-config.js` or `gatsby-config.ts`:

   ```typescript
   {
     resolve: `gatsby-plugin-i18n-l10n`,
     options: {
       // IETF BCP 47 language tag: default locale, which won't be prefixed
       defaultLocale: `de-CH`,
       // string: absolute site url
       siteUrl: `https://example.com`,
       // locales[]: all locales, which should be available
       locales: [
         {
           // IETF BCP 47 language tag of this language
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
     },
   }
   ```
