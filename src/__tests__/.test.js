import React from 'react';
import { render, screen } from '@testing-library/react';
import { HsrCharacters } from '../frontend/hsrCharacters.tsx';

test('renders Welcome text', () => {
  render(<HsrCharacters />);

  // Check if the word "Welcome" is in the document
  const welcomeText = screen.getByText(/Welcome/i);  // Case-insensitive match
  expect(welcomeText).toBeInTheDocument();
});
