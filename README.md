# ADHD Ladder

ADHD Ladder es una aplicación web diseñada para ayudar a las personas a organizar sus actividades, desarrollar hábitos saludables y visualizar su progreso personal mediante un sistema de pequeñas metas diarias.

El proyecto está inspirado en las dificultades de organización, motivación y constancia que pueden experimentar las personas con TDAH. Su propósito es ofrecer una experiencia sencilla, visual e intuitiva, en la que cada pequeño logro represente un paso hacia un objetivo mayor.

ADHD Ladder no pretende sustituir la atención médica ni realizar diagnósticos.

## Concepto

La aplicación utiliza la escalera como metáfora del crecimiento personal. En lugar de enfocarse únicamente en grandes objetivos, propone avanzar mediante pequeñas acciones que puedan realizarse de manera constante.

El sistema se divide en cuatro secciones principales:

### Life Ladder

Representa el progreso general del usuario. Centraliza los logros de Activities y Learning, muestra la racha de días consecutivos y presenta una frase motivacional diaria obtenida mediante una API externa.

### Activities Ladder

Permite organizar actividades personales, establecer pequeñas metas y registrar su cumplimiento diario.

### Learning Ladder

Está orientada al aprendizaje continuo y al desarrollo de nuevas habilidades. Comparte la mecánica de Activities, pero mantiene sus objetivos independientes.

### Health

Permite registrar tres aspectos fundamentales del bienestar diario:

- Nutrition
- Sleep
- Movement

Su sistema de cuatro colores representa el cumplimiento de los objetivos diarios y considera el estado de salud del día anterior.

El estado de Health también influye en la continuidad de la racha personal, incentivando un equilibrio entre productividad y bienestar.

## Funcionalidades

- Registro e inicio de sesión.
- Rutas públicas y privadas.
- Gestión de actividades y objetivos de aprendizaje.
- Registro de logros diarios.
- Visualización del progreso personal.
- Sistema de rachas.
- Indicadores visuales de bienestar.
- Frases motivacionales mediante una API externa.
- Diseño adaptable a dispositivos móviles, tabletas y computadoras.
- Componentes reutilizables y estado compartido.

## Tecnologías

### Frontend

- HTML5
- CSS3
- JavaScript
- TypeScript
- React
- React Router
- Vite
- Fetch API

### Backend

- Node.js
- Express
- TypeScript

### Base de datos y autenticación

Arquitectura seleccionada para la segunda etapa:

- MongoDB Atlas
- Mongoose
- bcrypt
- JSON Web Tokens (JWT)

### Herramientas de desarrollo

- Git
- GitHub
- npm Workspaces
- ESLint
- Prettier
- Visual Studio Code

### API externa

- DummyJSON — Obtención de frases motivacionales.

## Arquitectura

El proyecto utiliza una estructura Full Stack que separa las responsabilidades del cliente y del servidor dentro de un mismo repositorio.

    project-adhd-ladder/
    ├── client/
    │   ├── public/
    │   ├── src/
    │   │   ├── app/
    │   │   ├── components/
    │   │   ├── config/
    │   │   ├── context/
    │   │   ├── hooks/
    │   │   ├── images/
    │   │   ├── pages/
    │   │   ├── styles/
    │   │   ├── types/
    │   │   └── utils/
    │   └── package.json
    ├── server/
    │   ├── src/
    │   │   ├── middleware/
    │   │   ├── routes/
    │   │   ├── utils/
    │   │   └── app.ts
    │   └── package.json
    ├── docs/
    ├── AGENTS.md
    ├── package.json
    └── README.md

El cliente se encarga de la presentación, la interacción y la experiencia del usuario.

El servidor se encarga de la API, la validación de datos y el manejo centralizado de errores. Durante la segunda etapa también asumirá la autenticación, la autorización, la lógica de negocio y la comunicación con la base de datos.

Esta separación permite desarrollar, verificar y mantener ambas partes de manera independiente, mientras npm Workspaces facilita la administración del proyecto desde la raíz del repositorio.

## Evolución y decisiones arquitectónicas

ADHD Ladder comenzó como una aplicación Frontend desarrollada con React y TypeScript. Inicialmente se seleccionó Supabase para explorar una arquitectura relacional con PostgreSQL, aprovechando sus servicios de autenticación y persistencia.

Durante el desarrollo se incorporó un servidor Express y se reevaluaron las responsabilidades de cada tecnología. Finalmente, se decidió migrar hacia MongoDB Atlas y Mongoose, junto con un sistema de autenticación propio mediante bcrypt y JWT.

Esta decisión respondió a tres necesidades: consolidar los conocimientos adquiridos durante el bootcamp, demostrar la implementación de un Backend completo y cumplir con los requisitos académicos dentro del plazo disponible.

La evolución del proyecto permitió comparar diferentes modelos de persistencia, comprender las ventajas de los servicios administrados y reconocer la importancia de seleccionar tecnologías según el contexto, las necesidades y los recursos de cada proyecto.

## Principios de desarrollo

El proyecto busca mantener una arquitectura sencilla, comprensible y fácil de extender, evitando incorporar complejidad que no aporte valor al producto.

Entre los principios aplicados se encuentran:

- Separación de responsabilidades.
- Reutilización de componentes y funciones.
- Estado compartido mediante React Context.
- Tipado estático mediante TypeScript.
- Centralización de constantes y configuraciones.
- Prevención de duplicaciones innecesarias.
- Manejo centralizado de errores.
- Diseño responsive.
- Validación incremental de funcionalidades.
- Control de versiones mediante commits específicos y descriptivos.

