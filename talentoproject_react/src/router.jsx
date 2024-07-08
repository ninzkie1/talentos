import {createBrowserRouter} from 'react-router-dom'
import Login from './views/Login'
import Register from './views/Register'
import DefaultLayout from './components/DefaultLayout'
import GuestLayout from './components/GuestLayout'
import Admin from './views/Admin'
import AdminLayout from './components/AdminLayout'
import Customer from './views/Customer'
import Performer from './views/Performer'


const router = createBrowserRouter ([
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
       },
        ]
    },
    {
        path: '/',
        element: <AdminLayout />,
        children:[
            {
            
                path: 'admin',
                element: <Admin />
               
        },
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