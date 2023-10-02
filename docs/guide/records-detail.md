# Detalle de fichas

El detalle de fichas está implementado en como una página de nuxt, que se encuntra en [`backoffice/records/_id.vue`](../../src/pages/backoffice/records/_id.vue). En esta sección explicaremos su estructura y los componentes que la dotan de funcionalidad.

## Secciones del detalle

Se combinan secciones HTML con otras implementadas con componentes propios por su lógica.

1. **Datos básicos**: dentro del propio componente.
2. **[Estado](../../components/pages/list/columns/RecordStateColumn.vue)**
3. **[Protocol](../../components/iris-pages/records/Protocol.vue)**: modal con el protocolo de la temática.
4. **[Mapa](../../components/iris-pages/records/maps/RecordCardMap.vue)**: ver la ficha en el mapa.
5. **[Datos de respuesta](../../components/iris-pages/records/detail/DetailAnswerData.vue)**
6. **[Datos del solicitante](../../components/iris-pages/records/detail/RecordCardApplicant.vue)**: solo se muestran si el usuario los pide al clickar.
7. **[Fichas de la multificha](../../components/iris-pages/records/multirecord/MultiRecordList.vue)**: sólo si es multificha.
8. **[Proceso](../../components/iris-pages/records/Process.vue)**: componente para la gestión de la ficha y avanzar su estado, aparece una vez validad la ficha.
9. **[Ficheros](../../components/iris-pages/records/files/Files.vue)**
10. **[Comunicaciones intermedias](../../components/iris-pages/records/communications/Communications.vue)**
11. **[Comentarios](../../components/iris-pages/records/InsertComment.vue)**
12. **[Trazabilidad](../../components/iris-pages/records/Traceability.vue)**: listado de acciones realizadas en la ficha.
13. **Acciones**
    1.  **[Validar](../../components/iris-pages/records/RecordCardValidate.vue)**
    2.  **[Anular](../../components/iris-pages/records/RecordCardCancel.vue)**
    3.  **[Fijar solicitante](../../components/iris-pages/records/process/SetApplicantForm.vue)**
    4.  **[Marcar urgencia](../../components/iris-pages/records/Urgency.vue)**
    5.  **[Crear multificha](../../components/iris-pages/records/multirecord/MultiRecordButton.vue)**
    6.  **[Reasignar](../../components/iris-pages/records/RecordCardReassignment.vue)**
    7.  **Cambiar temática**: enlace a la pantalla de cambiar temática.
14. **Acciones en background**
    1.  **[Bloquear la ficha](../../components/iris-pages/records/Block.vue)**: cuando entras a una ficha se asocia a tu nombre durante 10 minutos. Si entras a la ficha que trabaja otra persona te avisa. Si se acaba el tiempo, te pregunta si quieres seguir trabajandola para tener 10 minutos más.


## Versión modal

Para poder previsualizar sin cambiar de página, se ofrece una versión modal del detalle en [`RecordCardModal.vue`](../../src/components/iris-pages/records/RecordCardModal.vue).

## Próximos pasos

[Proceso de la ficha](./record-process.md)