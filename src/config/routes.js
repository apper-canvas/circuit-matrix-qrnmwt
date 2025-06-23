import BoardView from '@/components/pages/BoardView';
import ProjectSettings from '@/components/pages/ProjectSettings';
import Timeline from '@/components/pages/Timeline';
import Team from '@/components/pages/Team';

export const routes = {
  board: {
    id: 'board',
    label: 'Board',
    path: '/',
    icon: 'LayoutGrid',
    component: BoardView
  },
  timeline: {
    id: 'timeline',
    label: 'Timeline',
    path: '/timeline',
    icon: 'Calendar',
    component: Timeline
  },
  team: {
    id: 'team',
    label: 'Team',
    path: '/team',
    icon: 'Users',
    component: Team
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: ProjectSettings
  }
};

export const routeArray = Object.values(routes);