# Dashboard

[El dashboard](../../src/pages/backoffice/dashboard.vue) es el punto de entrada de la aplicación, en esta sección explicaremos los detalles de los componentes que lo componente.

## Indicadores

Los usuarios cuyo grupo es un ámbito, verán además de los indicadores del grupo propio, unos indicadores globales para el ámbito. Los componentes están en [`components/iris-pages/records/charts`](../../src/components/iris-pages/records/charts).

Los gráficos están implementados con [`vue-chartjs`](https://vue-chartjs.org/guide/) con pequeñas customizaciones en el caso del gráfico de donut (sectores).

Los componentes son:

- [StateDoughnut](../../src/components/iris-pages/records/charts/StateDoughnut.vue): gráfico de sectores que clasifica las fichas por estado.
- [ProfileMonthActivity](../../src/components/iris-pages/records/charts/ProfileMonthActivity.vue): gráfico de actividad del perfil.
- [AmbitMonthActivity](../../src/components/iris-pages/records/charts/AmbitMonthActivity.vue): gráfico de actividad del ámbito.

## Notificaciones

[`Notifications.vue`](../../components/iris-pages/admin/notifications/Notifications.vue)

Mensajes importantes en las fichas que tramita el operador, se construyen a partir de las comunicaciones intermedias y las alertas de las fichas.

## Anuncios

[`Announcements.vue`](../../components/iris-pages/admin/Announcements.vue)

Los anunciones aparecen debajo y dan información importante sobre la herramienta y su operativa. Si un anuncio es importante aparece como popup.