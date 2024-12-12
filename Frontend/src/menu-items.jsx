
import axiosInstance  from './utils/axios';

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
          url: '/app/dashboard/analytics',
          roles: [1] // Solo Administrador
        },
        {
          id: 'carrito',
          title: 'Carrito',
          type: 'item',
          icon: 'feather icon-shopping-cart',
          url: '/carrito',
          roles: [1, 2] // Administrador y Comprador
        },
        {
          id: 'producto',
          title: 'Productos',
          type: 'item',
          icon: 'feather icon-box',
          url: '/productos',
          roles: [1] // Solo Administrador
        },
        {
          id: 'usuario',
          title: 'Usuario',
          type: 'item',
          icon: 'feather icon-user',
          url: '/usuario',
          roles: [1] // Solo Administrador
        },
        {
          id: 'ingreso',
          title: 'Ingreso',
          type: 'item',
          icon: 'feather icon-log-in',
          url: '/ingreso',
          roles: [1, 2] // Administrador y Comprador
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
          breadcrumbs: false,
          roles: [1, 2] // Disponible para ambos
        }
      ]
    }
  ]
};

/**
 * Obtiene los elementos del menú según el rol del usuario
 * @returns {Object} Elementos del menú filtrados
 */
export const getMenuItems = async () => {
  try {
    // Obtener el grupo del usuario
    const response = await axiosInstance.get('/users/comprador/');
    const { grupo } = response.data;

    console.log('Usuario grupo:', grupo); // Log para verificar el grupo del usuario

    // Filtrar elementos del menú
    const filteredMenuItems = {
      ...menuItems,
      items: menuItems.items.map(group => ({
        ...group,
        children: group.children.filter(item => {
          const isAllowed = item.roles.includes(grupo);
          console.log(`Filtrando ${item.title}:`, {
            grupo,
            roles: item.roles,
            isAllowed
          });
          return isAllowed;
        })
      })).filter(group => group.children.length > 0)
    };

    console.log('Elementos de menú filtrados:', filteredMenuItems);

    return filteredMenuItems;
  } catch (error) {
    console.error('Error obteniendo grupo del usuario:', error);
    
    // En caso de error, devolver un menú vacío
    return {
      ...menuItems,
      items: []
    };
  }
};

export default menuItems;
