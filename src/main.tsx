import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.tsx';
import { store } from './app/store.ts';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')!).render(
   <Provider store={store}>
      <BrowserRouter>
         <App />
      </BrowserRouter>
   </Provider>
);
