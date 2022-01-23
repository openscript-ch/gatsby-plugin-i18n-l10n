# gatsby-plugin-i18n-l10n

This plugin helps to internationalize and localize a Gatsby website. The plugin builts on two dependencies:

 - [**react-intl**](https://formatjs.io/docs/react-intl/): Wrapping the pages with a provider, which makes translation available throughout the app.
 - [**react-helmet**](https://github.com/nfl/react-helmet): Injecting meta tags into the head element, which links translated sibling pages.

## Usage

1. Make sure the peer dependencies `"gatsby": "^4.0.x"`, `"react-helmet": "^6.1.x"` and `"react-intl": "^5.20.x"` are dependencies of your Gatsby project.
