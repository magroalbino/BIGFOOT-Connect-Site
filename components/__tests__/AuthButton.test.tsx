import { render, screen } from '@testing-library/react';
import AuthButton from '../AuthButton';
test('renders sign in button when unauthenticated', () => {
  render(<AuthButton />);
  expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
});
