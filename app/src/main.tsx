import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './estilo/tokens.css';
import '@ds/components/bundle.css';
import './estilo/app.css';
import { App } from './App';

createRoot(document.getElementById('raiz')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
