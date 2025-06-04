import './index.css';
import React from 'react';
import AppRouter from './router';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<AppRouter />
			<Toaster />
		</QueryClientProvider>
	</React.StrictMode>
);
