import { customizeSitePageContext } from './customizeSitePageContext';

describe('customizeSitePageContext', () => {
  it('should call createTypes', () => {
    const argsMock: any = {
      actions: {
        createTypes: jest.fn(),
      },
    };
    customizeSitePageContext(argsMock);
    expect(argsMock.actions.createTypes).toHaveBeenCalled();
  });
});
