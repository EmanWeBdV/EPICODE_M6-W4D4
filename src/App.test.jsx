import { render, screen } from '@testing-library/react';
import App from './App';

test('renders blog welcome title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Benvenuto sullo Strive Blog!/i);
  expect(linkElement).toBeInTheDocument();
});
