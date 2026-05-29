import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import App from './App';

test('renders shop name in navigation', () => {
  render(
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  );
  expect(screen.getByText(/розовое яблоко/i)).toBeInTheDocument();
});
