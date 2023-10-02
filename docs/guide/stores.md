# Stores

Esta SPA trabaja con los siguientes stores para simplificar la comunicación entre component en los puntos complejos. A constinuación se explica cada uno de ellos (se implementan dentro de su fichero js en la carpeta stores).

## Create

[create.js](src/store/create.js)

Este store se encarga de controlar los detalles más importantes de la creación de fichas, ya que hay algunos campos que tienen interelaciones complejas que son más fáciles de gestionar en base a un Vuex store que como cambios del schema del formulario.

Este store se encarga de:

- Controlar la carga del detalle
- Controla qué tipos de solicitante se pueden seleccionar
- Activa y desactiva el formulario de selección de solicitante en función de qué campos han sido rellenados.
- Definir si la respuesta puede ser introducida o si es necesaría.
- Guarda si los ficheros deben ser copiados desde otra ficha.
- Si está en modo edición o modo creación.
- Si hay datos de respuesta de fichas anteriores del solicitante.

Además, permite que otros componentes introduzcan los datos iniciales del solicitante, por ejemplo para buscar uno que ya exista. Es el caso de ariadna, que intenta fijar como solicitante a quién creó la instancia.

Más detalles sobre el flujo de creación en la página correspondiente.

## Masters

[create.js](src/store/masters.js)

Este store permite la carga de los listados maestros. Es solo un store de carga de datos no implementa lógica de negocio.

## Groups

[groups.js](src/store/groups.js)

Gestiona los datos de acceso del usuario, sus grupos y los permisos que tiene disponibles.

## Workflowfiles

[workflowFiles.js](src/store/masters.js)

Permite la gestión de ficheros para unifichas, ya que la selección de los mismos para la respuesta tiene un casuística complicada.

## Statemachine

[stateMachine.js](src/store/stateMachine.js)

Carga la definición de los procesos de la máquina de estados.

## Navigation

[navigation.js](src/store/navigation.js)

Controla el estado del menú de navegación.


## GeoBcn

[geobcn.js](src/store/geobcn.js)

Controla la carga de la librería externa de geobcn.


## Derivation

[derivation.js](src/store/derivation.js)

Store que facilita la carga de grupos seleccionables para la derivación, está pensado para la pantalla de administración de derivaciones donde se muestran muchos selectores de grupos que básicamente muestran los mismos datos, leyendolos de este store.

## Communication

[communication.js](src/store/communication.js)

Asiste en la carga de las comunicaciones de un ficha y su dibujado como una pantalla de chat.

## Features

[features.js](src/store/features.js)

Obtiene los datos de las máscaras de los atributos.


## Templates

[templates.js](src/store/templates.js)

Carga datos básicos para poder mostrar la pantalla de gestión de templates en el admin.