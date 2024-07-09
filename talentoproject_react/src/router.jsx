import { createBrowserRouter } from 'react-router-dom';
import Login from './views/Login';
import Register from './views/Register';
import DefaultLayout from './components/DefaultLayout';
import GuestLayout from './components/GuestLayout';
import AdminLayout from './components/AdminLayout';
import Customer from './views/Customer';
import Performer from './views/Performer';
import Users from './views/Users';
import Reporting from './views/Reporting';
import Admin from './views/Admin';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: 'customer',
        element: <Customer />
      },
      {
        path: 'performer',
        element: <Performer />
      }
    ]
  },
  {
    path: '/',
    element: <AdminLayout />,
    children:[
      {
        path: 'reports',
        element: <Reporting/>
      },
      {
        path: 'users',
        element: <Users />
      },
      {
        path: 'admin',
        element: <Admin />
      }
    ]
  },
  {
    path : '/',
    element: <GuestLayout />,
    children: [
      {
        path : 'login',
        element: <Login />
      },
      {
        path : 'register',
        element: <Register />
      }
    ]
  },
]);

export default router;
