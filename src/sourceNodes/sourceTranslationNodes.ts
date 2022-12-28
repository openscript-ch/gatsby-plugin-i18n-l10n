import { SourceNodes } from '../../types';

const TRANSLATION_NODE_TYPE = 'Translation';

export const sourceTranslationNodes: SourceNodes = ({ actions, createContentDigest, createNodeId }, options) => {
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
