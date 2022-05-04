import React from 'react';
import {
  fireEvent,
  render,
  act,
  waitFor,
  cleanup,
} from 'react-native-testing-library';
import App from './App';
import {mockRandom, resetMockRandom} from 'jest-mock-random';

describe('App', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
    jest.clearAllTimers();
    resetMockRandom();
  });
  test('test when two same blocks are clicked', async () => {
    mockRandom([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]);
    const component = render(<App />);
    //click on 1st element i.e dog
    const getFourthValue = component.getByTestId('4');
    expect(getFourthValue).not.toBeNull();
    const getFourthValueText = component.queryByText('dog');
    expect(getFourthValueText).toBeNull();
    act(() => {
      fireEvent(getFourthValue, 'onPress');
    });
    const getFouthValueTextAfter = component.queryByText('dog');
    expect(getFouthValueTextAfter).not.toBeNull();
    //click on 11th element i.e dog
    const getThirdValue = component.getByTestId('3');
    expect(getThirdValue).not.toBeNull();
    const getThirdValueText = component.queryAllByText('dog');
    expect(getThirdValueText).toHaveLength(1);
    act(() => {
      fireEvent(getThirdValue, 'onPress');
    });
    const getThirdValueAfter = component.queryAllByText('dog');
    expect(getThirdValueAfter).toHaveLength(2);
    // blocks get closed after few seconds
    waitFor(() => {
      const closedDogValue = component.queryAllByText('dog');
      expect(closedDogValue).toHaveLength(2);
    });
  });
  test.only('two different blocks are clicked', () => {
    const component = render(<App />);
    //click on 1st element i.e dog
    const getFirstValue = component.getByTestId('1');
    expect(getFirstValue).not.toBeNull();
    const getFirstValueText = component.queryByText('dog');
    expect(getFirstValueText).toBeNull();
    act(() => {
      fireEvent(getFirstValue, 'onPress');
    });
    const getFirstValueTextAfter = component.queryByText('dog');
    expect(getFirstValueTextAfter).not.toBeNull();
    //click on 11th element i.e cat
    const getEleventhValue = component.getByTestId('11');
    expect(getEleventhValue).not.toBeNull();
    const getEleventhValueText = component.queryByText('cat');
    expect(getEleventhValueText).toBeNull();
    act(() => {
      fireEvent(getEleventhValue, 'onPress');
    });
    const getEventhValueAfter = component.queryByText('cat');
    expect(getEventhValueAfter).not.toBeNull();
    // blocks get closed after few seconds
    waitFor(() => {
      const closedDogValue = component.queryByText('dog');
      expect(closedDogValue).toBeNull();
      const closedCatValue = component.queryByText('cat');
      expect(closedCatValue).toBeNull();
    });
  });
});
