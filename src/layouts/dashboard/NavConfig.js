// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = {

    userSide: [
      {
        title: 'overview',
        path: '/dashboard/overview',
        icon: getIcon('ic:round-dashboard'),
      },
      {
        title: 'tasks',
        path: '/dashboard/tasks',
        icon: getIcon('fluent:tasks-app-28-filled'),
      },
      {
        title: 'community',
        path: '/dashboard/community',
        icon: getIcon('jam:messages-f'),
      },
      {
        title: 'announcements',
        path: '/dashboard/announcements',
        icon: getIcon('fluent:megaphone-loud-24-filled'),
      },


    ],
    businessSide: [
      {
        title: 'overview',
        path: '/dashboard/overview',
        icon: getIcon('ic:round-dashboard'),
      },
      {
        title: 'Your Home Page',
        path: '/dashboard/home',
        icon: getIcon('mdi:compass'),
      },
      {
        title: 'community',
        path: '/dashboard/community',
        icon: getIcon('ic:baseline-message'),
      },
      {
        title: 'announcements',
        path: '/dashboard/announcements',
        icon: getIcon('ic:baseline-person'),
      },
    ],

}

export default navConfig;