La implementación prioriza soluciones concretas para necesidades reales, evitando tanto la duplicación innecesaria como las abstracciones prematuras.

## Metodología de trabajo

ADHD Ladder es un proyecto de desarrollo individual.

El desarrollador es responsable de las decisiones de producto, el diseño, la arquitectura, la implementación, la revisión del código y el control de versiones.

Se utiliza una metodología incremental basada en objetivos pequeños, verificables y asociados a commits específicos. Cada objetivo cuenta con un alcance definido, criterios de aceptación y comprobaciones técnicas antes de considerarse terminado.

El proyecto incorpora documentación interna para conservar las decisiones arquitectónicas, los requisitos funcionales y el estado de desarrollo.

## Uso responsable de inteligencia artificial

Durante el desarrollo se utilizaron herramientas de inteligencia artificial como apoyo complementario para la tutoría, la revisión técnica, la planificación y la implementación supervisada.

Para gestionar estas herramientas de manera eficiente, el desarrollador diseñó un sistema propio de instrucciones y skills personalizadas, orientado a:

- Arquitectura y planificación de software.
- Revisión y validación técnica.
- Prevención de duplicaciones y sobreingeniería.
- Seguridad de aplicaciones web.
- Optimización del contexto y los recursos utilizados.
- Aprendizaje mediante un sistema de tutoría.

El objetivo de esta metodología es evitar el desarrollo basado en instrucciones improvisadas o la aceptación de código sin comprenderlo, una práctica comúnmente conocida como vibe coding.

La inteligencia artificial funciona como una herramienta de asistencia y colaboración bajo la dirección del desarrollador, quien conserva la responsabilidad sobre las decisiones, la comprensión del código, su validación y su integración en el proyecto.

## Instalación y ejecución

### Requisitos

- Node.js
- npm
- Git

### Clonar el repositorio

    git clone https://github.com/28Dara/project-adhd-ladder.git

    cd project-adhd-ladder

### Instalar las dependencias

Desde la raíz del proyecto:

    npm install

### Variables de entorno

Consultar los archivos `.env.example` correspondientes a cada parte del proyecto y configurar las variables necesarias para la etapa de desarrollo actual.

Las credenciales y los archivos de entorno privados no deben incorporarse al repositorio.

### Ejecutar el proyecto

Iniciar simultáneamente el cliente y el servidor:

    npm run dev

También pueden ejecutarse de manera independiente:

    npm run dev:client

    npm run dev:server

Direcciones locales predeterminadas:

- Frontend: http://localhost:5173
- Backend: http://127.0.0.1:3000

### Comprobaciones técnicas

Compilar el proyecto:

    npm run build

Ejecutar ESLint:

    npm run lint

Verificar el formato del código:

    npm run format:check

### Estado de la API

El servidor dispone de un endpoint para comprobar su funcionamiento:

    GET /api/healthz

Respuesta esperada:

    {
      "status": "ok"
    }

## Estado del proyecto

ADHD Ladder se desarrolla como proyecto final del programa de Web Development Full Stack de TripleTen.

### Etapa 1 — Frontend

En proceso de cierre y validación académica.

- [x] Diseño y maquetación.
- [x] Componentes reutilizables.
- [x] Navegación y rutas protegidas.
- [x] Formularios de autenticación.
- [x] Life, Activities, Learning y Health.
- [x] Integración con una API externa.
- [x] Diseño responsive.
- [ ] Validación funcional final.
- [ ] Entrega académica.

### Etapa 2 — Full Stack

En desarrollo.

- [x] Separación del cliente y el servidor.
- [x] Configuración de Express y TypeScript.
- [x] Configuración de npm Workspaces.
- [x] Manejo centralizado de errores.
- [x] Comunicación entre cliente y servidor en desarrollo.
- [ ] Conexión con MongoDB Atlas.
- [ ] Modelos de datos con Mongoose.
- [ ] Registro de usuarios mediante bcrypt.
- [ ] Autenticación y autorización mediante JWT.
- [ ] Persistencia de tareas y objetivos.
- [ ] Integración completa entre Frontend y Backend.
- [ ] Pruebas de seguridad y funcionalidad.
- [ ] Despliegue.
- [ ] Entrega académica.

Durante la transición entre etapas, el Frontend conserva temporalmente su integración original con Supabase Auth hasta que el sistema de autenticación propio esté implementado y verificado.

## Aprendizajes y habilidades

El desarrollo de ADHD Ladder permite aplicar y consolidar conocimientos relacionados con:

- Desarrollo de aplicaciones web con React y TypeScript.
- Diseño de interfaces centradas en el usuario.
- Arquitectura de componentes.
- Gestión de estado y navegación.
- Consumo de APIs externas.
- Desarrollo de servidores Express.
- Diseño de APIs REST.
- Manejo de errores y configuración de entornos.
- Evaluación de alternativas arquitectónicas.
- Documentación técnica.
- Control de versiones y desarrollo incremental.
- Gestión y supervisión de herramientas de inteligencia artificial.

La segunda etapa amplía estos conocimientos hacia el modelado de bases de datos, la persistencia, la autenticación, la autorización y el despliegue de aplicaciones Full Stack.

## Autor

*_28Dara_

Desarrollador Web Full Stack.

Proyecto final del programa Web Development de TripleTen — 2026.

- GitHub: https://github.com/28Dara
