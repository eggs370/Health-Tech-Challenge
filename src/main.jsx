import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Your CSS file (make sure it exists)

import App from './App'; // Make sure your App component exists

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
