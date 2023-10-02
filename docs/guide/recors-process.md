# Proceso de tramitación

Como hemos visto al trabajar la [pantalla de detalle](./records-detail.md), el componente **[Proceso](../../components/iris-pages/records/Process.vue)** implementa el flujo de tramitación de la ficha, adaptandola al tipo de proceso y su temática.

## Proceso

Cada temática tiene asociado un tipo de proceso que dice los pasos que debe seguir, en la documentación del backend se especifica como son dichos procesos, ya que el frontend es agnóstico, solo conoce los posibles estados y qué transición deben realizar, pero no conoce como están organizados los procesos concretos.

Para obtener este flujo, el frontend hace una llamada al backend para recuperar la especificación del proceso, quedando guardado en el store de [`stateMachine.js`](../../src/store/stateMachine.js). Por tanto, los componentes leen este store para saber qué proceso trabajan.

Dentro de los procesos hay acciones que son a nivel de ficha y a nivel de workflow, el componente **[Process.vue] (../../components/iris-pages/records/Process.vue)** se encarga de los que hacen referencia al workflow. El resto están marcados como acciones de la ficha y están fuera del scope del componente.

## Acciones (Transiciones de estado)

Los pasos que conoce el proceso se implementan como componentes que extienden de [`ProcessStepMixin.js`](../../src/components/iris-pages/records/process/ProcessStepMixin.js)

## Próximos pasos

[Proceso de la ficha](./reports.md)