import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import EmptyPage from './layouts/EmptyPage';
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
import AirtableEmbedPage from "./sections/@dashboard/companies/AirtableEmbedPage";
import Tasks from "./pages/Tasks";
import Overview from "./pages/Overview";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'overview', element: <Overview /> },
        { path: 'tasks', element: <Tasks /> },
        { path: 'community', element: <User /> },
        { path: 'announcements', element: <Profile /> },
      ],
    },
    { path: '/companies',
      element: <DashboardLayout />,
      children: [
        { path: ':id', element: <Company />},
      ]
    },
    {
      path: '/termDocuments',
      element: <EmptyPage />,
      children: [
        { path: ':embedURL', element: <AirtableEmbedPage />},
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/overview" /> },
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
