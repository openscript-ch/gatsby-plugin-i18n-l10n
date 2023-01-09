import { PluginOptions, SourceNodesArgs } from 'gatsby';

const TRANSLATION_NODE_TYPE = 'Translation';

export const sourceTranslationNodes = ({ actions, createContentDigest, createNodeId }: SourceNodesArgs, options: PluginOptions) => {
  const { createNode } = actions;

  options?.locales.forEach((l) => {
    Object.entries(l.messages).forEach(([key, message]) => {
      const translation = { key, message, locale: l.locale };
      createNode({
        ...translation,
        id: createNodeId(`${TRANSLATION_NODE_TYPE}${l.locale}${key}`),
        internal: { type: TRANSLATION_NODE_TYPE, contentDigest: createContentDigest(translation) },
      });
    });
  });
};
