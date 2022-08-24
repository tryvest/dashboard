import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import EmptyPage from '../layouts/EmptyPage';
//
import Profile from '../pages/Profile';
import User from '../pages/User';
import Login from '../pages/Login';
import BusinessLogin from '../pages/business/BusinessLogin';
import NotFound from '../pages/Page404';
import TryvestorRegister from '../pages/TryvestorRegister';
import Discover from '../pages/Discover';
import DashboardApp from '../pages/DashboardApp';
import { Founders, Landing } from '../pages/general/Landing';
import Company from '../pages/Company'
import AirtableEmbedPage from "../sections/@dashboard/companies/AirtableEmbedPage";
import Tasks from "../pages/Tasks";
import Overview from "../pages/Overview";
import Announcements from "../pages/Announcements";
import Community from "../pages/Community"
import BusinessHomePage from "../pages/business/BusinessHomePage";
import BusinessOverview from "../pages/business/BusinessOverview";
import BusinessCommunity from "../pages/business/BusinessCommunity";
import BusinessAnnouncements from "../pages/business/BusinessAnnouncements";
import Learn from "../pages/Learn";
import {CustomSelectRouter} from "./customselector"

// ----------------------------------------------------------------------

export function CustomRouter() {
  return useRoutes([
    {
      path: '/learn',
      element: <DashboardLayout />,
      children: [
        { path: ':id', element: <CustomSelectRouter tryvestorPage={<Learn />} /> },
      ]
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'overview', element: <CustomSelectRouter businessPage={<BusinessOverview />} tryvestorPage={<Overview />} /> },
        { path: 'home', element: <CustomSelectRouter businessPage={<BusinessHomePage />} /> },
        { path: 'tasks', element: <CustomSelectRouter tryvestorPage={<Tasks />} /> },
        { path: 'community', element: <CustomSelectRouter businessPage={<BusinessCommunity />} tryvestorPage={<Community />} /> },
        { path: 'announcements', element: <CustomSelectRouter businessPage={<BusinessAnnouncements />} tryvestorPage={<Announcements />} /> },
      ],
    },
    {
      path: '/companies',
      element: <DashboardLayout />,
      children: [
        { path: ':id', element: <CustomSelectRouter businessPage={<Company />} tryvestorPage={<Company />} /> },
      ]
    },
    {
      path: '/termDocuments',
      element: <EmptyPage />,
      children: [
        { path: ':embedURL', element: <CustomSelectRouter businessPage={<AirtableEmbedPage />} tryvestorPage={<AirtableEmbedPage />} /> },
      ]
    },
    {
      path: '/business',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <CustomSelectRouter businessPage={<Overview />} /> }
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/overview" /> },
        { path: 'login', element: <CustomSelectRouter businessPage={<BusinessLogin />} tryvestorPage={<Login />} /> },
        { path: 'register', element: <CustomSelectRouter businessPage={<TryvestorRegister />} tryvestorPage={<TryvestorRegister />} /> },
        { path: 'landing', element: <CustomSelectRouter businessPage={<Landing />} tryvestorPage={<Landing />} /> },
        { path: '404', element: <CustomSelectRouter businessPage={<NotFound />} tryvestorPage={<NotFound />} /> },
        { path: '*', element: <CustomSelectRouter businessPage={<Navigate to="/404" />} tryvestorPage={<Navigate to="/404" />} /> },
      ],
    },
    { path: '*', element: <CustomSelectRouter businessPage={<Navigate to="/404" replace />} tryvestorPage={<Navigate to="/404" replace />} /> },
  ]);
}





















// export function TryvestorRouter() {
//   return useRoutes([
//     {
//       path: '/',
//       element: <LogoOnlyLayout />,
//       children: [
//         { path: '/', element: <Navigate to="/dashboard/overview" /> },
//         { path: 'login', element: <Login /> },
//         { path: 'register', element: <TryvestorRegister /> },
//         { path: 'landing', element: <Landing />},
//         { path: '404', element: <NotFound /> },
//         { path: '*', element: <Navigate to="/404" /> },
//       ],
//     },
//   ]);
// }

// export function BusinessRouter() {
//   return useRoutes([
//     {
//       path: '/',
//       element: <LogoOnlyLayout />,
//       children: [
//         { path: '/', element: <Navigate to="/dashboard/overview" /> },
//         { path: 'login', element: <BusinessLogin /> },
//         { path: 'register', element: <TryvestorRegister /> },
//         { path: 'landing', element: <Landing />},
//         { path: '404', element: <NotFound /> },
//         { path: '*', element: <Navigate to="/404" /> },
//       ],
//     },
//   ]);
// }

// export function GenericRouter() {
//   return useRoutes([
//     {
//       path: '/',
//       element: <LogoOnlyLayout/>,
//       children: [
//         {path: '/', element: <Landing/>},
//         {path: '404', element: <NotFound/>},
//         {path: 'founder', element: <Founders/>},
//         {path: '*', element: <Navigate to="/"/>},
//         // {path: '*', element: <Navigate to="/404"/>},
//       ],
//     },
//     {
//       path: '/business',
//       element: <LogoOnlyLayout/>,
//       children: [
//         {path: 'login', element: <BusinessLogin/>},
//         {path: 'register', element: <TryvestorRegister/>},
//       ],
//     },
//     {
//       path: '/tryvestor',
//       element: <LogoOnlyLayout/>,
//       children: [
//         {path: 'login', element: <Login/>},
//         {path: 'register', element: <TryvestorRegister/>},
//       ],
//     },
//     {path: '*', element: <Navigate to="/" replace/>},
//     // {path: '*', element: <Navigate to="/404" replace/>},
//   ]);
// }
