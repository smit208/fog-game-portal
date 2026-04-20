import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Once React has painted the first frame, fade out the inline loader.
// Using requestAnimationFrame twice guarantees the DOM has actually committed.
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    const loader = document.getElementById('app-loader');
    if (loader) loader.classList.add('hidden');
  });
});
