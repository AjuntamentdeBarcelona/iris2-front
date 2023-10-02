# Administración y soporte

La administración es una sección sencilla basada en cruds, mientras que la sección de soporte es principalmente visualización con algunas opciones de edición de contenido.

## Administración

La administración se dividen en cinco secciones:

- [`Configuración`](../../src/pages/backoffice/admin/configuration.vue): variables de configuración de IRIS editables por el usuario.
- [`Configuración de fichas`](../../src/pages/backoffice/admin/records): temáticas, canales de entrada, soporte y otros elementos que afectan al alta de fichas.
- [`Gestión de operadores`](../../src/pages/backoffice/admin/access): configuración de usuarios, grupos y accesos.
- [`Maestros`](../../src/pages/backoffice/admin/masters): datos base de la aplicación.
- [`Anuncios`](../../src/pages/backoffice/admin/announcements): publicación de los anuncios que aparecen en el dashboard.
- [`Solicitantes`](../../src/pages/backoffice/admin/applicant): consulta y edición de solicitantes.
- [`Seguimiento de procesos`](../../src/pages/backoffice/admin/batch): utilidades para seguir la ejecución de los batches y validar su contenido.

De la administración podemos destacar el formulario de edición de temática como el más complejo: [DetailEditForm](../../src/components/iris-pages/admin/DetailEditForm.vue). También el de configuración [`Configuración`](../../src/pages/backoffice/admin/configuration.vue).

La [sección de edición de templates](../../src/pages/backoffice/admin/records/templates/index.vue) incluye una tabla para poder trabajar de forma fácil qué plantilla corresponde a cada tipo de ficha.

Merece la pena destacar que la sección de [`Solicitantes`](../../src/pages/backoffice/admin/applicant) reutiliza los componentes de edición de solicitantes creados en el alta.

## Soporte

[Dentro del paquete support.](../../src/pages/backoffice/support/index.vue)

- [`FAQs`](../../components/iris-pages/support/FaqSupportList): preguntas y respuestas rápidas.
- [`Glossario`](../../components/iris-pages/support/GlossarySupport): definiciones estilo diccionario organizadas por letra.
- [`Documentos`](../../components/iris-pages/support/DocsSupport): listado de documentos y enlaces externos
- [`VideoSupport`](../../components/iris-pages/support/VideoSupport): enlaces a videos de youtube con formaciones.
- [`NewsSupport`](../../components/iris-pages/support/NewsSupport): noticias y novedades sobre los materiales de soporte.

## Próximos pasos

[CREACIÓN FICHA](./record-create.md)