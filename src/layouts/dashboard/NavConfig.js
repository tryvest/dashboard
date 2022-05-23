// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('ic:round-dashboard'),
  },
  {
    title: 'discover',
    path: '/dashboard/discover',
    icon: getIcon('mdi:compass'),
  },
  {
    title: 'messages',
    path: '/dashboard/messages',
    icon: getIcon('ic:baseline-message'),
  },
  {
    title: 'profile',
    path: '/dashboard/profile',
    icon: getIcon('ic:baseline-person'),
  },
  {
    title: 'login',
    path: '/login',
    icon: getIcon('eva:lock-fill'),
  },
  {
    title: 'register',
    path: '/register',
    icon: getIcon('eva:person-add-fill'),
  },

];

export default navConfig;
