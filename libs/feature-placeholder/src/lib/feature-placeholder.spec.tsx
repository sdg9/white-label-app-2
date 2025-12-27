import React from 'react';
import { render } from '@testing-library/react-native';

import FeaturePlaceholder from './feature-placeholder';

describe('FeaturePlaceholder', () => {
  it('should render successfully', () => {
    const { root } = render(<FeaturePlaceholder />);
    expect(root).toBeTruthy();
  });
});
