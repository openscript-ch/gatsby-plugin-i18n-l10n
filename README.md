# gatsby-plugin-i18n-l10n

Providing i18n and l10n to Gatsby with react-intl and react-helmet. Besides translating pages and labels, you can also translate the slugs and paths and still link between translated sibling pages. The plugin builts on two dependencies:

 - [**react-intl**](https://formatjs.io/docs/react-intl/): Wrapping the pages with a provider, which makes translation available throughout the app.
 - [**react-helmet**](https://github.com/nfl/react-helmet): Injecting meta tags into the head element, which links translated sibling pages.

## Usage

1. Make sure the peer dependencies `"gatsby": "^4.0.x"`, `"react-helmet": "^6.1.x"` and `"react-intl": "^5.20.x"` are dependencies of your Gatsby project.
1. Install the plugin with `npm install gatsby-plugin-i18n-l10n` or `yarn add gatsby-plugin-i18n-l10n`.
1. Load and configure the plugin from your `gatsby-config.js` or `gatsby-config.ts`: 

   ```javascript
   {
     resolve: `gatsby-plugin-i18n-l10n`,
     options: {
       // default locale won't be prefixed
       defaultLocale: `de-CH`,
       locales: [
         {
           // IETF BCP 47 language tag
           locale: `en-US`,
           // prefix for this language
           prefix: `en`,
           slugs: {},
           // this messages will be handed over to react-intl and available throughout the website
           messages: {
             "language": "English"
           },
         },
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
