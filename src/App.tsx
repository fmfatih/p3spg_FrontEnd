import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from '@mui/system';
import { theme } from './common/theme';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/Router';
import { RecoilRoot } from 'recoil';
import { Snackbar } from './components/atoms/Snackbar';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <>
            <RouterProvider router={router} />
            <Snackbar />
          </>
        </ThemeProvider>
      </RecoilRoot>
    </QueryClientProvider>
  );
}

export default App;
