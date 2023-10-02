# Proceso de tramitación

Como hemos visto al trabajar la [pantalla de detalle](./records-detail.md), el componente **[Proceso](../../components/iris-pages/records/Process.vue)** implementa el flujo de tramitación de la ficha, adaptandola al tipo de proceso y su temática.

## Proceso

Cada temática tiene asociado un tipo de proceso que dice los pasos que debe seguir, en la documentación del backend se especifica como son dichos procesos, ya que el frontend es agnóstico, solo conoce los posibles estados y qué transición deben realizar, pero no conoce como están organizados los procesos concretos.

Para obtener este flujo, el frontend hace una llamada al backend para recuperar la especificación del proceso, quedando guardado en el store de [`stateMachine.js`](../../src/store/stateMachine.js). Por tanto, los componentes leen este store para saber qué proceso trabajan.

Dentro de los procesos hay acciones que son a nivel de ficha y a nivel de workflow, el componente **[Process.vue] (../../components/iris-pages/records/Process.vue)** se encarga de los que hacen referencia al workflow. El resto están marcados como acciones de la ficha y están fuera del scope del componente.

## Acciones (Transiciones de estado)

Los pasos que conoce el proceso se implementan como componentes que extienden de [`ProcessStepMixin.js`](../../src/components/iris-pages/records/process/ProcessStepMixin.js):

### Planificar

[`Plan`](../../src/components/iris-pages/records/process/Plan.vue)

Requiere introducir un comentario, y permite dar más información a través de campos opcionales.

### Resolver

[`Resolution`](../../src/components/iris-pages/records/process/Resolution.vue)

Muy similar a planificar, pero con un caso especial, si la temática es de cita previa requiere que se rellenen unos campos adicionales para describir la fecha, la hora y el lugar de la cita.

### Responder

[`src/components/iris-pages/records/process/ProcessAnswers.vue`](../../src/components/iris-pages/records/process/ProcessAnswers.vue)

Es el caso más complejo, ya que además de editar las respuestas en base a plantillas, este campo permite responder todas las fichas de un proceso. Dichas respuestas quedan agrupadas por canal de respuesta e idioma, de forma que el operador solo tiene que rellenar las diferentes combinaciones. Por ejemplo, si hay 20 fichas a responder y todas son en castellano y email, solo redactará una respuesta.

El componente `ProcessAnswers.vue` se encarga de hacer esta lógica, de forma que genera n instancias del componenten [`Answers.vue`](../../src/components/iris-pages/records/process/ProcessAnswer.vue).[`Answers.vue`](../../src/components/iris-pages/records/process/ProcessAnswer.vue) a su vez es el responsable de dar todas las funcionalidades de redacción de la respuesta.

Existen dos modos de [edición de respuesta](../../src/components/iris-pages/records/process/AnswerTextEditor.vue):

- [Email/Carta](../../src/components/form-generator/fieldWysiwyg.vue): que tienen un editor de texto rico para dar formato.
- [SMS](../../src/components/iris-pages/records/process/SmsEditor.vue): que solo permite texto sin formato.

Además, dispone de un [sistema búsqueda y mantenimiento de plantillas](../../src/components/iris-pages/templates/AnswerMaster.vue).

## Próximos pasos

[Proceso de la ficha](./reports.md)