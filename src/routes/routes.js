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
import Discover from '../pages/discover/Discover';
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
import PlaidButton from "../utils/plaid/plaid-button";

// ----------------------------------------------------------------------

export function CustomRouter() {
  return useRoutes([
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        // { path: '/', element: <Landing /> },
        { path: '/', element: <PlaidButton /> },
        { path: '*', element: <CustomSelectRouter /> },
      ],
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'overview', element: <CustomSelectRouter businessPage={<BusinessOverview />} tryvestorPage={<Overview />} /> },
        { path: 'discover', element: <CustomSelectRouter businessPage={<Discover />} tryvestorPage={<Discover />} unauthPage={<Discover />} /> },
        { path: 'home', element: <CustomSelectRouter businessPage={<BusinessHomePage />} /> },
        { path: 'tasks', element: <CustomSelectRouter tryvestorPage={<Tasks />} /> },
        { path: 'community', element: <CustomSelectRouter businessPage={<BusinessCommunity />} tryvestorPage={<Community />} /> },
        { path: 'announcements', element: <CustomSelectRouter businessPage={<BusinessAnnouncements />} tryvestorPage={<Announcements />} /> },
        { path: '*', element: <CustomSelectRouter /> },
      ],
    },
    {
      path: '/companies',
      element: <DashboardLayout />,
      children: [
        { path: ':id', element: <CustomSelectRouter businessPage={<Company />} tryvestorPage={<Company />} unauthPage={<Company />} /> },
        { path: '*', element: <CustomSelectRouter /> },
      ]
    },
    {
      path: '/termDocuments',
      element: <EmptyPage />,
      children: [
        { path: ':embedURL', element: <CustomSelectRouter businessPage={<AirtableEmbedPage />} tryvestorPage={<AirtableEmbedPage />} /> },
        { path: '*', element: <CustomSelectRouter /> },
      ]
    },
    {
      path: '/business',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <CustomSelectRouter businessPage={<Overview />} /> },
        { path: '*', element: <CustomSelectRouter /> },
      ],
    },
    {
      path: '/tryvestor',
      element: <LogoOnlyLayout />,
      children: [
        // { path: '/', element: <CustomSelectRouter businessPage={<Navigate to="/businessoverview" />} tryvestorPage={<Navigate to="/tryvestoroverview" />} /> },
        { path: 'login', element: <CustomSelectRouter businessPage={<Navigate to="/dashboard/overview" replace/>} tryvestorPage={<Navigate to="/dashboard/overview" replace />} unauthPage={<Login />}/> },
        { path: 'register', element: <CustomSelectRouter businessPage={<Navigate to="/dashboard/overview" replace/>} tryvestorPage={<Navigate to="/dashboard/overview" replace/> } unauthPage={<TryvestorRegister />} /> },
        { path: '*', element: <CustomSelectRouter /> },
      ],
    },
    {
      path: '/business',
      element: <LogoOnlyLayout />,
      children: [
        // { path: '/', element: <CustomSelectRouter businessPage={<Navigate to="/businessoverview" />} tryvestorPage={<Navigate to="/tryvestoroverview" />} /> },
        { path: 'login', element: <CustomSelectRouter businessPage={<Navigate to="/dashboard/overview" replace/>} tryvestorPage={<Navigate to="/dashboard/overview" replace />} unauthPage={<BusinessLogin />}/> },
        // { path: 'register', element: <CustomSelectRouter businessPage={<Navigate to="/dashboard/overview" replace/>} tryvestorPage={<Navigate to="/dashboard/overview" replace />} unauthPage={<BusinessRegister />}/> },
        { path: '*', element: <CustomSelectRouter /> },
      ],
    },
    { path: '*', element: <CustomSelectRouter /> },
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
