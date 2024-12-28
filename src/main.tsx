import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';
import 'leaflet/dist/leaflet.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
      <link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
/>
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
/>
    </QueryClientProvider>
  </Provider>
);