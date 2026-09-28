import {MenuItem} from 'primeng/api';

export const authRoutes: MenuItem[] = [
  {
    label: 'Administrateur',
    items: [
      {
        routerLink: '/profile',
        label: 'Mon profil',
      },

      {
        routerLink: '/user',
        label: 'Utilisateurs',
      },
      {
        routerLink: '/topic',
        label: 'Actialités',
      },
      {
        routerLink: '/photo-form',
        label: 'Album',
      },
    ],
  },
];
export const anonymousRoutes: MenuItem[] = [
  {
    label: 'Navigation',
    items: [
      {
        routerLink: '/home',
        label: 'Qui somme nous',
      },
      {
        routerLink: '/member',
        label: 'Nos membres',
      },
      {
        routerLink: '/album',
        label: 'Galerie',
      },
      {
        routerLink: '/content',
        label: 'EVENEMENTS',
      },
      {
        routerLink: '/partner',
        label: 'Partenaires',
      },
    ],
  },
];
