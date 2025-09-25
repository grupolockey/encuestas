import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza el formulario de login', () => {
  render(<App />);
  const heading = screen.getByText(/iniciar sesión/i);
  expect(heading).toBeInTheDocument();
});
