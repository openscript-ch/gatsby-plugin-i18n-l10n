import { customizeSitePageContext } from './customizeSitePageContext';

describe('customizeSitePageContext', () => {
  it('should call createTypes', () => {
    const argsMock: any = {
      actions: {
        createTypes: jest.fn(),
      },
    };
    const optionsMock: any = {};
    const callbackMock = jest.fn();
    customizeSitePageContext(argsMock, optionsMock, callbackMock);
    expect(argsMock.actions.createTypes).toBeCalled();
  });
});
