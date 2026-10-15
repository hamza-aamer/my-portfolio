import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/gelasio/500.css';
import '@fontsource/gelasio/600.css';
import '@fontsource-variable/schibsted-grotesk/wght.css';
import './styles.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
