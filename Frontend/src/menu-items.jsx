const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard/analytics'
        },
        {
          id: 'carrito',
          title: 'Carrito',
          type: 'item',
          icon: 'feather icon-home',
          url: '/carrito'
        },
        {
          id: 'producto',
          title: 'Productos',
          type: 'item',
          icon: 'feather icon-home',
          url: '/productos'
        }, 
        {
          id: 'usuario',
          title: 'Usuario',
          type: 'item',
          icon: 'feather icon-home',
          url: '/usuario'
        }, 
        {
          id: 'ingreso',
          title: 'Ingreso',
          type: 'item',
          icon: 'feather icon-home',
          url: '/ingreso'
        }
      ]
    },
    {
      id: 'utilities',
      title: 'Utilities',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'component',
          title: 'Component',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'button',
              title: 'Button',
              type: 'item',
              url: '/basic/button'
            },
            {
              id: 'badges',
              title: 'Badges',
              type: 'item',
              url: '/basic/badges'
            },
            {
              id: 'breadcrumb-pagination',
              title: 'Breadcrumb & Pagination',
              type: 'item',
              url: '/basic/breadcrumb-pagination'
            },
            {
              id: 'collapse',
              title: 'Collapse',
              type: 'item',
              url: '/basic/collapse'
            },
            {
              id: 'typography',
              title: 'Typography',
              type: 'item',
              url: '/basic/typography'
            },
            {
              id: 'tooltip-popovers',
              title: 'Tooltip & Popovers',
              type: 'item',
              url: '/basic/tooltip-popovers'
            }
          ]
        }
      ]
    },
    {
      id: 'auth',
      title: 'Authentication',
      type: 'group',
      icon: 'icon-pages',
      children: [
        
        {
          id: 'login',
          title: 'Login',
          type: 'item',
          icon: 'feather icon-log-in',
          url: '/auth/login-1',
          target: true,
          breadcrumbs: false
        },
        {
          id: 'reset-pass',
          title: 'Reset Password',
          type: 'item',
          icon: 'feather icon-unlock',
          url: '/auth/reset-password-1',
          target: true,
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'support',
      title: 'Support',
      type: 'group',
      icon: 'icon-support',
      children: [
        {
          id: 'sample-page',
          title: 'Sample Page',
          type: 'item',
          url: '/sample-page',
          classes: 'nav-item',
          icon: 'feather icon-sidebar'
        },
        {
          id: 'documentation',
          title: 'Documentation',
          type: 'item',
          icon: 'feather icon-help-circle',
          classes: 'nav-item',
          url: 'https://codedthemes.gitbook.io/gradient-able-react/',
          target: true,
          external: true
        }
      ]
    }
  ]
}; 

export const getMenuItems = () => {
  const isSuperuser = JSON.parse(localStorage.getItem('is_superuser')); // Retrieve and parse the value

  if (isSuperuser) {
    // Provide the full menu including admin-specific items if needed
    return menuItems;
  }

  // Filter menu items for regular users
  return {
    ...menuItems,
    items: menuItems.items.filter(
      (item) => !['dashboard', 'utilities', 'producto'].includes(item.id) // Exclude these items
    ),
  };
};

export default menuItems;
