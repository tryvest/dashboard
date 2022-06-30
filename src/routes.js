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
import Announcements from "./pages/Announcements";
import Community from "./pages/Community"
import BusinessHomePage from "./pages/companySide/BusinessHomePage";
import BusinessOverview from "./pages/companySide/BusinessOverview";
import BusinessCommunity from "./pages/companySide/BusinessCommunity";
import BusinessAnnouncements from "./pages/companySide/BusinessAnnouncements";
import Learn from "./pages/Learn";

// ----------------------------------------------------------------------

export function TryvestorRouter() {
  return useRoutes([
    {
      path: '/learn',
      element: <DashboardLayout />,
      children: [
        { path: ':id', element: <Learn />},
      ]
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'overview', element: <Overview /> },
        { path: 'tasks', element: <Tasks /> },
        { path: 'community', element: <Community /> },
        { path: 'announcements', element: <Announcements /> },
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
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

export function BusinessRouter() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'overview', element: <BusinessOverview /> },
        { path: 'home', element: <BusinessHomePage /> },
        { path: 'community', element: <BusinessCommunity /> },
        { path: 'announcements', element: <BusinessAnnouncements /> },
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
        { path: 'app', element: <Overview />}
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
