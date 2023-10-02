# Permisos y auth

La gestión de los permisos se implementa con dos partes: adaptando la interfaz de IRIS2 en función de los permisos de usuario y reaccionando a las respuestas del servidor que indican que un determinado usuario no tiene permisos.

## Permisos

El listado de permisos que se fijan de alguna de forma en la SPA, ya sea para controlar navegación o visibilidad de secciones, está dentro de la clase [`Permission.js`](../../src/assets/js/iris2/Permissions.js). Estos permisos se utilizan de dos formas en la SPA:

**En la navegación**

```javascript
{
  title: 'navigation_records',
  icon: 'file-invoice',
  children: [],
  routerLinkOps: {
    name: 'backoffice-records',
  },
  permission: Permissions.RECORD.SEARCH, // DEFINIR EL PERMISO
}
```

En los menús solo aparecerán los items para los que tienes permisos.

**En las pantallas**

Las pantallas base de IRIS2 permiten setear la prop `permission`. Por ejemplo:

```javascript
permission: {
  type: String,
  required: false,
  default: Permissions.RECORD.CREATE_TWITTER,
}
```
## Carga de permisos

Los permisos se cargan al iniciar la aplicación, el flujo de carga está controlado por el [store](../../src/store/groups.js) y por el componente encargado de iniciar el flujo, [GroupError](../../src/components/iris-pages/groups/GroupError.vue).

## Errores en las peticiones

Los diferentes componentes capturan los errores de las peticiones HTTP y los muestran con la ayuda de [`HttpError`](../../src/components/pages/HttpError.vue).

## Próximos pasos

[COMPONENTES IRIS: ADMIN Y SOPORTE](./admin.md)