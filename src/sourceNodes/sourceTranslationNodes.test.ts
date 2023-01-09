import { PluginOptions } from 'gatsby';
import { sourceTranslationNodes } from './sourceTranslationNodes';

describe('sourceTranslationNodes', () => {
  it('should call createNode for each translation', () => {
    const argsMock: any = {
      actions: {
        createNode: jest.fn(),
      },
      createNodeId: jest.fn((value: string) => value),
      createContentDigest: jest.fn((value: object) => JSON.stringify(value)),
    };
    const optionsMock: PluginOptions = {
      defaultLocale: 'en-US',
      siteUrl: 'https://example.com',
      locales: [
        {
          locale: 'en-US',
          prefix: 'en',
          slugs: {},
          messages: {
            key: 'value',
          },
        },
        {
          locale: 'de-CH',
          prefix: 'de',
          slugs: {},
          messages: {
            key: 'wert',
          },
        },
        {
          locale: 'zh-CN',
          prefix: 'zh',
          slugs: {},
          messages: {
            key: '价值',
          },
        },
      ],
      plugins: [],
    };
    sourceTranslationNodes(argsMock, optionsMock);
    expect(argsMock.actions.createNode).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ key: 'key', message: 'value', locale: 'en-US' }),
    );
    expect(argsMock.actions.createNode).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ key: 'key', message: 'wert', locale: 'de-CH' }),
    );
    expect(argsMock.actions.createNode).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ key: 'key', message: '价值', locale: 'zh-CN' }),
    );
    expect(argsMock.createNodeId).toBeCalledTimes(3);
    expect(argsMock.createContentDigest).toBeCalledTimes(3);
  });
});
