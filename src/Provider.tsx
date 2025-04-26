import { Slide, ToastContainer } from 'react-toastify';
import { Router } from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const Provider = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position='bottom-right'
        className='customToast'
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
      />
      <Router />
    </QueryClientProvider>
  );
};
