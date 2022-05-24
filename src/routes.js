import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Profile from './pages/Profile';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Discover from './pages/Discover';
import DashboardApp from './pages/DashboardApp';
import Landing from './pages/companySide/Landing';
import Company from './pages/Company'

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'discover', element: <Discover /> },
        { path: 'messages', element: <User /> },
        { path: 'profile', element: <Profile /> },
      ],
    },
    { path: '/companies',
      element: <DashboardLayout />,
      children: [
        { path: ':id', element: <Company />},
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'landing', element: <Landing />},
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '/business',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp />}
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
