import { createBrowserRouter, RouterProvider } from 'react-router';
import App from '../App';

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
