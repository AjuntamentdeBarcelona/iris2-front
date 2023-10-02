# Navegación

El menú de navegación está definido como una estructura json en forma de árbol. Se puede encontrar en [Navigation.js](../../src/assets/js/iris2/Navigation.js).

Por ejemplo:

```javascript
{
    title: 'navigation_admin',
    icon: 'cogs',
    routerLinkOps: {
      name: 'backoffice-admin',
    },
    checkChildPermission: true,
    children: [
      {
        title: 'navigation_configuration',
        routerLinkOps: {
          name: 'backoffice-admin-configuration',
          query: { category: 7 },
        },
        children: [],
        permission: Permissions.APP.ADMIN,
      }
    ]
}
```

Los items del menú solo se muestran si el usuario tiene los [permisos](./auth.md) correspodientes.

## Próximos pasos

[AUTH Y PERMISOS](./auth.md)