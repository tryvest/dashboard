// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = {

    userSide: [
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


    ],
    companySide: [
      {
        title: 'business',
        path: '/business/app',
        icon: getIcon('ic:round-dashboard'),
      },
      {
        title: 'analytics',
        path: '/business/analytics',
        icon: getIcon('mdi:compass'),
      },
      {
        title: 'messages',
        path: '/business/messages',
        icon: getIcon('ic:baseline-message'),
      },
      {
        title: 'schedule',
        path: '/business/schedule',
        icon: getIcon('ic:baseline-person'),
      },
      {
        title: 'billing',
        path: '/business/billing',
        icon: getIcon('eva:lock-fill'),
      },


    ],

}

export default navConfig;
