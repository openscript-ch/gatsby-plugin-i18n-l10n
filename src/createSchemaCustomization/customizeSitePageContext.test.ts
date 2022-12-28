import { customizeSitePageContext } from './customizeSitePageContext';

describe('customizeSitePageContext', () => {
  it('should call createTypes', () => {
    const argsMock: any = {
      actions: {
        createTypes: jest.fn(),
      },
    };
    const optionsMock: any = {};
    customizeSitePageContext(argsMock, optionsMock);
    expect(argsMock.actions.createTypes).toBeCalled();
  });
});
