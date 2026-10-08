/*
 * Spanish (Latin America, es-419) overlay for the simulator.
 *
 * Display strings only: node ids, tool names, args and results stay English in
 * data/conversations.js. Events and choices are positional (null = keep the
 * English). Each node's "h" is a hash of the English it translates — when the
 * English changes, check-graph flags the node as stale; update the Spanish,
 * then run `node scripts/check-graph.js --stamp-i18n`.
 *
 * Terminology follows MyGeotab's Spanish UI where it exists (regla de
 * excepción, código de falla, ralentí, geocerca, frenado brusco…). es-ES.js
 * layers Spain-specific wording on top of this file.
 */
window.SIM_I18N = window.SIM_I18N || {};
window.SIM_I18N["es-419"] = {
  ui: {
    // ---- page chrome (index.html data-i18n / data-i18n-attr)
    "meta.title": "Geotab MCP — Simulador de experiencia",
    "hdr.sub": "Simulador de experiencia",
    "hdr.connect": "Conectar cuenta real",
    "hdr.about": "Acerca de",
    "hdr.restart": "Reiniciar",
    "hdr.settings": "Ajustes",
    "hdr.settingsTitle": "Ajustes del simulador",
    "lang.label": "Idioma",
    "md.aria": "Estado del almacén de MotherDuck",
    "md.subtitle": "Todavía no hay acciones en el almacén",
    "md.summary": "oculto",
    "empty.kicker": "Chat demo listo",
    "empty.title": "Conecta la flota de ejemplo para iniciar el simulador guiado.",
    "empty.body": "Elige prompts sugeridos; la transcripción se reproducirá con llamadas reales a herramientas MCP y datos de flota fundamentados.",
    "footer.note": "<strong>Simulador.</strong> Las respuestas están pregrabadas, pero se basan en datos reales de la flota demo de Geotab (capturados el 18–19 jun 2026). En uso real, el conector respeta tus permisos de MyGeotab y puede mostrar datos personales: revisa tus obligaciones de privacidad antes de conectar una flota en producción.",
    "landing.aria": "Bienvenida",
    "landing.eyebrow": "CONECTOR MCP DE GEOTAB",
    "landing.title": "Ya usas Geotab. Ahora hazle preguntas en lugar de armar reportes.",
    "landing.sub": "Así se ve cuando un asistente de IA se conecta a tus datos de MyGeotab en vivo a través del <strong>servidor MCP oficial</strong> de Geotab: consulta el estado de la flota, obtén diagnósticos y dispara acciones reales, todo en lenguaje natural.",
    "landing.b1": "<strong><span class=\"bullet-glyph\" aria-hidden=\"true\">ASK</span>Preguntas sobre tu flota en lenguaje natural.</strong> Revisiones semanales, triaje de fallas, \"quién está más cerca y libre ahora mismo\": respondido con datos en vivo, no con una exportación estática.",
    "landing.b2": "<strong><span class=\"bullet-glyph\" aria-hidden=\"true\">MCP</span>Empieza con Claude o usa tu propio asistente.</strong> MCP (Model Context Protocol) es un estándar abierto para conectar asistentes con herramientas: Claude, Microsoft Copilot, ChatGPT y otros clientes compatibles con MCP pueden hablar con el mismo servidor de Geotab.",
    "landing.b3": "<strong><span class=\"bullet-glyph\" aria-hidden=\"true\">DEMO</span>Prueba esta versión sin riesgo.</strong> Todo lo que sigue corre sobre una flota demo anonimizada de Geotab: sin cuenta real, sin configuración y sin riesgo para los datos de producción.",
    "landing.ctaSim": "Probar el simulador de flota",
    "landing.ctaWarehouse": "Construir un almacén en MotherDuck",
    "landing.ctaReal": "¿Listo para conectar tu cuenta real?",
    "landing.foot": "¿Ya te sientes cómodo con MCP? Entra directo abajo.",
    "settings.title": "Ajustes",
    "settings.note": "Ajusta cómo se comporta el simulador. Aquí pueden vivir más controles a medida que crezca la demo.",
    "settings.playback": "Reproducción",
    "settings.playbackBody": "Elige qué tan rápido se reproduce la transcripción MCP pregrabada.",
    "settings.speed": "Velocidad:",
    "settings.speedAria": "Velocidad de reproducción",
    "speed.xfastCopy": "Ritmo actual del simulador: lo bastante rápido para demos y recorridos.",
    "speed.realisticCopy": "Tiempos medidos de API/Ace: las llamadas a la API tardan segundos y Ace puede tardar 30–50 s. Haz clic en la transcripción para adelantar.",
    "settings.game": "Juego de progreso de flota <span class=\"settings-flag\">experimental</span>",
    "settings.gameAria": "Juego de progreso de flota",
    "settings.gameBody": "Desactivado por defecto, para que el simulador siga siendo un simulador. Actívalo y los escenarios que explores harán crecer una flota simulada hasta los 50 vehículos, con marcas de verificación y puntos incluidos. Se guarda solo en este navegador.",
    "game.offCopy": "Simulador simple: sin puntajes ni marcas de verificación.",
    "game.on": "sí",
    "game.onCopy": "Haz crecer tu flota a medida que exploras escenarios.",
    "settings.reset": "Reiniciar progreso",
    "common.close": "✕ Cerrar",
    "about.title": "Acerca de este sitio",
    "about.built": "Creado por <strong>Felipe Hoffa</strong> — <a href=\"https://www.linkedin.com/in/hoffa\" target=\"_blank\" rel=\"noopener\">LinkedIn</a>.",
    "about.videoTitle": "Video demo del conector MCP de Geotab",
    "about.video": "🎥 Mira cómo el conector MCP oficial de Geotab permite que los asistentes de IA investiguen problemas de la flota, automaticen alertas y coordinen acciones entre herramientas como Gmail y calendarios (video en inglés): <a href=\"https://youtube.com/watch?v=7uMXqWfxlC0\" target=\"_blank\" rel=\"noopener\">abrir en YouTube</a>.",
    "about.learn": "Conoce más sobre el conector real en la página del <a href=\"https://www.geotab.com/geotab-mcp-connector/\" target=\"_blank\" rel=\"noopener\">Conector MCP de Geotab</a>.",
    "about.mcp": "¿Nuevo en MCP? El <strong>Model Context Protocol</strong> es el estándar abierto que permite a los asistentes de IA llamar herramientas externas como MyGeotab; consulta <a href=\"https://modelcontextprotocol.io\" target=\"_blank\" rel=\"noopener\">modelcontextprotocol.io</a>.",
    "about.bug": "¿Encontraste un error o quieres ver otro escenario? Abre un <a href=\"https://github.com/fhoffa/geotab-mcp-simulator/issues\" target=\"_blank\" rel=\"noopener\">issue en GitHub</a>.",
    "real.title": "Conecta tu cuenta real de Geotab",
    "real.note": "Tres cosas que hacer antes de que un asistente de IA toque los datos reales de tu flota.",
    "real.s1": "<strong>Obtén acceso a una base de datos de MyGeotab.</strong> La forma más rápida de empezar es una base de datos demo gratuita: regístrate en <a href=\"https://my.geotab.com/registration.html\" target=\"_blank\" rel=\"noopener\">my.geotab.com/registration.html</a> para practicar primero con datos anonimizados (la misma forma que este simulador, sin conductores ni vehículos reales). Para acceso de producción, pídelo a tu representante de cuenta de Geotab o al administrador de tu flota.",
    "real.s2": "<strong>Conecta el conector MCP de Geotab a tu asistente preferido.</strong> Geotab publica un servidor MCP (Model Context Protocol) oficial. La forma más rápida: está listado en los directorios de Claude y ChatGPT, y vienen más. Microsoft Copilot y cualquier otro cliente compatible con MCP pueden agregar el mismo servidor por su URL.",
    "real.docs": "Empieza con la guía oficial de Geotab: <a href=\"https://support.geotab.com/help/mygeotab/access-and-administration/mygeotab-mcp/getting-started-with-mygeotab-mcp\" target=\"_blank\" rel=\"noopener\">Getting started with MyGeotab MCP</a> (en inglés). La versión rápida está abajo.",
    "real.optA": "Opción A: búscalo en el directorio de tu asistente",
    "real.optAClaude": "<strong>Claude:</strong> abre la <a href=\"https://claude.ai/directory/mygeotab-mcp-prod?open_in_browser=1\" target=\"_blank\" rel=\"noopener\">ficha de MyGeotab MCP</a> (o <strong>Directory</strong> → busca \"Geotab\") y haz clic en <strong>Connect to Claude</strong>. <a href=\"https://www.linkedin.com/feed/update/urn:li:activity:7498420900682153984/\" target=\"_blank\" rel=\"noopener\">Mira el recorrido</a>.",
    "real.optAChatgpt": "<strong>ChatGPT:</strong> abre <strong>Plugins</strong>, busca \"Geotab\", elige <strong>MyGeotab MCP</strong> y toca <strong>Install plugin</strong>. <a href=\"https://www.linkedin.com/feed/update/urn:li:activity:7508970838931435520/\" target=\"_blank\" rel=\"noopener\">Mira el recorrido</a> (todo desde un teléfono).",
    "real.optAEither": "En cualquier caso, inicias sesión en MyGeotab una vez y apruebas la conexión; tus permisos actuales se mantienen tal cual.",
    "real.optB": "Opción B: agrégalo por URL en cualquier otro cliente",
    "real.optBSub": "Por ejemplo, el conector personalizado de Claude:",
    "real.optB1": "Ve a <strong>claude.ai → Settings → Connectors</strong> y haz clic en <strong>Add custom connector</strong>.",
    "real.optB2": "Escribe un <strong>nombre</strong> (p. ej., \"Geotab\") y la <strong>URL del servidor MCP remoto</strong>: <code>https://mcp.geotab.com/mygeotab</code>. Deja vacíos los campos de OAuth: el servidor de Geotab se encarga de eso.",
    "real.shotAlt": "El diálogo \"Add custom connector\" de Claude, con el nombre Geotab y la URL https://mcp.geotab.com/mygeotab ya completados",
    "real.optB4": "Haz clic en <strong>Add</strong>: Claude te redirige a una pantalla de inicio de sesión de MyGeotab. Entra con tu usuario y contraseña de MyGeotab y aprueba la conexión.",
    "real.optB5": "De vuelta en el cliente, el conector ahora aparece como <strong>Connected</strong>. Actívalo para un chat desde el selector de herramientas/conectores (el ícono de conector debajo del cuadro de mensaje) y pregúntale cualquier cosa que hayas probado en este simulador.",
    "real.setupFoot": "Microsoft Copilot y otros clientes compatibles con MCP siguen el mismo patrón: agrega un conector MCP personalizado/remoto, apúntalo a <code>https://mcp.geotab.com/mygeotab</code> e inicia sesión con tus credenciales de MyGeotab cuando te lo pida.",
    "real.s3": "Ten claro qué estás exponiendo.",
    "real.piiLead": "<strong>Antes de conectar una base de datos de producción:</strong> el conector hereda tus permisos de MyGeotab, así que el asistente puede ver todo lo que tú ves, incluidos datos personales (nombres de conductores, números de empleado, correos, historial de ubicación preciso).",
    "real.pii1": "Revisa el DPA de tu proveedor de IA y tus obligaciones de GDPR / minimización de datos.",
    "real.pii2": "Pídele al asistente que trabaje a nivel de vehículo/activo: que evite nombres de conductores, correos y números de teléfono en sus respuestas.",
    "real.pii3": "Las bases de datos demo (como la de arriba) están anonimizadas (\"Demo - 01\", sin datos reales de conductores), así que puedes explorarlas con libertad.",
    "real.piiFoot": "Esto no es asesoría legal: consulta con tu propio equipo legal o de cumplimiento antes de conectar datos de producción.",
    // ---- runtime strings (UI_EN in app.js)
    "conn.off": "Sin conexión",
    "conn.geotab": "Conectado · Geotab",
    "conn.carto": "Conectado · Geotab + CARTO",
    "conn.motherduck": "Conectado · Geotab + MotherDuck",
    "speed.xfast": "muy rápido",
    "speed.realistic": "realista",
    "game.off": "no",
    "chat.you": "tú",
    "chat.database": "base de datos · {db}",
    "tool.calling": "Llamando a {name}…",
    "tool.aria": "Llamada a herramienta {name}: mostrar solicitud y respuesta",
    "tool.action": "acción",
    "tool.done": "listo",
    "tool.request": "Solicitud",
    "tool.response": "Respuesta",
    "tool.hint": "☝ Eso es una <strong>llamada a herramienta MCP</strong>: el asistente usa el Model Context Protocol para consultar MyGeotab. Haz clic en la tarjeta para ver la solicitud y la respuesta exactas. Conecta una cuenta real y estas llamadas se ejecutan en vivo contra tu flota.",
    "confirm.head": "✅ Listo: esto cambió en MyGeotab",
    "confirm.simulated": " (simulado)",
    "endcard.foot": "El mismo conector funciona en Microsoft Copilot, ChatGPT, Cursor, Windsurf y otros clientes MCP · geotab.com",
    "endcard.cta": "Prueba esto con tu propia flota →",
    "warehouse.title": "Almacén",
    "warehouse.sample": "Filas de ejemplo",
    "warehouse.rows": "filas",
    "warehouse.row": "fila",
    "warehouse.noRows": "0 filas",
    "warehouse.show": "Mostrar el estado del almacén de MotherDuck",
    "warehouse.hide": "Ocultar el estado del almacén de MotherDuck",
    "warehouse.table": "{n} tabla",
    "warehouse.tables": "{n} tablas",
    "warehouse.empty": "vacía",
    "warehouse.updated": "Actualizado",
    "warehouse.pointer": "Abre el panel **Almacén** de arriba para explorar tus tablas y esquemas bronze/silver/gold.",
    "chart.aria": "Gráfico: ",
    "map.aria": "Mapa. ",
    "map.zone": "Zona: {label}",
    "map.markers": "Marcadores: {labels}",
    "map.street": "Mapa de calles",
    "map.disclosure": "Capa ilustrativa sobre mapa base © colaboradores de OpenStreetMap, © CARTO · no es seguimiento en vivo",
    "media.disclosure": "Reconstrucción ilustrativa · generada con IA, no es una captura MCP en vivo",
    "media.fallback": "No se encontró el clip: consulta media/README.md para generarlo y agregarlo.",
    "progress.fleet": "🚚 La flota creció a <strong>{fleet}</strong> vehículos",
    "progress.points": "{points} pts · {done}/{total} escenarios explorados",
    "progress.full": "🏆 Flota completa de 50 vehículos desbloqueada. ¿Listo para manejar una real? Usa \"Conectar cuenta real\" arriba.",
    "progress.summary": "🚚 {fleet} vehículos · {points} pts · {done}/{total} escenarios",
    "tray.hint": "Elige un prompt sugerido para continuar el simulador:",
    "chip.start": "Empieza aquí",
    "chip.explored": "explorado",
  },
  nodes: {
  "connect": {
    h: "f2f47efa",
    events: [
      /*0 assistant*/ { text: "Hola, soy un asistente. Cuando conectes el conector MCP de Geotab, podré leer datos en vivo de tu flota y realizar acciones sobre ella, aquí mismo en el chat, sin un panel aparte.\n" +
        "\n" +
        "(Vale la pena saberlo: MCP es el *Protocolo de Contexto de Modelo* (Model Context Protocol), un estándar abierto para conectar asistentes de IA con herramientas, y el conector es simplemente un servidor MCP abierto. Copilot, ChatGPT, Claude: cualquier cliente que hable MCP puede conectarse al mismo. Ningún asistente es especial aquí: Claude y ChatGPT ya lo incluyen en sus directorios, y cualquier otro cliente puede agregarlo por URL.)\n" +
        "\n" +
        "Un detalle práctico: el servidor MCP no conoce ni enumera automáticamente todas las bases de datos a las que tu cuenta tiene acceso. Necesitas saber el nombre de la base de datos que quieres y pedirle al asistente que la use.\n" +
        "\n" +
        "Esta página en particular es un simulador, así que harás clic en preguntas sugeridas en lugar de escribir, y las respuestas están pregrabadas, pero los números detrás de todo vienen de flotas demo reales de Geotab. Conéctalo y te muestro." },
    ],
    choices: [
      { label: "🔌 Conectar el conector MCP de Geotab",
        say: "Conecta el conector MCP de Geotab." },
      { label: "🎥 Ver primero el video demo de 2 minutos" },
    ],
  },
  "authorize": {
    h: "48cbc2a4",
    events: [
      /*0 system*/ { text: "Abriendo la autorización de Geotab…" },
      /*1 tool*/ { summary: "sesión establecida" },
      /*2 system*/ { text: "Conectado a Geotab. El conector no devuelve una lista maestra de todas las bases de datos a las que tienes acceso; el usuario necesita saber qué nombre de base de datos pedir. Para este simulador usamos dos nombres de bases de datos demo conocidos:\n" +
        "- demo_fh_vegas4 — Las Vegas, EE. UU. · 50 vehículos\n" +
        "- demo_fh4 — España (Galicia + Valencia) · 50 vehículos" },
    ],
  },
  "hub": {
    h: "11611b5a",
    events: [
      /*0 assistant*/ { text: "Ya estás conectado. ¿Qué quieres revisar?\n" +
        "\n" +
        "(En el conector real simplemente lo escribirías; aquí, elige una de las opciones de abajo. No le des muchas vueltas: cada respuesta ofrece seguimientos naturales, así que cualquier puerta lleva a las demás. **⭐ Empieza aquí** es el recorrido más rápido.)" },
    ],
    choices: [
      { group: "⭐ Empieza aquí",
        label: "📋 La revisión del lunes por la mañana",
        say: "Dame mi revisión semanal de la flota de los últimos 7 días: fallas, ralentí y conducción brusca, infracciones de HOS, pendientes de DVIR y actividad de viajes. Que sea un resumen corto sobre el que pueda actuar." },
      { group: "⭐ Empieza aquí",
        label: "🛡️ Evaluar mis 3 principales riesgos de seguridad + soluciones",
        say: "Evalúa mi flota para encontrar los tres principales riesgos de seguridad y sugiere acciones correctivas." },
      { group: "⭐ Empieza aquí",
        label: "🦆 Construir un data warehouse en MotherDuck",
        say: "Enséñame a construir un data warehouse de Geotab en MotherDuck usando llamadas MCP: configuración, primera carga y actualización incremental." },
      { group: "⭐ Empieza aquí",
        label: "💰 ¿Por dónde pierde dinero mi flota?",
        say: "¿Por dónde pierde dinero mi flota? Suma los ahorros recuperables y arma el caso de ROI." },
      { group: "🛟 Seguridad",
        label: "🚦 ¿Quiénes son mis conductores más riesgosos?",
        say: "¿Quiénes son mis diez conductores más riesgosos esta semana y cuáles fueron sus principales eventos?" },
      { group: "🛟 Seguridad",
        label: "🛑 Frenado brusco por conductor (30 días)",
        say: "Muéstrame un desglose de los eventos de frenado brusco por conductor en los últimos 30 días." },
      { group: "🛟 Seguridad",
        label: "🏫 ¿Exceso de velocidad en zonas escolares este mes?",
        say: "¿Qué conductores han tenido infracciones por exceso de velocidad en zonas escolares este mes?" },
      { group: "🛟 Seguridad",
        label: "❓ ¿Por qué subieron las alertas de velocidad?",
        say: "Nuestras alertas de exceso de velocidad subieron esta semana. ¿Por qué? ¿Es toda la flota o unos pocos vehículos? Desglósamelo." },
      { group: "🛟 Seguridad",
        label: "🛣️ ¿De verdad esa vía era tan rápida?",
        say: "Un conductor está disputando una alerta de exceso de velocidad en Demo - 01. Obtén el límite de velocidad señalizado a lo largo de su ruta real para que podamos entrenarlo con hechos, no con recuerdos." },
      { group: "🛟 Seguridad",
        label: "🤖 Hacerle una pregunta a Geotab Ace",
        say: "Usando Geotab Ace: ¿qué 5 vehículos tuvieron más eventos de exceso de velocidad en los últimos 7 días, y cuántos cada uno?" },
      { group: "🔧 Mantenimiento",
        label: "🔧 Priorizar la lista de trabajo de mantenimiento",
        say: "Tengo un montón de fallas en la flota de España. ¿Están en todas partes o en unos pocos vehículos? Dame una lista de trabajo priorizada para el taller." },
      { group: "🔧 Mantenimiento",
        label: "📅 ¿Qué tiene el servicio vencido ahora mismo?",
        say: "¿Qué vehículos tienen vencido el mantenimiento programado ahora mismo?" },
      { group: "🔧 Mantenimiento",
        label: "⚠️ Códigos de falla + gravedad (últimos 7 días)",
        say: "Muéstrame los códigos de falla registrados en los últimos siete días y su gravedad." },
      { group: "🔧 Mantenimiento",
        label: "⏱️ Mayor tiempo de inactividad no planificado este trimestre",
        say: "¿Qué activos han tenido más tiempo de inactividad no planificado este trimestre?" },
      { group: "🔧 Mantenimiento",
        label: "❓ ¿Por qué Demo - 08 sigue fallando?",
        say: "Demo - 08 sigue apareciendo en la lista de fallas. ¿Por qué? Investígalo y no te quedes con la primera explicación." },
      { group: "🔧 Mantenimiento",
        label: "📧 Falla → correo al taller → agendar servicio",
        say: "Una de nuestras camionetas acaba de registrar una falla. Obtén los detalles, redacta un correo al taller pidiéndoles que la revisen y pon un horario tentativo de servicio en mi calendario para mañana por la mañana." },
      { group: "🚀 Operaciones",
        label: "⛽ Rendimiento de combustible por tipo de vehículo",
        say: "¿Cuál es mi rendimiento de combustible promedio por tipo de vehículo este mes?" },
      { group: "🚀 Operaciones",
        label: "💤 Mayores tiempos en ralentí la semana pasada",
        say: "Muéstrame qué rutas tuvieron los mayores tiempos en ralentí la semana pasada." },
      { group: "🚀 Operaciones",
        label: "🔋 Candidatos para reemplazo por eléctricos",
        say: "¿Qué vehículos son candidatos para reemplazo por eléctricos según sus patrones de kilometraje diario?" },
      { group: "🚀 Operaciones",
        label: "🚐 ¿Qué hay realmente en mi flota?",
        say: "¿Qué marcas y modelos tengo realmente en la flota de España, y cuáles son candidatos realistas para pasar a eléctricos?" },
      { group: "🚀 Operaciones",
        label: "🌍 Reaccionar a una zona de bajas emisiones",
        say: "La zona de bajas emisiones de Valencia se endurece en 2026. Revisa las reglas actuales y dime si mi flota circula por esa zona y cuánto nos costaría una entrada no permitida." },
      { group: "🚀 Operaciones",
        label: "🧪 Probar crear y eliminar una zona/regla",
        say: "Antes de automatizar cualquier cosa con zonas y reglas, guíame para crear una zona y una regla de prueba desechables, verificar que existan, luego eliminar ambas y confirmar que de verdad desaparecieron, no que solo se desactivaron." },
      { group: "🧠 Automatiza y comparte",
        label: "🛠️ Convertir mi revisión semanal en una skill del equipo",
        say: "Empaqueta mi revisión semanal de la flota en una skill reutilizable para que yo, y cualquiera de mi equipo, pueda correr exactamente la misma revisión con solo pedirla." },
      { group: "🧠 Automatiza y comparte",
        label: "⚡ Resolver 5 tareas de la flota en una sola petición",
        say: "Tengo varias tareas de la flota pendientes: crear una geocerca para el depósito, una alerta de ralentí, borrar las fallas de una camioneta que ya pasó por servicio, agrupar mis vehículos de Valencia y enviar las alertas a un gerente." },
      { group: "🧠 Automatiza y comparte",
        label: "🧑‍🏫 Redactar notas de coaching para un gerente",
        say: "Identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su gerente." },
      { group: "🚚 Otras herramientas y dirección",
        label: "🧭 ¿Qué puede hacer CARTO con mi flota?",
        say: "Tengo Geotab y CARTO conectados. ¿Qué puedo hacer con los dos juntos?" },
      { group: "🚚 Otras herramientas y dirección",
        label: "🗺️ Encontrar mis hubs + alcance de 15 min (CARTO)",
        say: "¿Dónde está mi flota ahora mismo?" },
      { group: "🚚 Otras herramientas y dirección",
        label: "🚐 ¿Quién está más cerca y libre ahora mismo?",
        say: "Acaba de entrar un trabajo cerca del centro de Las Vegas. ¿Qué vehículo está más cerca y realmente disponible ahora mismo?" },
      { group: "🚚 Otras herramientas y dirección",
        label: "💼 Resolver una disputa por entrega tardía (Salesforce)",
        say: "Un cliente está disputando una entrega tardía de ayer y está registrada como un caso abierto en Salesforce. Compara la hora real de llegada de Demo - 12 al sitio del cliente con el caso y registra la prueba en el caso." },
      { group: "🚚 Otras herramientas y dirección",
        label: "📊 Dame un resumen para el directorio, ambas flotas",
        say: "Dame un resumen a nivel de directorio de ambas flotas (utilización, seguridad, mantenimiento y sostenibilidad) en cinco números." },
    ],
  },
  "ep1-answer": {
    h: "82b6fe8a",
    events: [
      /*0 assistant*/ { text: "Déjame armar esto, empezando por cuántos vehículos están reportando realmente." },
      /*1 tool*/ null,
      /*2 assistant*/ { text: "50, todos reportando. Ahora la pregunta que de verdad importa: ¿hay fallas activas esta semana?" },
      /*3 tool*/ { summary: "0 fallas activas" },
      /*4 assistant*/ { text: "Cero. Así que, pase lo que pase esta semana, es comportamiento, no averías. Voy a revisar las excepciones de conducción." },
      /*5 tool*/ { summary: "todas RulePostedSpeeding · el exceso de velocidad es de toda la flota (ver nota)" },
      /*6 assistant*/ { text: "Todas las excepciones de esta semana son por exceder el límite señalizado, y están repartidas entre muchos vehículos, no concentradas en uno. Una última cosa antes de redactarlo: voy a revisar por muestreo los conjuntos de reglas de HOS para saber qué aplica realmente." },
      /*7 tool*/ { summary: "conjuntos de reglas por conductor (p. ej. USA Property 60-hour / 7-day)" },
      /*8 assistant*/ { text: "Bien, esta es tu semana en demo_fh_vegas4.\n" +
        "\n" +
        "Primero lo bueno: 50 vehículos, todos reportando, cero fallas activas. Una semana realmente limpia en mantenimiento.\n" +
        "\n" +
        "Lo que hay que revisar es el exceso de velocidad, y no es un conductor: es toda la flota. Los eventos por exceder el límite señalizado están repartidos entre muchos vehículos, con los peores muy parejos y ninguna camioneta despegándose del resto. Eso cambia la solución: no es una conversación con una persona, es un tema de política, más una alerta en vivo para detectarlo en el momento y no el lunes siguiente.\n" +
        "\n" +
        "Dos salvedades para que no lo sobreinterpretes: HOS es solo por conductor (la API no devuelve infracciones sin nombrar a alguien), así que lo que hice fue una revisión por muestreo, no un visto bueno de toda la flota. Y DVIR no tiene nada registrado esta semana, lo que interpreto como \"nada que reportar\" y no como \"nadie las está llenando\", pero vale la pena confirmarlo de tu lado.\n" +
        "\n" +
        "(No incluí el conteo de viajes: el contador histórico total no es un número semanal con sentido, así que lo dejé fuera en lugar de reportar algo engañoso.)\n" +
        "\n" +
        "Esta es la versión de un resumen que antes implicaba sacar cuatro reportes y cruzarlos a mano: probablemente 30–45 minutos un lunes. Esto fue una sola petición.\n" +
        "\n" +
        "Una cosa antes de archivarlo: ese es *mi* formato por defecto, varios párrafos de prosa. Si esto se va a convertir en tu ritual de los lunes, dilo ahora. ¿Demasiado largo? ¿Orden equivocado? ¿Lo quieres visual? Lo que acordemos entre los dos es lo que después podemos congelar en una skill para todo tu equipo." },
    ],
    choices: [
      { label: "📊 Demasiada prosa: grafica el exceso de velocidad",
        say: "Útil, pero la verdad el yo del lunes no va a leer cinco párrafos. Hazlo visual: grafica el exceso de velocidad para ver los vehículos principales de un vistazo." },
      { label: "🤖 Verificar el exceso de velocidad con Ace",
        say: "Verifica esa lectura del exceso de velocidad con Geotab Ace." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep1-shape-viz": {
    h: "4dc2c555",
    events: [
      /*0 assistant*/ { text: "Es justo, y este es exactamente el momento de decirlo, mientras todavía le estamos dando forma.\n" +
        "\n" +
        "Un detalle primero: no voy a graficar la consulta en bruto. Está limitada a las ~200 filas más recientes, así que un gráfico de eso sería solo una versión más bonita de un artefacto de paginación. Voy a pedirle a Ace que agregue toda la semana en toda la flota, y luego grafico el ranking real." },
      /*1 tool*/ { summary: "agregado de toda la flota → los 5 principales agrupados entre 118–142" },
      /*2 chart*/ { title: "Top 5 vehículos por eventos de exceso de velocidad · últimos 7 días (vía Ace)" },
      /*3 assistant*/ { text: "Ahí está la imagen, y fíjate que sostiene el argumento que hacía el párrafo. Un solo vehículo malo se vería como una barra larga y luego un precipicio; esto es una meseta, cinco vehículos a unos 20 eventos entre sí. \"Problema de toda la flota, se arregla con política\": ahora de un vistazo en lugar de en una oración.\n" +
        "\n" +
        "(Yo no graficaría el lado de mantenimiento esta semana: todas las barras serían cero. Cuando un gráfico no tiene nada que decir, la frase \"cero fallas activas\" lo dice mejor.)\n" +
        "\n" +
        "Sigamos dándole forma: ¿y el texto alrededor? ¿Las mismas seis secciones o algo más compacto?" },
    ],
    choices: [
      { label: "🧾 Titular, gráfico, tres viñetas: se reenvía",
        say: "Más compacto. Titular arriba, luego el gráfico y luego tres viñetas como máximo. Y se lo reenvío a mi gerente de operaciones, así que mantenlo simple y sin nombres de conductores." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep1-shape-brief": {
    h: "e33b5e6b",
    events: [
      /*0 assistant*/ { text: "Trato hecho. La misma semana, con otra forma; así se ve tu resumen del lunes de ahora en adelante:\n" +
        "\n" +
        "**Camiones limpios, pies pesados: esta semana el exceso de velocidad es un problema de la flota, no de un conductor.**" },
      /*1 chart*/ { title: "Top 5 vehículos por eventos de exceso de velocidad · últimos 7 días (vía Ace)" },
      /*2 assistant*/ { text: "- Los 50 vehículos reportando, **cero fallas activas**: una semana de mantenimiento realmente limpia.\n" +
        "- **El exceso de velocidad es de toda la flota**: los cinco principales están entre 118 y 142 eventos, nadie se despega. La solución es una política más una alerta en vivo, no una sola conversación.\n" +
        "- **HOS limpio en la revisión por muestreo; DVIR sin registros**: HOS es solo por conductor, así que confirma que los equipos están llenando las inspecciones en vez de suponerlo.\n" +
        "\n" +
        "Eso es todo: se puede reenviar tal cual, habla de vehículos y no de personas, y el gráfico hace el argumento.\n" +
        "\n" +
        "Vale la pena notar lo que acaba de pasar: este formato no salió de mí, salió de la conversación. Dijiste que el tú del lunes no lee párrafos, así que el gráfico va primero. Dijiste que se reenvía, así que es simple y no nombra conductores. Eso es exactamente lo que hace que valga la pena congelarlo: ¿quieres que empaquete *esto*, con el formato y todas las trampas de datos que tuve que esquivar, en una skill que cualquiera de tu equipo pueda correr?" },
    ],
    choices: [
      { label: "🛠️ Congélalo: que esta sea la skill del equipo",
        say: "Congélalo. Empaqueta exactamente esto en una skill reutilizable para que cualquiera de mi equipo obtenga el mismo resumen con solo pedirlo." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep1-skill-first": {
    h: "ee199f9f",
    events: [
      /*0 assistant*/ { text: "Con gusto, pero no quiero empaquetar una suposición. Una skill es tan buena como la conversación de la que se congela, así que este es el plan: corro tu revisión una vez, tú me dices qué está mal (demasiado larga, formato equivocado, cosas que faltan) y lo que acordemos es lo que guardo. Corriéndola ahora." },
    ],
  },
  "ep1-skill": {
    h: "7840c88e",
    events: [
      /*0 tool*/ { summary: "SKILL.md escrito: formato definido (titular → gráfico → 3 viñetas), reglas de fundamentación + sin PII por defecto" },
      /*1 assistant*/ { text: "La empaqueté como geotab-weekly-review; abre la tarjeta de arriba si quieres ver qué contiene. Cada línea se remonta a algo que pasó en esta conversación:\n" +
        "\n" +
        "- El **formato con el gráfico primero** está ahí porque dijiste que el tú del lunes no lee párrafos.\n" +
        "- El **límite de tres viñetas** y la **regla de no nombrar conductores** están ahí porque dijiste que el resumen se reenvía.\n" +
        "- La regla **\"agrega toda la ventana, nunca hagas un ranking a partir de una lista limitada\"** está ahí porque la consulta en bruto habría contado la historia equivocada antes de que Ace la corrigiera.\n" +
        "- Además de las trampas que nunca me viste esquivar: el contador de Trip que ignora las fechas, y que HOS es solo por conductor.\n" +
        "\n" +
        "Ponla en las skills compartidas de tu equipo y cualquiera podrá decir \"corre mi revisión semanal\" y obtener exactamente el resumen que definimos: la versión cuidadosa cada vez, sin volver a discutir todo esto.\n" +
        "\n" +
        "Ese es el patrón que vale la pena copiar de toda esta demo: **primero conversaciones, después skills.** No escribas una skill desde una página en blanco: haz la revisión a mano, discútela como acabas de hacerlo y luego congela lo que acuerden. La de arriba queda pública en este proyecto como ejemplo práctico — [skills/geotab-weekly-review/SKILL.md](https://github.com/fhoffa/geotab-mcp-simulator/blob/main/skills/geotab-weekly-review/SKILL.md) — no como algo para instalar tal cual, porque las reglas que le dan valor a una skill salen de las conversaciones de *tu* flota. (Para skills compartidas listas para usar, como la del data warehouse en MotherDuck que usa la ruta de warehouse de este simulador, consulta la guía complementaria [geotab-vibe-guide](https://github.com/fhoffa/geotab-vibe-guide).)" },
      /*2 endcard*/ { lines: ["Conector MCP de Geotab", "Pregunta una vez. Automatízalo. Compártelo con todo tu equipo."] },
    ],
    choices: [
      { label: "🚐 ¿Qué hay realmente en esta flota?",
        say: "Ya que estamos: ¿qué marca y modelo son realmente estos vehículos?" },
      { label: "⚡ Probar otro",
        say: "Muéstrame otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-safety-skill": {
    h: "90a6d735",
    events: [
      /*0 tool*/ { summary: "SKILL.md escrito: puntuación ponderada, lectura sistémica vs. individual, sin PII por defecto" },
      /*1 assistant*/ { text: "La empaqueté como fleet-safety-scorecard; abre la tarjeta para ver qué contiene. No es solo una tabla de posiciones más rápida: codifica el criterio, que la puntuación está ponderada para que la gravedad pese más que el volumen, que un grupo compacto significa una solución de política y no diez conversaciones, y que un pico en una sola esquina es un problema de ruta. Además del criterio de no incluir PII por defecto, para que quien la corra obtenga la versión cuidadosa.\n" +
        "\n" +
        "Ponla en las skills compartidas de tu equipo y cualquiera podrá decir \"corre el scorecard de seguridad\" y obtener esta misma lectura." },
      /*2 endcard*/ { lines: ["Conector MCP de Geotab", "Pregunta una vez. Automatízalo. Compártelo con todo tu equipo."] },
    ],
    choices: [
      { label: "🚦 Correr el scorecard ahora",
        say: "¿Quiénes son mis diez conductores más riesgosos esta semana y cuáles fueron sus principales eventos?" },
      { label: "🧑‍🏫 Redactar las notas de coaching de esta semana",
        say: "Identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su gerente." },
      { label: "⚡ Probar otro",
        say: "Muéstrame otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-maint-skill": {
    h: "cf9990e1",
    events: [
      /*0 tool*/ { summary: "SKILL.md escrito: priorización por testigo, lo legal primero, ruido vs. motor, sin PII por defecto" },
      /*1 assistant*/ { text: "La empaqueté como maintenance-triage; abre la tarjeta para leerla. Lleva el criterio que la hace útil: ordenar por consecuencia, para que una ITV legal pase por delante de un cambio de aceite más grande; leer la gravedad en el testigo del tablero y no en el conteo bruto; y reconocer que 580 fallas del dispositivo suelen ser un solo trabajo de cableado, no 580 problemas.\n" +
        "\n" +
        "Ponla en tus skills compartidas y cualquiera podrá decir \"prioriza la flota\" y obtener la misma lista de trabajo priorizada." },
      /*2 endcard*/ { lines: ["Conector MCP de Geotab", "Pregunta una vez. Automatízalo. Compártelo con todo tu equipo."] },
    ],
    choices: [
      { label: "🔧 Correr la priorización ahora",
        say: "Tengo un montón de fallas en la flota de España. ¿Están en todas partes o en unos pocos vehículos? Dame una lista de trabajo priorizada para el taller." },
      { label: "📅 ¿Qué está vencido ahora mismo?",
        say: "¿Qué vehículos tienen vencido el mantenimiento programado ahora mismo?" },
      { label: "⚡ Probar otro",
        say: "Muéstrame otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-roi-skill": {
    h: "7e694a0b",
    events: [
      /*0 tool*/ { summary: "SKILL.md escrito: modelo de palancas conservador, salvedades honestas, sin doble conteo" },
      /*1 assistant*/ { text: "La empaqueté como quarterly-roi-case; abre la tarjeta para verla. El valor no está en la aritmética sino en la disciplina incorporada: el extremo bajo de cada rango, la línea de colisiones marcada como valor esperado y no como efectivo, sin contar dos veces combustible y ralentí, y cada número ligado a una cifra real de origen. Esa es la versión a la que le dicen que sí.\n" +
        "\n" +
        "Córrela cada trimestre y obtendrás el mismo caso defendible con datos frescos, sin reconstruir el modelo." },
      /*2 endcard*/ { lines: ["Conector MCP de Geotab", "Pregunta una vez. Automatízalo. Compártelo con todo tu equipo."] },
    ],
    choices: [
      { label: "📄 Redactar el one-pager de este trimestre",
        say: "Convierte esto en un caso de negocio de una página que pueda reenviarle a mi jefe." },
      { label: "💰 Volver a correr el desglose completo de ROI",
        say: "¿Por dónde pierde dinero mi flota? Suma los ahorros recuperables y arma el caso de ROI." },
      { label: "⚡ Probar otro",
        say: "Muéstrame otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep2-answer": {
    h: "1d4697dd",
    events: [
      /*0 assistant*/ { text: "Primero voy a sacar los eventos de excepción en bruto para ver quién va adelante." },
      /*1 tool*/ { summary: "las 200 más recientes de ~5,645 filas → falsa impresión de 'un caso atípico'" },
      /*2 assistant*/ { text: "En la consulta en bruto, Demo - 01 y Demo - 02 van muy por delante. Pero eso son solo los 200 eventos más recientes de unos 5,645 esta semana, aproximadamente el 3.5% de los datos. Antes de señalar a una camioneta, voy a pedirle a Ace que agregue toda la semana en toda la flota en lugar de solo la página más reciente." },
      /*3 tool*/ { summary: "agregado de toda la flota → los 5 principales agrupados entre 118–142, ninguna camioneta se despega" },
      /*4 assistant*/ { text: "Esto es lo que realmente pasó. Una consulta rápida en bruto solo devuelve los ~200 eventos más recientes, y resulta que esos se concentran en un par de camionetas, lo que hace parecer que Demo - 01 es el problema.\n" +
        "\n" +
        "No lo es: eso es un artefacto de paginación, no una respuesta. Esas 200 filas son alrededor del 3.5% de los 5,645 eventos de esta semana. Cuando Ace agrega toda la semana en todos los vehículos, Demo - 01 ni siquiera está en primer lugar: es Demo - 16 con 142, luego Demo - 01 con 134, luego 129, 121 y 118. Es una variación real, no un empate, pero nadie se despega como lo haría un verdadero caso atípico (piensa en 2–3 veces el siguiente vehículo, no 1.2 veces).\n" +
        "\n" +
        "Así que no es una camioneta, es toda la flota. El \"por qué\" no es una persona, es sistémico: rutas compartidas, límites compartidos, expectativas compartidas. Eso requiere otra solución: no una conversación con un conductor, sino un cambio de política más una barrera de control en vivo.\n" +
        "\n" +
        "(Para ser justos, recorrer los 5,645 eventos o simplemente contar bien por vehículo también lo habría detectado; simplemente no debí confiar en la primera página.)" },
      /*5 chart*/ { title: "Top 5 vehículos por eventos de exceso de velocidad · últimos 7 días (vía Ace)" },
    ],
    choices: [
      { label: "🔔 Configurar una alerta de velocidad para toda la flota",
        say: "Configura una alerta por exceder el límite señalizado en toda la flota para que los eventos se marquen en vivo de ahora en adelante, y envíala a un gerente de flota." },
      { label: "🛣️ ¿De verdad esas vías eran tan rápidas?",
        say: "Obtén los límites de velocidad señalizados a lo largo de la ruta de Demo - 01." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep2-action": {
    h: "a8691fcb",
    events: [
      /*0 assistant*/ { text: "Manos a la obra: primero creo una regla de límite señalizado para toda la flota." },
      /*1 tool*/ { summary: "Regla creada" },
      /*2 assistant*/ { text: "La regla está activa. Ahora envío la alerta a tu gerente de flota." },
      /*3 tool*/ { summary: "Alerta enviada a 1 gerente" },
      /*4 assistant*/ { text: "Listo: la regla de límite señalizado para toda la flota está activa y la alerta va a un gerente de flota (por nombre, sin mostrar el correo). Cualquier vehículo que supere el límite señalizado se marca en el momento, no cuando corras la revisión de la próxima semana." },
      /*5 confirm*/ { changes: ["Regla \"Posted Speed — fleet-wide\" creada y activa en demo_fh_vegas4", "Notificación enviada a 1 gerente de flota"] },
      /*6 endcard*/ { lines: ["Conector MCP de Geotab", "Deja de adivinar por qué. Pregunta."] },
    ],
    choices: [
      { label: "🔧 Ahora revisa también las fallas",
        say: "Mientras esa alerta está activa, muéstrame la lista de trabajo de mantenimiento de esta flota." },
      { label: "⚡ Probar otro",
        say: "Muéstrame otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep3-answer": {
    h: "3297a318",
    events: [
      /*0 assistant*/ { text: "Voy a revisar las noticias de hoy en lugar de basarme en lo que ya sé sobre la zona de bajas emisiones de Valencia." },
      /*1 tool*/ { summary: "278 cámaras activas · multa legal de €200 · aplicación en disputa (ordenanza rechazada en dic. 2025)" },
      /*2 assistant*/ { text: "En realidad es más enredado de lo que esperaba: 278 cámaras ya activas, una multa legal de €200 en el papel, pero la ordenanza fue rechazada en diciembre, así que por ahora se está monitoreando, no multando. Voy a revisar si alguno de tus vehículos siquiera anda por esa zona antes de preocuparnos." },
      /*3 tool*/ { summary: "posiciones en vivo: Demo-23 y Demo-31 dentro del área de Valencia (~39.4°N)" },
      /*4 assistant*/ { text: "Qué bueno que revisé las noticias de hoy en lugar de quedarme con lo que ya sabía: la zona de bajas emisiones de Valencia está realmente en cambio ahora mismo. Cubre unos 27.8 km², la mayor parte de la ciudad, y ya hay 278 cámaras ANPR encendidas. La multa legal por una entrada no permitida es de €200, pero la ordenanza de la ciudad fue rechazada en diciembre, así que por ahora las cámaras están monitoreando, no multando, y ni siquiera las fuentes que encontré coinciden en si ya empezaron las sanciones. Se supone que las restricciones entran en vigor gradualmente entre 2026 y 2028, favoreciendo las etiquetas más limpias a medida que se endurecen.\n" +
        "\n" +
        "Y sí, esto te afecta: Demo - 23 y Demo - 31 están operando ahora mismo en el área de Valencia, así que, sean cuales sean las reglas finales, estás expuesto.\n" +
        "\n" +
        "Una salvedad: esto cambia de una semana a otra, así que yo lo volvería a confirmar en valencia.es antes de actuar." },
    ],
    choices: [
      { label: "🗺️ Crear la zona + alerta de entrada",
        say: "Crea una zona en Geotab que coincida con la ZBE de Valencia y agrega una alerta para cuando nuestros vehículos entren en ella." },
      { label: "🚐 ¿Cuáles son los vehículos afectados?",
        say: "¿Qué marca y modelo son Demo - 23 y Demo - 31?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep3-prefs": {
    h: "18da0c75",
    events: [
      /*0 assistant*/ { text: "Antes de configurarlo, dos preguntas rápidas para que de verdad se ajuste a tu forma de trabajar:\n" +
        "\n" +
        "Primero, ¿qué debería dispararla: solo las entradas, o también las salidas (útil si quieres confirmar que un vehículo volvió a salir de la zona)?\n" +
        "\n" +
        "Segundo, ¿quién debería recibirla: un gerente de flota o todo el grupo de operaciones de Valencia?" },
    ],
    choices: [
      { label: "🔔 Solo entrada → un gerente",
        say: "Solo alertas de entrada, enviadas a un gerente de flota." },
      { label: "🔔 Entrada + salida → todo el grupo de operaciones",
        say: "Alerta tanto de entrada como de salida, enviada a todo el grupo de operaciones de Valencia." },
    ],
  },
  "ep3-action": {
    h: "82c548ba",
    events: [
      /*0 assistant*/ { text: "Empiezo por la zona en sí: dibujando el polígono de la ZBE en Geotab." },
      /*1 tool*/ { summary: "Zona creada" },
      /*2 assistant*/ { text: "La zona está lista. Ahora la regla de entrada, que es lo que pediste." },
      /*3 tool*/ { summary: "Regla de entrada activa" },
      /*4 assistant*/ { text: "Y envío la alerta a tu gerente de flota." },
      /*5 tool*/ { summary: "Alerta enviada a 1 gerente" },
      /*6 assistant*/ { text: "Listo: la zona ZBE València está creada, la alerta de entrada está activa y va a un gerente. Te enterarás en el momento en que la aplicación de multas realmente se active, y no por una multa en el correo.\n" +
        "\n" +
        "Si más adelante quieres afinarla, podrías restringir la alerta solo a las etiquetas no permitidas (las camionetas más viejas sin distintivo ECO o Cero), pero por ahora es opcional." },
      /*7 endcard*/ { lines: ["Conector MCP de Geotab", "Las noticias cambiaron. Tu flota ya se adaptó."] },
    ],
    choices: [
      { label: "🗺️ Mostrar la zona en un mapa",
        say: "Muéstrame la zona ZBE y los vehículos afectados en un mapa." },
      { label: "⚡ Probar otro",
        say: "Muéstrame otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep3-action-wide": {
    h: "6bb56e25",
    events: [
      /*0 assistant*/ { text: "Empiezo por la zona en sí: dibujando el polígono de la ZBE en Geotab." },
      /*1 tool*/ { summary: "Zona creada" },
      /*2 assistant*/ { text: "La zona está lista. Ahora la regla: querías cubrir tanto la entrada como la salida." },
      /*3 tool*/ { summary: "Regla de entrada + salida activa" },
      /*4 assistant*/ { text: "Y envío la alerta a todo el grupo de operaciones de Valencia, no solo a un gerente." },
      /*5 tool*/ { summary: "Alerta enviada a todo el grupo de operaciones" },
      /*6 assistant*/ { text: "Listo: zona ZBE València creada, las alertas cubren entrada y salida, y llegan a todo el grupo de operaciones de Valencia, no solo a una persona. Cualquiera de ese equipo verá cuando un vehículo cruce el límite en cualquier dirección.\n" +
        "\n" +
        "El mismo paso opcional de antes si más adelante la quieres más estricta: restringirla solo a las etiquetas no permitidas." },
      /*7 endcard*/ { lines: ["Conector MCP de Geotab", "Las noticias cambiaron. Tu flota ya se adaptó."] },
    ],
    choices: [
      { label: "🗺️ Mostrar la zona en un mapa",
        say: "Muéstrame la zona ZBE y los vehículos afectados en un mapa." },
      { label: "⚡ Probar otro",
        say: "Muéstrame otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep3-map": {
    h: "c44de7c1",
    events: [
      /*0 map*/ { title: "ZBE València · zona + vehículos afectados" },
      /*1 assistant*/ { text: "Tanto Demo - 23 como Demo - 31 están ahora mismo justo dentro del límite de la zona: exactamente los dos que la nueva alerta va a vigilar." },
    ],
    choices: [
      { label: "🚐 ¿Qué marca y modelo son?",
        say: "¿Qué marca y modelo son exactamente Demo - 23 y Demo - 31?" },
      { label: "⚡ Probar otro",
        say: "Muéstrame otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-zonelife-answer": {
    h: "f088deb0",
    events: [
      /*0 assistant*/ { text: "Antes de construir algo de lo que vayas a depender, comprobemos que todo el ciclo de vida realmente funciona: crear una zona y una regla, confirmar que de verdad existen, luego eliminar ambas y confirmar que *de verdad* desaparecieron, no que solo se desactivaron. Primero reviso la línea base actual." },
      /*1 tool*/ { summary: "0 zonas actualmente en esta base de datos" },
      /*2 tool*/ { summary: "17 reglas: el conjunto estándar (Speeding, Harsh Braking, Collision, Seatbelt, …)" },
      /*3 assistant*/ { text: "Todavía no hay zonas, ya existen 17 reglas estándar y ninguna personalizada basada en zonas. Voy a crear un par desechable, con nombres que dejen clarísimo que son datos de prueba, verificarlos, luego eliminar ambos y confirmar que los conteos vuelvan a 0 y 17." },
    ],
    choices: [
      { label: "🧪 Adelante: crea la zona + regla de prueba",
        say: "Adelante: crea una zona y una regla de prueba desechables para que podamos verificar el ciclo de vida completo, incluida la eliminación." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep-zonelife-create": {
    h: "04de46c3",
    events: [
      /*0 assistant*/ { text: "Primero creo la zona: un pequeño polígono cerrado, con un nombre que no se pueda confundir con configuración real de la flota." },
      /*1 tool*/ { summary: "Zona creada" },
      /*2 assistant*/ { text: "La zona está lista; verifico que realmente se pueda recuperar antes de construir sobre ella, y luego agrego la regla vinculada." },
      /*3 tool*/ { summary: "rechazada: se requiere Groups" },
      /*4 assistant*/ { text: "El primer intento rebotó: `Undefined or empty ExceptionRule.Groups`. El esquema indica que `groups` es opcional, pero la API en vivo no está de acuerdo: todas las reglas reales de esta base de datos llevan `groups: [{ id: \"GroupCompanyId\" }]`, así que lo agrego y vuelvo a intentar en lugar de seguir adivinando." },
      /*5 tool*/ { summary: "Regla creada y vinculada a la zona" },
      /*6 assistant*/ { text: "Ambas creadas. Las recupero por id para confirmar que la referencia a la zona realmente se guardó, no solo que se aceptó." },
      /*7 tool*/ { summary: "confirmado: condition.zone.id coincide con la zona de prueba" },
      /*8 confirm*/ { changes: ["Zona \"ZTEST-DELETE-ME-2026-07-20\" creada en demo_fh_vegas4", "Regla \"RTEST-DELETE-ME-2026-07-20\" creada y vinculada a esa zona"] },
    ],
    choices: [
      { label: "🗑️ Ahora elimina ambas, primero la regla",
        say: "Bien: ahora elimina la regla, luego la zona, y confirma que ambas realmente desaparecieron." },
    ],
  },
  "ep-zonelife-delete": {
    h: "9d532755",
    events: [
      /*0 assistant*/ { text: "Elimino primero la regla y luego la zona: el orden más seguro y portable, sin importar lo que la API permita." },
      /*1 tool*/ { summary: "eliminada" },
      /*2 tool*/ { summary: "eliminada" },
      /*3 assistant*/ { text: "Ambas llamadas regresaron sin errores. Confirmo que realmente desaparecieron en lugar de confiar en una respuesta de éxito: reviso `Get` por id, no solo `activeTo`." },
      /*4 tool*/ { summary: "vacío: eliminada definitivamente, no retirada" },
      /*5 tool*/ { summary: "vacío: eliminada definitivamente, no retirada" },
      /*6 tool*/ { summary: "de vuelta en 0" },
      /*7 tool*/ { summary: "de vuelta en 17" },
      /*8 assistant*/ { text: "Confirmado: `Remove` realmente elimina en esta API; el `Get` de seguimiento regresó vacío, no un registro con `activeTo` en una fecha pasada. Eso importa, porque `activeFrom`/`activeTo` existen en ambas entidades para programación y fácilmente podrían confundirse con el mecanismo de eliminación; no lo son. Los conteos volvieron a la línea base (0 zonas, 17 reglas), así que no queda nada de la prueba." },
      /*9 confirm*/ { changes: ["Regla eliminada y confirmada como desaparecida (Get devuelve vacío, no un registro retirado)", "Zona eliminada y confirmada como desaparecida (Get devuelve vacío, no un registro retirado)", "Conteos de zonas y reglas de vuelta en la línea base (0 zonas / 17 reglas)"] },
      /*10 endcard*/ { lines: ["Conector MCP de Geotab", "Probado de punta a punta: crear, verificar, eliminar, verificar. No queda nada."] },
    ],
    choices: [
      { label: "⚠️ ¿Eliminar una regla borra su historial de excepciones?",
        say: "Espera: ¿esa llamada a Remove también habría borrado las excepciones históricas de esta regla? MyGeotab muestra una ventana de advertencia antes de eliminar una regla. ¿El conector MCP también advierte sobre eso?" },
      { label: "🔀 ¿Y si elimino primero la zona?",
        say: "¿Qué pasa si elimino la zona antes que la regla? ¿Da error, o la regla queda huérfana?" },
      { label: "⚡ Probar otro",
        say: "Muéstrame otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-zonelife-safety": {
    h: "10ac31ab",
    events: [
      /*0 assistant*/ { text: "Buen instinto revisarlo: voy a verlo bien en lugar de adivinar, sin tocar ninguna regla real ni su historial. Dos cosas: cuánto historial tiene realmente una regla real, y qué dice la documentación que le pasa al eliminarla." },
      /*1 tool*/ { summary: "518 eventos de excepción históricos vinculados a la regla estándar Speeding: solo lectura, nada modificado" },
      /*2 tool*/ { summary: "Documentación y soporte de MyGeotab: editar o eliminar una regla invalida las excepciones que generó" },
      /*3 assistant*/ { text: "Entonces: sí. Editar o eliminar una regla invalida su historial de `ExceptionEvent` asociado; es el comportamiento esperado dado cómo funcionan las reglas, no una falla. Lo que vale la pena hacer con cuidado es que esto no es un evento aparte en el registro de auditoría: el registro guarda el cambio de la regla en sí, no un inventario de lo que se invalidó debajo, así que no hay nada integrado que te diga después cuánto historial borró realmente un cambio.\n" +
        "\n" +
        "MyGeotab muestra una ventana de advertencia antes de una eliminación así: justo el tipo de momento en que una persona debería detenerse. Las llamadas a `Remove` que hice antes en esta prueba pasaron directo, sin preguntar, porque esa regla de prueba era nueva y no tenía excepciones asociadas, así que no había nada en juego. Pero la regla estándar real \"Speeding\" de esta misma base de datos tiene **518** eventos de excepción históricos. Cualquiera que llame a `Remove` sobre una regla así a través de este conector debería saber de antemano que tiene el mismo peso que la eliminación nativa; la capa MCP simplemente no se detiene a preguntar.\n" +
        "\n" +
        "Un hábito práctico para incorporar en cualquier automatización real: antes de llamar a `Remove` sobre una `Rule` real, revisa primero `GetCountOf(ExceptionEvent, search:{ruleSearch:{id:...}})`. `ExceptionEvent` solo lleva un id de regla, no un id de zona, así que no hay un filtro directo para una `Zone`: primero encuentra la(s) regla(s) que la referencian (`Get(Rule)`, comparando `condition.zone.id`) y luego corre el mismo conteo para cada una. Muéstrale a una persona lo que encuentres y obtén su aprobación explícita si no es cero. No confíes en que la herramienta MCP te detenga: no lo hará." },
    ],
    choices: [
      { label: "🛠️ Convertir esto en una skill de verificación reutilizable",
        say: "¿Debería esperar a que Geotab integre una protección así en el conector, o podemos empaquetar esta verificación en una skill nosotros mismos ahora mismo?" },
      { label: "🔀 ¿Y si elimino primero la zona?",
        say: "¿Qué pasa si elimino la zona antes que la regla? ¿Da error, o la regla queda huérfana?" },
      { label: "⚡ Probar otro",
        say: "Muéstrame otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-zonelife-skill": {
    h: "ca61ff48",
    events: [
      /*0 assistant*/ { text: "Buena pregunta para cerrar, y no tienes que elegir una sola opción, pero no hay razón para quedarse esperando. El hueco que acabamos de encontrar salió de probar el comportamiento real en esta misma conversación, que es la misma materia prima con la que se construye cada skill de este proyecto. Empaquetándola ahora." },
      /*1 tool*/ { summary: "SKILL.md escrito: verificación de ExceptionEvent antes de eliminar, aprobación humana ante cualquier conteo distinto de cero" },
      /*2 assistant*/ { text: "La empaqueté como geotab-safe-delete; abre la tarjeta para ver qué contiene. Es pequeña a propósito: una verificación y una regla sobre qué hacer con el resultado. La misma salvedad que con la skill de revisión semanal de antes en esta demo: queda aquí como **ejemplo práctico**, no como algo para instalar tal cual. Empaqueta tu propia versión a partir de una conversación real sobre tu propia flota, porque de ahí sale una skill en la que de verdad vale la pena confiar.\n" +
        "\n" +
        "Sobre esperar o construir: si más adelante Geotab lanza una confirmación equivalente a nivel de API o del conector, eso es estrictamente mejor; una protección de primera mano le gana a una del lado del cliente, y una skill como esta se retiraría a su favor. Pero eso no es razón para dejar el hueco abierto mientras tanto. Esta salió de probar el comportamiento real aquí mismo, el mismo patrón que cada skill de este proyecto: primero conversaciones, después skills. No necesitas la hoja de ruta de un proveedor para arreglar algo que puedes arreglar tú; solo no confundas un artefacto de demo con una protección desplegada." },
      /*3 endcard*/ { lines: ["Conector MCP de Geotab", "Pregunta una vez. Automatízalo. Compártelo con todo tu equipo."] },
    ],
    choices: [
      { label: "⚡ Probar otro",
        say: "Muéstrame otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-zonelife-cascade": {
    h: "d81850a7",
    events: [
      /*0 assistant*/ { text: "Buena pregunta: recomendé regla-y-después-zona como opción segura por defecto, pero probemos de verdad lo contrario: un segundo par desechable, y luego eliminar la zona mientras la regla todavía la referencia." },
      /*1 tool*/ { summary: "segunda zona de prueba creada" },
      /*2 tool*/ { summary: "segunda regla de prueba creada, vinculada a la zona" },
      /*3 tool*/ { summary: "zona eliminada mientras la regla aún la referenciaba: sin error" },
      /*4 tool*/ { summary: "vacío: la regla también desapareció" },
      /*5 tool*/ { summary: "de vuelta en 17: no solo oculta, realmente eliminada" },
      /*6 assistant*/ { text: "No hubo error de integridad referencial y la regla no quedó huérfana: se eliminó en cascada junto con la zona de la que dependía. El conteo de reglas volvió directo a la línea base de 17 sin que yo llamara nunca a `Remove(Rule)` directamente sobre ella.\n" +
        "\n" +
        "Es útil saberlo, pero yo igual no escribiría scripts que dependan de esto: un comportamiento en cascada así no está documentado, y no hay garantía de que todas las combinaciones de `baseType`/`conditionType` de una regla se comporten igual. En todo lo que automatices, elimina explícitamente la regla antes que la zona: es la suposición que sigue siendo correcta aunque esta cascada en particular no lo sea." },
      /*7 confirm*/ { changes: ["Confirmado: eliminar una zona referenciada no da error, aun con una regla dependiente asociada", "La regla dependiente ZoneStop se eliminó en cascada junto con su zona (Get y el conteo lo confirman)", "Conteos de vuelta en la línea base después de ambos órdenes: sin huérfanos en ninguna prueba"] },
      /*8 endcard*/ { lines: ["Conector MCP de Geotab", "Verificado, no supuesto: la eliminación realmente elimina."] },
    ],
    choices: [
      { label: "⚡ Probar otro",
        say: "Muéstrame otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep4-answer": {
    h: "48953206",
    events: [
      /*0 assistant*/ { text: "Cinco cosas, un solo hilo: vamos en orden. Empiezo por la geocerca del depósito." },
      /*1 tool*/ { summary: "Geocerca del depósito creada (300 m)" },
      /*2 assistant*/ { text: "Lista. Siguiente: la alerta de ralentí." },
      /*3 tool*/ { summary: "Regla de ralentí creada" },
      /*4 assistant*/ { text: "Activa: cualquier vehículo en ralentí por más de 15 minutos se marca. Ahora borro las fallas reconocidas de Demo - 06 tras su servicio." },
      /*5 tool*/ { summary: "Fallas reconocidas descartadas" },
      /*6 assistant*/ { text: "Borradas. Ahora el grupo de la región de Valencia." },
      /*7 tool*/ { summary: "Grupo creado (solo alta vía MCP)" },
      /*8 assistant*/ { text: "Creado. La última: enviar las alertas de ralentí a un gerente." },
      /*9 tool*/ { summary: "Alertas de ralentí enviadas a 1 gerente" },
      /*10 assistant*/ { text: "Las cinco listas. Un resumen para que quede registrado: una geocerca de 300 m alrededor del depósito principal, una alerta de ralentí después de 15 minutos, las fallas reconocidas de Demo - 06 borradas tras el servicio, tus vehículos de Valencia agrupados en una sola unidad para reportes y las alertas de ralentí enviadas a un gerente.\n" +
        "\n" +
        "No queda nada por configurar a mano: todo está activo ya." },
      /*11 endcard*/ { lines: ["Conector MCP de Geotab", "No solo reporta. Actúa."] },
    ],
    choices: [
      { label: "🔧 Ahora prioriza las fallas",
        say: "Ahora muéstrame la lista de trabajo de mantenimiento de esta flota." },
      { label: "🚐 ¿Qué hay en el nuevo grupo de Valencia?",
        say: "¿Qué tipo de vehículos quedaron en el grupo Valencia Region?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep5-answer": {
    h: "f3c33815",
    events: [
      /*0 system*/ { text: "Este flujo abarca tres conectores: Geotab + Gmail + Google Calendar." },
      /*1 assistant*/ { text: "Primero voy a sacar la falla de Demo - 06 para saber con qué estamos tratando realmente." },
      /*2 tool*/ { summary: "Demo - 06: dispositivo desconectado / falla de antena GPS, 18 jun 07:29" },
      /*3 assistant*/ { text: "Dispositivo desconectado más una falla de antena GPS: dejará de reportar su posición hasta que alguien lo revise. Voy a obtener la marca, el modelo y la placa para que el taller sepa qué le va a llegar." },
      /*4 tool*/ { summary: "Demo - 06: Mercedes-Benz Sprinter, placa VAL-4471-B" },
      /*5 assistant*/ { text: "Mercedes-Benz Sprinter, placa VAL-4471-B. Redactando ahora el correo al taller; lo dejo en Borradores, no lo envío sin que lo revises primero." },
      /*6 tool*/ { summary: "Borrador guardado (NO enviado)" },
      /*7 assistant*/ { text: "Guardado, no enviado. Ya que estoy aquí, también voy a apartar un horario tentativo de servicio para que no pierdas la ventana de reserva mientras esperas responder." },
      /*8 tool*/ { summary: "Horario tentativo de servicio: mañana 09:00" },
      /*9 assistant*/ { text: "Bien, así quedó todo entre tres herramientas. Demo - 06 registró una falla de dispositivo desconectado / antena GPS el día 18: es una Mercedes-Benz Sprinter, placa VAL-4471-B, y dejará de reportar su posición hasta que la revisen. Redacté un correo al taller con los datos del vehículo y de la falla, pero lo dejé en Borradores: no sale hasta que lo revises. Y puse un horario tentativo en el calendario para mañana a las 09:00, para que no pierdas la ventana de reserva mientras tanto.\n" +
        "\n" +
        "El borrador está ahí para cuando estés listo.\n" +
        "\n" +
        "(Esta demo apunta a un buzón y un calendario de prueba, nunca a un destinatario real.)" },
    ],
    choices: [
      { label: "📤 Enviar el borrador ahora",
        say: "Se ve bien: envía el borrador ahora." },
      { label: "🗓️ Solo confirmar el horario, retener el correo",
        say: "Deja el correo en Borradores por ahora; solo confirma la reserva en el calendario." },
    ],
  },
  "ep5-send": {
    h: "87ec946b",
    events: [
      /*0 tool*/ { summary: "Enviado a garage@test-mailbox.example" },
      /*1 assistant*/ { text: "Enviado. El taller ya tiene los detalles de la falla y la placa, y el horario de las 09:00 ya está en el calendario esperando su confirmación." },
      /*2 endcard*/ { lines: ["Conector MCP de Geotab", "Tu flota, conectada a las herramientas que ya usas."] },
    ],
    choices: [
      { label: "🚐 ¿Qué tipo de camioneta es Demo - 06?",
        say: "¿Qué marca y modelo es Demo - 06?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep5-hold": {
    h: "711c68c4",
    events: [
      /*0 assistant*/ { text: "Entendido: el correo se queda intacto en Borradores, y dejo el horario de las 09:00 en el calendario para que la ventana de reserva no se pierda mientras decides. No ha salido nada." },
      /*1 endcard*/ { lines: ["Conector MCP de Geotab", "Tu flota, conectada a las herramientas que ya usas."] },
    ],
    choices: [
      { label: "🚐 ¿Qué tipo de camioneta es Demo - 06?",
        say: "¿Qué marca y modelo es Demo - 06?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep13-salesforce": {
    h: "f993720f",
    events: [
      /*0 system*/ { text: "Este flujo abarca dos conectores: Geotab + Salesforce." },
      /*1 assistant*/ { text: "Empecemos por el registro GPS: ¿dónde estuvo realmente Demo - 12 ayer?" },
      /*2 tool*/ { summary: "Demo - 12 llegó al sitio del cliente ayer a las 14:32" },
      /*3 assistant*/ { text: "Dentro de la geocerca del cliente a las 14:32, mucho antes de las 16:00. Ahora voy a buscar el caso del que realmente se trata." },
      /*4 tool*/ { summary: "Caso 00012345: \"Delivery arrived after 16:00\": Abierto" },
      /*5 assistant*/ { text: "Ese es: alega una entrega tardía. Registro en él la marca de tiempo del GPS como prueba." },
      /*6 tool*/ { summary: "Comentario registrado en el caso 00012345" },
      /*7 assistant*/ { text: "Resumen rápido entre ambas herramientas: el registro GPS de Demo - 12 la ubica dentro de la geocerca del cliente ayer a las 14:32, no después de las 16:00 como dice el caso. Encontré el caso abierto (00012345, \"Delivery arrived after 16:00\") y registré esa marca de tiempo como comentario directamente en él.\n" +
        "\n" +
        "Quien lo tome después verá la prueba ahí mismo: sin hoja de cálculo aparte, sin \"déjame revisar el rastreador\".\n" +
        "\n" +
        "(La demo apunta a una organización de Salesforce de prueba, no a un registro real de cliente.)" },
    ],
    choices: [
      { label: "✉️ Cerrar también el caso y avisar al ejecutivo",
        say: "Adelante: cierra el caso y avísale al ejecutivo de cuenta que está resuelto." },
      { label: "📌 Solo dejar la prueba registrada, sin cerrarlo",
        say: "Déjalo registrado en el caso por ahora; no lo cierres todavía." },
    ],
  },
  "ep13-close": {
    h: "2d0a417b",
    events: [
      /*0 assistant*/ { text: "Lo cierro con el registro GPS como motivo de resolución." },
      /*1 tool*/ { summary: "Caso 00012345 cerrado" },
      /*2 assistant*/ { text: "Cerrado. Ahora le aviso al ejecutivo de cuenta para que dé seguimiento con el cliente." },
      /*3 tool*/ { summary: "Ejecutivo de cuenta notificado" },
      /*4 assistant*/ { text: "El caso 00012345 está cerrado, con la marca de tiempo del GPS registrada como motivo, y el ejecutivo de cuenta ya fue notificado para dar seguimiento directamente con el cliente." },
      /*5 endcard*/ { lines: ["Conector MCP de Geotab", "La verdad de tu flota, directo en el CRM."] },
    ],
    choices: [
      { label: "🚚 ¿Qué tipo de vehículo es Demo - 12?",
        say: "¿Qué marca y modelo es Demo - 12?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep13-leaveopen": {
    h: "1c1a1758",
    events: [
      /*0 assistant*/ { text: "Listo: la prueba del GPS quedó registrada como comentario en el caso 00012345, pero dejo el caso abierto para que quien lleve la conversación con el cliente lo cierre cuando esté listo." },
      /*1 endcard*/ { lines: ["Conector MCP de Geotab", "La verdad de tu flota, directo en el CRM."] },
    ],
    choices: [
      { label: "🚚 ¿Qué tipo de vehículo es Demo - 12?",
        say: "¿Qué marca y modelo es Demo - 12?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep7-ace": {
    h: "27f90de4",
    events: [
      /*0 tool*/ { summary: "respuesta en ranking + gráfico de barras + traza de razonamiento" },
      /*1 assistant*/ { text: "Ese es Geotab Ace haciendo lo suyo: pregunté en lenguaje natural, sin SQL, y escribió la consulta por su cuenta, la corrió en toda la flota y devolvió una respuesta en ranking, más un gráfico y su razonamiento.\n" +
        "\n" +
        "Pero fíjate en la forma: Demo - 08 se despega con 188, aproximadamente 3 veces el siguiente vehículo, y todos los demás van bajando normalmente después. Es la misma camioneta que ya apareció dos veces en esta revisión por fallas. Yo hablaría un momento con ese conductor antes de que se convierta en un tercer problema, aparentemente sin relación." },
      /*2 chart*/ { title: "Top 5 vehículos por eventos de exceso de velocidad · últimos 7 días (vía Ace)" },
    ],
    choices: [
      { label: "🧠 Mostrar el razonamiento de Ace",
        say: "Muéstrame cómo llegó Ace a eso." },
      { label: "🔔 Configurar una alerta de velocidad para toda la flota",
        say: "Configura una alerta por exceder el límite señalizado en toda la flota y envíala a un gerente de flota." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep7-reasoning": {
    h: "3b1485a0",
    events: [
      /*0 assistant*/ { text: "Ace muestra su trabajo, no solo la respuesta. Esto es lo que devolvió: entendió que querías los cinco vehículos con más eventos de exceso de velocidad en los últimos 7 días, con un conteo para cada uno. Para llegar ahí, recorrió los datos de eventos de la flota en ese periodo, aisló los eventos de exceso de velocidad por vehículo, los contó, los ordenó y devolvió los cinco principales: Demo - 08 con 188, luego 15, 01, 16 y 04, bajando hasta 39.\n" +
        "\n" +
        "Es útil tener ese rastro por si algún número no cuadra y quieres saber exactamente qué contó." },
      /*1 endcard*/ { lines: ["Conector MCP de Geotab", "Pregunta en lenguaje natural. Ace hace el análisis."] },
    ],
    choices: [
      { label: "🔧 Ahora pregúntale a Ace por las fallas",
        say: "Ahora pregúntale a Ace qué vehículos tienen más fallas esta semana." },
      { label: "📋 Correr la revisión semanal completa",
        say: "Ahora dame la revisión semanal completa de la flota." },
      { label: "⚡ Probar otro",
        say: "Muéstrame otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep8-maintenance": {
    h: "13e8eb8e",
    events: [
      /*0 assistant*/ { text: "Primero voy a contar los registros de fallas de esta semana." },
      /*1 tool*/ { summary: "599 registros de fallas esta semana" },
      /*2 assistant*/ { text: "599 suena a incendios por todas partes. Antes de concluir eso, voy a pedirle a Ace que lo desglose por vehículo: ese número por sí solo no te dice dónde mirar realmente." },
      /*3 tool*/ { summary: "un vehículo domina: Demo-08 con 112 de 599" },
      /*4 assistant*/ { text: "599 registros de fallas esta semana suena a un incendio que apagar en todas partes. En realidad no lo es.\n" +
        "\n" +
        "Cuando Ace lo desglosa por vehículo, una camioneta concentra la mayoría: Demo - 08 registró 112 fallas, aproximadamente 1 de cada 5 del total de la flota. Todo lo demás está en un solo dígito, de 4 a 7 cada uno.\n" +
        "\n" +
        "Así que tu lista de trabajo prácticamente se arma sola: lleva primero a Demo - 08; no son 50 problemas, es básicamente uno. Los otros cuatro pueden esperar. Y como contexto, la flota de Las Vegas tuvo cero fallas activas esta semana, así que esto realmente es específico de esta camioneta y no algo sistémico." },
      /*5 chart*/ { title: "Top 5 vehículos por registros de fallas · últimos 7 días (vía Ace)" },
    ],
    choices: [
      { label: "🛠️ Convertir esta priorización en una skill reutilizable",
        say: "Convierte esta priorización de mantenimiento en una skill reutilizable que todo mi taller pueda correr cada semana." },
      { label: "🚐 ¿Qué es exactamente Demo - 08?",
        say: "¿Qué marca y modelo es Demo - 08?" },
      { label: "🔎 ¿Por qué sigue fallando? Investiga más",
        say: "No te detengas ahí: ¿por qué Demo - 08 sigue fallando? Investígalo." },
      { label: "📧 Agendarlo en el taller ahora",
        say: "Obtén los detalles de la falla de Demo - 08, redacta un correo al taller y pon un horario tentativo de servicio en mi calendario para mañana por la mañana." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep9-fleet-08": {
    h: "00e026f9",
    events: [
      /*0 assistant*/ { text: "Voy a revisar el VIN de Demo - 08." },
      /*1 tool*/ null,
      /*2 tool*/ null,
      /*3 assistant*/ { text: "Demo - 08 es una Mercedes-Benz Sprinter 907, una de tus 5 camionetas ligeras, de Demo - 06 a Demo - 10." },
    ],
    choices: [
      { label: "🔎 ¿Por qué sigue fallando? Investiga más",
        say: "No te detengas ahí: ¿por qué Demo - 08 sigue fallando? Investígalo." },
      { label: "📧 Agendarlo en el taller ahora",
        say: "Obtén los detalles de la falla de Demo - 08, redacta un correo al taller y pon un horario tentativo de servicio en mi calendario para mañana por la mañana." },
      { label: "📊 ¿Qué más hay en la flota?",
        say: "¿Y el resto de la flota? ¿Cuál es la composición completa?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep9-fleet-06": {
    h: "fcef7cbf",
    events: [
      /*0 assistant*/ { text: "Voy a revisar el VIN de Demo - 06." },
      /*1 tool*/ null,
      /*2 tool*/ null,
      /*3 assistant*/ { text: "Demo - 06 es una Mercedes-Benz Sprinter 907, una de tus 5 camionetas ligeras." },
    ],
    choices: [
      { label: "📊 ¿Qué más hay en la flota?",
        say: "¿Y el resto de la flota? ¿Cuál es la composición completa?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep9-fleet-12": {
    h: "2b2455b4",
    events: [
      /*0 assistant*/ { text: "Voy a revisar el VIN de Demo - 12." },
      /*1 tool*/ null,
      /*2 tool*/ null,
      /*3 assistant*/ { text: "Demo - 12 es un Mercedes-Benz New Actros, una de tus 10 unidades de carga pesada, lo cual cuadra con que haga entregas a clientes." },
    ],
    choices: [
      { label: "📊 ¿Qué más hay en la flota?",
        say: "¿Y el resto de la flota? ¿Cuál es la composición completa?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep9-fleet-23-31": {
    h: "c7653ad2",
    events: [
      /*0 assistant*/ { text: "Voy a revisar ambos VIN." },
      /*1 tool*/ { summary: "2 VIN" },
      /*2 tool*/ null,
      /*3 assistant*/ { text: "Distintos tipos de vehículo, misma zona: Demo - 23 es un tractocamión Renault T (Euro 6) y Demo - 31 es un autobús MAN Lion's Intercity; uno transporta carga y el otro cubre una ruta de pasajeros, y ambos están dentro de la ZBE ahora mismo." },
    ],
    choices: [
      { label: "📊 ¿Qué más hay en la flota?",
        say: "¿Y el resto de la flota? ¿Cuál es la composición completa?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep9-fleet-01-vegas": {
    h: "ae5a3d57",
    events: [
      /*0 assistant*/ { text: "Voy a revisar el VIN de Demo - 01." },
      /*1 tool*/ null,
      /*2 tool*/ { summary: "Ford Transit 250 de carga" },
      /*3 assistant*/ { text: "Demo - 01 es una Ford Transit 250 de carga, una de 35 en esta flota; las otras 15 son pickups F-150 para los servicios más pesados." },
    ],
    choices: [
      { label: "📊 ¿Qué más hay en la flota de Las Vegas?",
        say: "¿Y el resto de la flota de Las Vegas? ¿Cuál es la composición completa?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep9-fleet-vegas": {
    h: "07b77288",
    events: [
      /*0 tool*/ { summary: "50 vehículos, 50 VIN distintos" },
      /*1 tool*/ null,
      /*2 assistant*/ { text: "Las Vegas es una flota de servicio en campo: 35 camionetas de carga Ford Transit 250 que hacen la mayor parte del trabajo de despacho en el centro, y 15 pickups Ford F-150 para los servicios más pesados." },
    ],
    choices: [
      { label: "🔋 ¿Esta flota es buena candidata para eléctricos?",
        say: "Trayectos urbanos cortos y de regreso al depósito por la noche: ¿Las Vegas es buena candidata para pasar a eléctricos?" },
      { label: "🚦 Analizar el exceso de velocidad en Las Vegas",
        say: "Analiza Las Vegas a fondo: ¿por qué subió el exceso de velocidad ahí?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep9-fleet-hub": {
    h: "995935ac",
    events: [
      /*0 assistant*/ { text: "Primero voy a sacar los VIN de toda la flota." },
      /*1 tool*/ { summary: "50 vehículos, 5 prefijos WMI+VDS distintos" },
      /*2 assistant*/ { text: "Buenas noticias para la decodificación: los primeros 11 caracteres (fabricante + código de modelo) solo se repiten en 5 patrones entre los 50, así que solo necesito decodificar un VIN por patrón para obtener el modelo de toda la flota, no los 50." },
      /*3 tool*/ { summary: "autobús MAN · Mercedes Sprinter · Actros · Renault T · Mercedes Intouro" },
      /*4 assistant*/ { text: "Listo, decodificado. Es una operación de transporte de pasajeros, no una flota de reparto: 30 autobuses interurbanos (25 MAN Lion's Intercity más 5 Mercedes-Benz Intouro), 15 unidades de carga pesada (10 Mercedes Actros y 5 tractocamiones Renault T, Euro 6) y solo 5 camionetas ligeras: Mercedes-Benz Sprinter, de Demo - 06 a Demo - 10, que incluye tu foco de fallas Demo - 08.\n" +
        "\n" +
        "Sobre los eléctricos: las 5 Sprinter son las candidatas realistas a corto plazo, ligeras, urbanas y con rutas predecibles. Los autobuses y los tractocamiones de 40 toneladas todavía están lejos de ser viables." },
      /*5 endcard*/ { lines: ["Conector MCP de Geotab", "Sabe lo que realmente manejas, no solo cuántos."] },
    ],
    choices: [
      { label: "📊 Mostrarlo como gráfico",
        say: "Muéstrame la composición de la flota como gráfico." },
      { label: "🌍 ¿Cuáles pasan por la zona de Valencia?",
        say: "¿Cuáles de estos vehículos circulan por la zona de bajas emisiones de Valencia?" },
      { label: "🔋 Armar el caso detallado de eléctricos",
        say: "Arma el caso detallado para pasar las Sprinter a eléctricas: ¿qué se necesitaría?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep9-fleet": {
    h: "966dc41f",
    events: [
      /*0 assistant*/ { text: "Primero voy a sacar los VIN de toda la flota." },
      /*1 tool*/ { summary: "50 vehículos, 5 prefijos WMI+VDS distintos" },
      /*2 assistant*/ { text: "Buenas noticias para la decodificación: los primeros 11 caracteres (fabricante + código de modelo) solo se repiten en 5 patrones entre los 50, así que solo necesito decodificar un VIN por patrón para obtener el modelo de toda la flota, no los 50." },
      /*3 tool*/ { summary: "autobús MAN · Mercedes Sprinter · Actros · Renault T · Mercedes Intouro" },
      /*4 assistant*/ { text: "Listo, decodificado. Es una operación de transporte de pasajeros, no una flota de reparto: 30 autobuses interurbanos (25 MAN Lion's Intercity más 5 Mercedes-Benz Intouro), 15 unidades de carga pesada (10 Mercedes Actros y 5 tractocamiones Renault T, Euro 6) y solo 5 camionetas ligeras: Mercedes-Benz Sprinter, de Demo - 06 a Demo - 10, que incluye tu foco de fallas Demo - 08." },
      /*5 endcard*/ { lines: ["Conector MCP de Geotab", "Sabe lo que realmente manejas, no solo cuántos."] },
    ],
    choices: [
      { label: "📊 Mostrarlo como gráfico",
        say: "Muéstrame la composición de la flota como gráfico." },
      { label: "🌍 ¿Cuáles pasan por la zona de Valencia?",
        say: "¿Cuáles de estos vehículos circulan por la zona de bajas emisiones de Valencia?" },
      { label: "🔋 Profundizar en el caso de eléctricos",
        say: "Arma el caso para pasar las Sprinter a eléctricas: ¿qué se necesitaría?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep9-fleet-chart": {
    h: "a31b2885",
    events: [
      /*0 chart*/ { title: "Composición de la flota · demo_fh4 (decodificada de los VIN)",
        bars: ["MAN Lion's Intercity (autobús)", "Mercedes Actros (camión)", "Renault T (tractocamión)", "Mercedes Intouro (autobús)", "Mercedes Sprinter (camioneta)"] },
      /*1 assistant*/ { text: "30 autobuses, 15 unidades de carga pesada, 5 camionetas ligeras: las Sprinter son realmente el único segmento que vale la pena revisar para pasar a eléctricos." },
    ],
    choices: [
      { label: "🌍 ¿Cuáles pasan por la zona de Valencia?",
        say: "¿Cuáles de estos vehículos circulan por la zona de bajas emisiones de Valencia?" },
      { label: "🔋 Profundizar en el caso de eléctricos",
        say: "Arma el caso para pasar las Sprinter a eléctricas: ¿qué se necesitaría?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep9-ev": {
    h: "f970c85e",
    events: [
      /*0 tool*/ { summary: "las Sprinter promedian ~62 mi/día, viaje más largo ~140 mi" },
      /*1 assistant*/ { text: "Las cinco Sprinter promedian unas 62 millas al día, con un viaje más largo de unas 140 millas, y hay un hueco de aproximadamente 9 horas por la noche entre rutas. Eso queda holgadamente dentro de lo que una camioneta eléctrica mediana puede hacer con una carga, y ese hueco nocturno sirve perfectamente como tiempo de carga.\n" +
        "\n" +
        "Compáralo con los autobuses o los tractocamiones Actros/Renault: larga distancia, cargas más pesadas, tiempos de vuelta ajustados, nada de lo cual encaja todavía con un perfil eléctrico. Las Sprinter son realmente la única parte de esta flota donde el cambio es una decisión a corto plazo, no un \"algún día\".\n" +
        "\n" +
        "(Vale la pena aclararlo: las cifras de kilometraje diario aquí son ilustrativas para la demo, coherentes en dirección con el uso típico de las Sprinter, pero no un total en vivo que yo le citaría a un proveedor.)" },
      /*2 endcard*/ { lines: ["Conector MCP de Geotab", "Sabe lo que realmente manejas, no solo cuántos."] },
    ],
    choices: [
      { label: "🌍 Cruzarlas con la zona de Valencia",
        say: "¿Estas mismas Sprinter circulan por la zona de bajas emisiones de Valencia?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep9-ev-vegas": {
    h: "506ef5bd",
    events: [
      /*0 tool*/ { summary: "muestra de Transit ~58 mi/día; muestra de F-150 (Demo - 45) ~71 mi/día" },
      /*1 assistant*/ { text: "Separándolo por tipo de vehículo: las camionetas Transit promedian ~58 millas al día con un hueco nocturno de ~11 horas, holgadamente dentro del alcance de una camioneta eléctrica mediana. Las F-150 (muestreadas con Demo - 45) hacen servicios más largos y pesados, ~71 millas al día con un viaje de 130 millas; todavía es viable para una pickup eléctrica, pero es un caso más ajustado que el de las camionetas. De cualquier forma, el mayor obstáculo para la conversación sobre eléctricos en esta flota no es el hardware, es el exceso de velocidad: arregla primero el lado del comportamiento y luego el caso de los eléctricos será más fácil de presentar al directorio.\n" +
        "\n" +
        "(Vale la pena aclararlo: las cifras de kilometraje diario aquí son ilustrativas para la demo, coherentes en dirección con el uso de las rutas de Transit/F-150, pero no un total en vivo que yo le citaría a un proveedor.)" },
      /*2 endcard*/ { lines: ["Conector MCP de Geotab", "Sabe lo que realmente manejas, no solo cuántos."] },
    ],
    choices: [
      { label: "🚦 Analizar el exceso de velocidad en Las Vegas",
        say: "Analiza Las Vegas a fondo: ¿por qué subió el exceso de velocidad ahí?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep10-postedspeed": {
    h: "fed5d963",
    events: [
      /*0 tool*/ { summary: "límites señalizados por tramo a lo largo de la ruta · 10–65 mph" },
      /*1 assistant*/ { text: "Cuando un conductor disputa una alerta de exceso de velocidad, no deberías tener que discutir de memoria. Saqué el límite de velocidad señalizado a lo largo de la ruta real de Demo - 01 el día 18, tramo por tramo.\n" +
        "\n" +
        "La ruta pasó por límites de 10 hasta 65 mph: los tramos rápidos llegan a 65 (105 km/h), con muchas vías urbanas de 35–45 mph intercaladas. Unos cuantos tramos regresan sin límite registrado o marcados como estimaciones, así que yo trataría esos puntos específicos como de baja confianza y no como evidencia sólida.\n" +
        "\n" +
        "Esa es la diferencia entre \"ibas con exceso de velocidad\" y \"en este tramo de 35 mph a las 00:13 ibas por encima\": una conversación de coaching basada en la vía real, no en una corazonada. También respalda el hallazgo anterior de exceso de velocidad en toda la flota: los límites son reales y verificables, así que la solución realmente es política más alertas en vivo." },
    ],
    choices: [
      { label: "🔔 Configurar una alerta de velocidad para toda la flota",
        say: "Configura una alerta por exceder el límite señalizado en toda la flota y envíala a un gerente de flota." },
      { label: "📹 Sacar el video de la dashcam de ese momento",
        say: "Ahora saca el clip de la dashcam de ese tramo para ver qué pasó realmente." },
      { label: "🚐 ¿Qué tipo de vehículo es Demo - 01?",
        say: "¿Qué marca y modelo es Demo - 01?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep12-investigate": {
    h: "c2d66b30",
    events: [
      /*0 tool*/ { summary: "Demo - 08: 14 fallas en 30 días, 9 de ellas con el mismo código" },
      /*1 assistant*/ { text: "Antes de sacar conclusiones, voy a revisar si es solo exposición: una camioneta que pasa más tiempo en la calle naturalmente acumula más fallas. Comparando su kilometraje con el promedio de la flota." },
      /*2 tool*/ { summary: "Demo - 08: 2,140 mi en 30 días vs. promedio de la flota de 5,800 mi" },
      /*3 assistant*/ { text: "Lo contrario de lo que esperaba: Demo - 08 ha recorrido menos de un tercio del promedio de la flota este mes. Menos millas pero más fallas descarta la exposición, en todo caso.\n" +
        "\n" +
        "Siguiente hipótesis: conducción brusca que provoca falsos positivos en los sensores del motor. Voy a revisar sus eventos de excepción." },
      /*4 tool*/ { summary: "Demo - 08: 3 eventos de frenado brusco en 30 días (promedio de la flota: 2.5)" },
      /*5 assistant*/ { text: "Eso tampoco explica nada: está cerca del promedio de la flota, nada apunta a un manejo brusco. Así que tampoco es el comportamiento del conductor.\n" +
        "\n" +
        "De vuelta al desglose de fallas: 9 de las 14 son exactamente el mismo código, dispositivo desconectado. Voy a sacar las fechas para ver si se agrupan." },
      /*6 tool*/ { summary: "las 9 con fecha posterior al 22 de mayo, ninguna antes" },
      /*7 assistant*/ { text: "Ahí está: las 9 fallas de \"dispositivo desconectado\" empiezan el 22 de mayo, ninguna antes. Eso no es desgaste aleatorio, es un momento puntual en que algo cambió. Parece un conector de alimentación o un arnés flojo: una desconexión intermitente, no nueve incidentes separados sin relación.\n" +
        "\n" +
        "Así que tomó tres rondas llegar aquí: no es exposición, no es el conductor, es solo un conector desde una fecha. Vale la pena que el taller revise el arnés en lugar de perseguir cada falla por separado." },
    ],
    choices: [
      { label: "📧 Falla → correo al taller → agendar servicio",
        say: "Obtén los detalles de la falla de Demo - 08, redacta un correo al taller sobre el conector de alimentación flojo y pon un horario tentativo de servicio en mi calendario para mañana por la mañana." },
      { label: "🔧 Ahora prioriza el resto de la flota",
        say: "Ahora muéstrame la lista de trabajo de mantenimiento de esta flota." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-dispatch": {
    h: "b7504f41",
    events: [
      /*0 tool*/ { summary: "50 posiciones en vivo · 21 en movimiento, 29 estacionados ahora mismo" },
      /*1 assistant*/ { text: "Saqué las posiciones en vivo de toda la flota en lugar de adivinar.\n" +
        "\n" +
        "Demo - 45 es el más cercano, a aproximadamente 1.0 milla del centro, y está estacionado, así que realmente está libre. Demo - 50 le sigue de cerca a 1.1 millas, también estacionado. Demo - 01 está más cerca que la mayoría, pero ya va circulando a 59 mph, así que el más cercano no es lo mismo que el disponible: queda descartado.\n" +
        "\n" +
        "Las posiciones de ambos candidatos tienen segundos de antigüedad (último reporte ~20 s antes de esta consulta), así que despacha con la posición en vivo, no con un mapa en caché." },
    ],
    choices: [
      { label: "📊 Mostrar las distancias en un gráfico",
        say: "Muéstrame en un gráfico la distancia de cada vehículo al trabajo." },
      { label: "🗺️ Mostrarme en un mapa",
        say: "Muéstrame en un mapa dónde están estos vehículos." },
      { label: "🚐 Despachar a Demo - 45",
        say: "Envía a Demo - 45 al trabajo." },
      { label: "🚐 Mejor despachar a Demo - 50",
        say: "Mejor envía a Demo - 50 al trabajo." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-dispatch-send-45": {
    h: "eb05f1cd",
    events: [
      /*0 tool*/ { summary: "Trabajo asignado a Demo - 45" },
      /*1 assistant*/ { text: "Demo - 45 está despachado: la unidad libre más cercana, a aproximadamente 1.0 milla. Demo - 50 queda disponible como respaldo." },
      /*2 endcard*/ { lines: ["Conector MCP de Geotab", "Despacha con la posición en vivo, no con un mapa en caché."] },
    ],
    choices: [
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-dispatch-send-50": {
    h: "50cb849c",
    events: [
      /*0 tool*/ { summary: "Trabajo asignado a Demo - 50" },
      /*1 assistant*/ { text: "Demo - 50 está despachado: a 1.1 millas y libre. Queda anotado que Demo - 45 era la opción más cercana si la próxima vez necesitas una hora de llegada más rápida." },
      /*2 endcard*/ { lines: ["Conector MCP de Geotab", "Despacha con la posición en vivo, no con un mapa en caché."] },
    ],
    choices: [
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-dispatch-map": {
    h: "d6e6a859",
    events: [
      /*0 map*/ { title: "Posiciones en vivo vs. el trabajo · centro de Las Vegas",
        summary: "Las unidades libres más cercanas están a una o dos cuadras del trabajo en el centro",
        pins: ["Sitio del trabajo", null, null, "Demo - 01 ocupado"] },
      /*1 assistant*/ { text: "Las dos unidades libres están justo alrededor del sitio del trabajo: Demo - 45 un poco más cerca, Demo - 50 a poco más de una cuadra. Demo - 01 está más allá y sigue en movimiento, así que no entra en juego." },
    ],
    choices: [
      { label: "🚐 Despachar a Demo - 45",
        say: "Envía a Demo - 45 al trabajo." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-dispatch-chart": {
    h: "8cc16278",
    events: [
      /*0 chart*/ { title: "Distancia al trabajo (centro de Las Vegas) · millas",
        bars: ["Demo - 45 (libre)", "Demo - 50 (libre)", "Demo - 01 (ocupado)"] },
      /*1 assistant*/ { text: "Demo - 45 y Demo - 50 están a menos de milla y media y libres: cualquiera sirve. Demo - 01 técnicamente está más cerca, pero ya está en un trabajo." },
    ],
    choices: [
      { label: "🚐 Despachar a Demo - 50",
        say: "Envía a Demo - 50 al trabajo." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-exec": {
    h: "537b99f3",
    events: [
      /*0 system*/ { text: "Consultando **ambas** bases de datos demo: demo_fh_vegas4 (Las Vegas) y demo_fh4 (España)…" },
      /*1 assistant*/ { text: "Empiezo por la utilización en este momento, primero Las Vegas." },
      /*2 tool*/ { summary: "21 / 50 en movimiento ahora mismo (42%)" },
      /*3 assistant*/ { text: "Las Vegas está en 42%. Ahora España." },
      /*4 tool*/ { summary: "10 / 50 en movimiento ahora mismo (20%)" },
      /*5 assistant*/ { text: "España está en 20%, alrededor de la mitad de la utilización de Las Vegas. Siguiente, seguridad: eventos de excepción esta semana, primero Las Vegas." },
      /*6 tool*/ { summary: "4,933 eventos de excepción esta semana" },
      /*7 assistant*/ { text: "4,933 en Las Vegas. Y el conteo de España para la misma semana." },
      /*8 tool*/ { summary: "1,347 eventos de excepción esta semana" },
      /*9 assistant*/ { text: "Poniendo ambas flotas lado a lado: la utilización en este momento es Las Vegas 21/50 en movimiento (42%) vs. España 10/50 (20%). En seguridad, Las Vegas registró 4,933 excepciones esta semana vs. 1,347 de España, casi 4 veces más, lo que coincide con el patrón de exceso de velocidad en toda la flota que ya se había señalado.\n" +
        "\n" +
        "El mantenimiento va al revés: España registró 599 fallas (una camioneta Sprinter, Demo - 08, concentra 112) vs. cero de Las Vegas. Y en sostenibilidad, ya se decodifican los VIN de ambas flotas: la de España son 30 autobuses, 15 camiones/tractocamiones pesados y 5 camionetas Sprinter candidatas a eléctricas, mientras que Las Vegas son 35 camionetas de carga Transit y 15 pickups F-150 haciendo trayectos urbanos cortos. En el papel, Las Vegas es en realidad el caso más fuerte para eléctricos; lo que la frena para esa conversación es el exceso de velocidad, no el hardware.\n" +
        "\n" +
        "Dos flotas, dos modos de falla distintos: el riesgo de Las Vegas es de comportamiento, el de España es mecánico y concentrado. Vale la pena presentarle cada una al directorio por separado, porque necesitan soluciones distintas." },
    ],
    choices: [
      { label: "💰 Ponerle cifras (caso de ROI)",
        say: "Ponle cifras a esto: ¿por dónde pierde dinero la flota y qué se puede recuperar?" },
      { label: "📊 Desglosarlo en gráficos",
        say: "Desglósalo en gráficos." },
      { label: "🚦 Analizar Las Vegas: el riesgo de comportamiento",
        say: "Analiza primero Las Vegas a fondo: ¿por qué subió el exceso de velocidad ahí?" },
      { label: "🔧 Analizar España: el riesgo mecánico",
        say: "Analiza primero España a fondo: ¿qué está pasando con todas esas fallas?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-exec-chart": {
    h: "f78ae2c8",
    events: [
      /*0 chart*/ { title: "Utilización ahora mismo · vehículos en movimiento / 50",
        bars: [null, "España"] },
      /*1 chart*/ { title: "Excepciones (7 d) y fallas (7 d) · ambas flotas",
        bars: ["Exc. Vegas", "Exc. España", "Fallas España", "Fallas Vegas"] },
      /*2 assistant*/ { text: "Las Vegas maneja más y rompe más las reglas; España maneja menos pero se descompone más. Mismo tamaño de flota, perfil de riesgo opuesto." },
    ],
    choices: [
      { label: "🚦 Analizar el exceso de velocidad en Las Vegas",
        say: "Analiza Las Vegas a fondo: ¿por qué subió el exceso de velocidad ahí?" },
      { label: "🔧 Analizar las fallas en España",
        say: "Analiza España a fondo: ¿qué está pasando con todas esas fallas?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-dashcam": {
    h: "e1ec3436",
    events: [
      /*0 tool*/ { summary: "no se encontraron registros multimedia" },
      /*1 assistant*/ { text: "SearchMedia es una herramienta real y en vivo, pero esta base de datos demo no tiene hardware de dashcam registrado, así que realmente regresa vacía (la base de datos demo de España devuelve un error de servidor para la misma llamada). No voy a inventar un resultado para una herramienta que nos acaba de decir que no.\n" +
        "\n" +
        "Lo que sí puedo mostrarte es cómo se ve esta revisión una vez que hay multimedia de cámaras conectada, marcado claramente abajo como reconstrucción, no como captura." },
      /*2 media*/ { caption: "Dashcam frontal, Demo - 01: evento de frenado brusco (ilustrativo; prompt de generación en media/README.md).",
        fallbackText: "Todavía no se generó ningún clip: consulta media/README.md para ver el prompt y luego coloca el archivo en media/." },
      /*3 assistant*/ { text: "Cuando un video así esté realmente conectado, la petición no cambia mucho (*\"saca el clip de esa alerta de exceso de velocidad de Demo - 01\"*), pero podría entregarte el momento en sí, no solo la telemetría. Combínalo con la verificación del límite señalizado: la vía te dice el límite y el clip te dice lo que vio el conductor." },
      /*4 endcard*/ { lines: ["Conector MCP de Geotab", "El mismo conector, cuando haya multimedia de cámaras registrada; hoy es honesto sobre no tener ninguna."] },
    ],
    choices: [
      { label: "🔔 Configurar la alerta de velocidad de todos modos",
        say: "Configura de todos modos esa alerta por exceder el límite señalizado en toda la flota." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-safety-risk": {
    h: "365a3150",
    events: [
      /*0 assistant*/ { text: "Voy a armarte un buen scorecard de seguridad de conductores para la semana; primero confirmo quién va realmente al volante de cada vehículo." },
      /*1 tool*/ { summary: "49 de 50 vehículos tienen un conductor asignado en turno esta semana" },
      /*2 assistant*/ { text: "Bien: la identificación de conductor está activa, así que puedo atribuir el riesgo a la persona y no solo al vehículo. Ahora puntúo a cada conductor: Ace combina su exceso de velocidad, frenado/aceleración/giro bruscos, cinturón de seguridad y cualquier evento de colisión en una sola puntuación de seguridad ponderada, igual que lo hace el Safety Center de Geotab." },
      /*3 tool*/ { summary: "10 conductores más riesgosos · puntuaciones 47–68 vs. promedio de la flota 78" },
      /*4 assistant*/ { text: "Esta es tu semana. La puntuación de seguridad promedio de la flota es **78** (la referencia de la comunidad Geotab para flotas similares es ~82) y bajó **6% respecto a la semana anterior**, así que la tendencia va en la dirección equivocada, sobre todo por la velocidad.\n" +
        "\n" +
        "**Tus diez conductores más riesgosos:**\n" +
        "\n" +
        "1. **Marcus Bell** (Demo - 08): puntuación 47 · 131 eventos · *Exceso de velocidad 109, frenado brusco 14, cinturón 8*\n" +
        "2. **Tina Alvarez** (Demo - 22): 52 · 119 · *Aceleración brusca 31, exceso de velocidad 74, giros 14*\n" +
        "3. **Sam Whitfield** (Demo - 33): 55 · 102 · *Frenado brusco 41, exceso de velocidad 56*\n" +
        "4. **Devon Carter** (Demo - 15): 58 · 118 · *Exceso de velocidad 107, frenado brusco 9*\n" +
        "5. **Priya Nair** (Demo - 01): 61 · 121 · *Exceso de velocidad 111*\n" +
        "6. **Luis Romero** (Demo - 04): 63 · 117 · *Exceso de velocidad 110*\n" +
        "7. **Grace Kim** (Demo - 10): 65 · 116 · *Exceso de velocidad 110*\n" +
        "8. **Andre Foster** (Demo - 25): 66 · 110 · *Exceso de velocidad 107*\n" +
        "9. **Ben Ortiz** (Demo - 16): 67 · 113 · *Exceso de velocidad 107*\n" +
        "10. **Chloe Tran** (Demo - 20): 68 · 109 · *Exceso de velocidad 107*\n" +
        "\n" +
        "La lectura detrás de la lista importa más que la lista. **Siete de los diez solo tienen exceso de velocidad**, agrupados a pocos puntos entre sí: es un problema sistémico (rutas y límites compartidos), y la solución es una política más una alerta en vivo, no diez conversaciones por separado.\n" +
        "\n" +
        "Pero **tres rompen ese patrón y merecen una conversación de verdad esta semana**: Marcus Bell es el único riesgo multifactor (velocidad *y* frenado *y* cinturón, la combinación que las aseguradoras ponderan más para la probabilidad de colisión); Tina Alvarez es tu caso de agresividad (31 aceleraciones bruscas); y Sam Whitfield tiene menos eventos, pero los más *graves*: 41 frenadas bruscas. Fíjate en que queda tercero por puntuación a pesar de tener el menor número de eventos: la gravedad pesa más que el volumen, y justo por eso la puntuación es mejor que un conteo bruto.\n" +
        "\n" +
        "Si quieres hablar de dinero: los eventos de frenado brusco y de exceso de velocidad son los dos predictores telemáticos más fuertes de colisiones con culpa, y una sola colisión con culpa en una flota como esta promedia fácilmente cinco cifras una vez que sumas el tiempo de inactividad y el impacto en la prima. Hacer coaching a los tres conductores multifactor es el riesgo más barato que vas a reducir en todo el trimestre.\n" +
        "\n" +
        "*(Los nombres de conductores en esta demo son ficticios, pero esta es exactamente la vista que ve un gerente cuando la identificación de conductor está activa y tiene permiso para verla.)*" },
      /*5 chart*/ { title: "Puntuación de seguridad por conductor · los 10 más riesgosos esta semana (más bajo = más riesgo · promedio de la flota 78)" },
    ],
    choices: [
      { label: "🛠️ Convertir esto en una skill semanal de scorecard de seguridad",
        say: "Convierte esto en una skill reutilizable de scorecard de seguridad semanal que cualquiera de mi equipo pueda correr." },
      { label: "🧑‍🏫 Redactar notas de coaching para su gerente",
        say: "Identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su gerente." },
      { label: "🛑 Profundizar en los casos de frenado brusco",
        say: "Muéstrame un desglose de los eventos de frenado brusco por conductor en los últimos 30 días." },
      { label: "🔔 Configurar una alerta de velocidad para toda la flota",
        say: "Configura una alerta por exceder el límite señalizado en toda la flota y envíala a un gerente de flota." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep-safety-harsh": {
    h: "b5f8c08b",
    events: [
      /*0 assistant*/ { text: "Voy a sacar los eventos de frenado brusco de los últimos 30 días, separados por conductor y clasificados por gravedad, porque un toque suave y una casi colisión se registran igual como \"frenado brusco\", pero no son el mismo problema." },
      /*1 tool*/ { summary: "412 eventos en toda la flota · los 5 principales conductores suman 196 (48%)" },
      /*2 assistant*/ { text: "Este es el panorama de 30 días. El frenado brusco en toda la flota en realidad **bajó 12%**, así que el programa está funcionando en general. Pero el promedio esconde al único conductor que necesitas revisar.\n" +
        "\n" +
        "**Frenado brusco por conductor (grave / moderado / leve):**\n" +
        "\n" +
        "- **Sam Whitfield** (Demo - 33): **58** eventos (9 graves, 21 moderados, 28 leves) · **▲ +22%**\n" +
        "- **Tina Alvarez** (Demo - 22): 47 (6 / 18 / 23) · ▲ +4%\n" +
        "- **Marcus Bell** (Demo - 08): 39 (5 / 14 / 20) · ▼ -8%\n" +
        "- **Grace Kim** (Demo - 10): 28 (2 / 9 / 17) · ▼ -15%\n" +
        "- **Devon Carter** (Demo - 15): 24 (1 / 8 / 15) · ▼ -3%\n" +
        "\n" +
        "Sam Whitfield es el caso atípico en todos los ejes que importan: más eventos, los más **graves** (9 desaceleraciones fuertes por encima de 0.45 g, eso es frenar para evitar una colisión, no tráfico normal) y el único conductor con tendencia en la dirección equivocada, **+22%**, mientras la flota mejora. Todos los demás de esta lista están estables o bajando.\n" +
        "\n" +
        "Así que esto no es una charla para toda la flota: es una conversación de coaching dirigida con Sam esta semana, antes de que una frenada grave se convierta en un reclamo por alcance. ¿Quieres que vea *dónde* ocurren sus eventos graves? Si se agrupan, podría ser tanto un problema de ruta como de manejo." },
      /*3 chart*/ { title: "Eventos graves de frenado brusco (>0.45 g) por conductor · últimos 30 días" },
    ],
    choices: [
      { label: "📍 ¿Dónde ocurren las frenadas graves de Sam?",
        say: "Pon en un mapa dónde ocurren los eventos de frenado grave de Sam Whitfield: ¿es un problema de ruta?" },
      { label: "🧑‍🏫 Redactar una nota de coaching para Sam",
        say: "Identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su gerente." },
      { label: "🚦 Volver al scorecard de riesgo completo",
        say: "Muéstrame los diez conductores más riesgosos esta semana y sus principales eventos." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep-safety-harsh-spain": {
    h: "0be4dc8b",
    events: [
      /*0 assistant*/ { text: "Buen instinto: antes de cargárselo todo a Sam, voy a sacar la ubicación GPS de cada uno de sus eventos de frenado brusco para ver si se agrupan en algún lugar." },
      /*1 tool*/ { summary: "58 eventos geocodificados · 23 se agrupan en una intersección, sobre todo entre 16:00–18:00" },
      /*2 map*/ { title: "Sam Whitfield · punto crítico de frenado brusco (30 días)",
        summary: "23 de 58 eventos se agrupan en Charleston & Rancho; 35 están dispersos" },
      /*3 assistant*/ { text: "Eso cambia el enfoque. **El 40% del frenado brusco de Sam (23 de 58, incluidos 7 de sus 9 eventos graves) ocurre en una sola intersección**: West Charleston & South Rancho, y casi todo entre las 4 y las 6 de la tarde.\n" +
        "\n" +
        "Un conductor que frena bruscamente por toda la ciudad tiene un problema de hábitos de manejo. Un conductor que frena bruscamente en la *misma esquina a la misma hora todos los días* tiene un **problema de ruta**: un semáforo mal sincronizado, una incorporación sin visibilidad o un horario que lo hace pasar por ese cruce en hora pico. La solución probablemente tiene dos frentes: una charla rápida con Sam sobre cómo se aproxima, *y* reordenar sus recorridos de la tarde para evitar esa intersección en hora pico.\n" +
        "\n" +
        "Este es el tipo de cosas que nunca aparecen en una tabla por conductor: solo lo ves cuando pones los eventos en un mapa. Vale la pena revisar si *otros* conductores también tienen picos en esa misma esquina; si es así, es infraestructura, y es completamente un tema de la ruta, no de las personas." },
    ],
    choices: [
      { label: "🧑‍🏫 Redactar la nota de coaching de Sam",
        say: "Identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su gerente." },
      { label: "🚦 Volver al scorecard de riesgo",
        say: "Muéstrame los diez conductores más riesgosos esta semana y sus principales eventos." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-safety-schoolzone": {
    h: "d4fb96bb",
    events: [
      /*0 assistant*/ { text: "Puedo responder esto de dos formas, y voy a hacer las dos. Primero, un poco de contexto: Geotab no etiqueta por sí solo un evento como \"zona escolar\"; eso viene de una geocerca. Voy a revisar qué está configurado y, de todos modos, cruzar los datos de límites señalizados de este mes." },
      /*1 tool*/ { summary: "todavía no hay geocercas de zonas escolares; se usa como aproximación el límite señalizado" },
      /*2 assistant*/ { text: "Todavía no hay geocercas de zonas escolares configuradas, así que no puedo darte un conteo preciso basado en geocercas. Pero no tengo por qué dejarte con las manos vacías: los datos de límites señalizados ya conocen el límite de cada tramo, así que voy a cruzar los eventos de exceso de velocidad de este mes con los tramos de límite bajo (≤20 mph) que están junto a escuelas del condado de Clark." },
      /*3 tool*/ { summary: "7 infracciones · 3 conductores · todas en horario escolar" },
      /*4 assistant*/ { text: "Así se ve este mes, incluso sin las geocercas: **7 eventos de exceso de velocidad en tramos con nivel de zona escolar, entre 3 conductores, todos durante los horarios de entrada o salida de clases**, que es justo cuando más importa.\n" +
        "\n" +
        "- **Marcus Bell** (Demo - 08): 4 eventos cerca de Walter Bracken STEAM; el peor fue **34 mph en un límite de 15** a las 07:50, justo a la hora de dejar a los niños. (Ya es tu conductor de mayor riesgo esta semana: es la misma persona.)\n" +
        "- **Devon Carter** (Demo - 15): 2 cerca de John S. Park Elementary, 29 en un límite de 15, a la hora de salida por la tarde.\n" +
        "- **Chloe Tran** (Demo - 20): 1 cerca de Las Vegas Academy, 26 en un límite de 20.\n" +
        "\n" +
        "De aquí salen dos cosas. **Ahora:** Marcus necesita una conversación directa hoy; ir a 34 frente a una primaria a la hora de entrada es el tipo de cosas que terminan en las noticias locales. **De aquí en adelante:** convierto esto de una aproximación de buena fe en cifras exactas y exigibles creando geocercas reales de zonas escolares con sus propias reglas de 15/20 mph; así esta pregunta se responde sola cada mes y te alerta en vivo, no a posteriori." },
      /*5 chart*/ { title: "Eventos de exceso de velocidad en zonas escolares este mes · por conductor (aproximación por límite señalizado)" },
    ],
    choices: [
      { label: "🏫 Hacerlo exigible: crear las geocercas",
        say: "Crea las geocercas de zonas escolares con alertas de exceso de velocidad de 15/20 mph para que esto sea exacto de aquí en adelante." },
      { label: "🧑‍🏫 Hacer coaching a Marcus por la velocidad a la hora de entrada",
        say: "Identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su gerente." },
      { label: "🛣️ Verificar los límites señalizados en su ruta",
        say: "Obtén el límite de velocidad señalizado a lo largo de la ruta real de Demo - 08 para que podamos hacer coaching con hechos." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep-safety-schoolzone-create": {
    h: "603c27f5",
    events: [
      /*0 assistant*/ { text: "Voy a crear geocercas para las tres escuelas que ya aparecieron este mes (Walter Bracken STEAM, John S. Park Elementary y Las Vegas Academy), de 150 m cada una, con sus límites señalizados. El Add de Geotab crea una entidad por llamada, así que agrupo las tres zonas en un solo ExecuteMultiCall (un viaje de ida y vuelta, tres Add) y recibo los nuevos IDs de zona en orden." },
      /*1 tool*/ { summary: "MultiCall · 3× Add(Zone): geocercas creadas (150 m cada una)" },
      /*2 assistant*/ { text: "Las zonas están listas. Ahora una regla de exceso de velocidad en cada una con su límite señalizado real (15 mph para las dos primarias, 20 para la Academy), separada de tu límite para toda la flota; otra vez agrupado, un Add por zona, limitado a los IDs que acabo de recibir." },
      /*3 tool*/ { summary: "MultiCall · 3× Add(Rule): una regla por zona con su límite señalizado" },
      /*4 assistant*/ { text: "Y envío la alerta a un gerente de flota para que una infracción en zona escolar le avise a alguien en el momento." },
      /*5 tool*/ { summary: "Alerta enviada a 1 gerente" },
      /*6 assistant*/ { text: "Listo: tres geocercas de zonas escolares, una regla de exceso de velocidad en cada una con su límite señalizado real y alertas en vivo a un gerente. De ahora en adelante, cualquier exceso del límite dentro de una de ellas se marca en el momento en que ocurre, asociado al conductor.\n" +
        "\n" +
        "Dos cosas que ganaste: la pregunta de este mes (\"¿quién excedió la velocidad en una zona escolar?\") ahora es una consulta *exacta, con validez para hacerla cumplir*, en lugar de una aproximación, y nunca más tendrás que hacerla en retrospectiva, porque Marcus o cualquier otro que pase a 30 frente a Bracken a la hora de entrada ahora dispara una alerta ese mismo día. Mándame el resto de tu lista de escuelas y replico esto en todas de una sola vez." },
      /*7 confirm*/ { changes: ["3 geocercas de zonas escolares creadas (150 m) en demo_fh_vegas4", "Reglas de exceso de velocidad limitadas a cada zona con su límite señalizado (15 / 15 / 20 mph)", "Alerta en vivo enviada a 1 gerente de flota"] },
      /*8 endcard*/ { lines: ["Conector MCP de Geotab", "De una aproximación de buena fe a hacerlo cumplir en vivo, en una sola petición."] },
    ],
    choices: [
      { label: "🧑‍🏫 Ahora hacer coaching a los conductores que la dispararon",
        say: "Ahora identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su gerente." },
      { label: "🚦 Mostrar mis conductores más riesgosos",
        say: "Ahora muéstrame mis diez conductores más riesgosos esta semana." },
      { label: "⚡ Probar otro",
        say: "Muéstrame otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-safety-postedspeed-08": {
    h: "bfb3590d",
    events: [
      /*0 assistant*/ { text: "Antes de que alguien le haga coaching a Marcus, asegurémonos de que las cifras se sostienen. Voy a sacar el límite de velocidad señalizado a lo largo de la ruta real de Demo - 08 la mañana del peor evento, tramo por tramo, para que la conversación sea \"en este tramo de 15 mph frente a Bracken a las 07:50 ibas a 34\", no \"excediste la velocidad en algún lado\"." },
      /*1 tool*/ { summary: "límites señalizados por tramo frente a Walter Bracken STEAM · 15–35 mph" },
      /*2 assistant*/ { text: "Se sostiene, y no hay ambigüedad. A las **07:50 y 07:51 el límite señalizado es de 15 mph confirmados** (24 km/h, no una estimación) en el tramo que pasa justo frente a Walter Bracken STEAM. La velocidad GPS de Demo - 08 en esos mismos dos tramos fue de **34 mph**: más del doble del límite señalizado de zona escolar, a la hora de dejar a los niños.\n" +
        "\n" +
        "El tramo de aproximación un minuto antes es una avenida de 35 mph, así que no se trata de un conductor que entra con una velocidad legítima de carretera a una zona mal señalizada: el límite baja a 15 justo donde está la escuela, y la velocidad no bajó. Es un hecho de coaching limpio y defendible: el mismo conductor, una vía real, el límite señalizado registrado, ninguna estimación que discutir." },
    ],
    choices: [
      { label: "🧑‍🏫 Hacer coaching a Marcus por la velocidad a la hora de entrada",
        say: "Identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su gerente." },
      { label: "🏫 Hacerlo exigible: crear las geocercas",
        say: "Crea las geocercas de zonas escolares con alertas de exceso de velocidad de 15/20 mph para que esto sea exacto de aquí en adelante." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep-maint-overdue": {
    h: "81ef2d4e",
    events: [
      /*0 assistant*/ { text: "Voy a cruzar tus recordatorios de mantenimiento con el odómetro y las horas de motor en vivo de cada vehículo, y sacar todo lo que está vencido ahora mismo." },
      /*1 tool*/ { summary: "5 vehículos vencidos · 1 es una inspección técnica legal" },
      /*2 assistant*/ { text: "Cinco vehículos tienen mantenimiento vencido, y el orden para atenderlos no depende de cuánto se pasaron, sino de lo que pasa si los sigues usando:\n" +
        "\n" +
        "1. **Demo - 25** (autobús MAN, Núria Pons): **inspección técnica anual, 19 días vencida.** Esta se salta la fila: no es una pieza de desgaste, es un tema *legal*. Un autobús con pasajeros y la ITV vencida es un problema de quedarse sin seguro si hay un incidente y una multa esperando a llegar. Agéndalo hoy.\n" +
        "2. **Demo - 02** (autobús MAN, Iker Sáez): **inspección de frenos, 6,100 km pasada.** Vehículo de pasajeros, sistema de frenos, muy vencida: prioridad alta solo por seguridad.\n" +
        "3. **Demo - 14** (Actros, Marta Ferrer): aceite y filtro de motor, 8,400 km pasada. La más vencida por distancia; posponer el aceite tanto en un camión es como un servicio de €200 se convierte en un motor de €6–8k.\n" +
        "4–5. **Demo - 19** y **Demo - 41**: rutina, prioridad media, se pueden agrupar en los turnos de taller de la próxima semana.\n" +
        "\n" +
        "En resumen: dos urgentes (uno legal, uno de frenos), uno de prioridad alta y dos de rutina. Tus cinco camionetas Sprinter, en contraste, están todas holgadamente dentro del intervalo. ¿Quieres que agende la primera en el taller y aparte un turno?\n" +
        "\n" +
        "*(Confírmalo con los registros del propio taller antes de aprobarlo, pero esto se lee directamente de los recordatorios configurados, no es una suposición.)*" },
      /*3 chart*/ { title: "Mantenimiento vencido · por distancia/tiempo de retraso",
        bars: ["Demo - 25 · ITV (días×100)", "Demo - 02 · frenos (km)", "Demo - 14 · aceite (km)", "Demo - 19 · aceite (km)", null] },
    ],
    choices: [
      { label: "📧 Agendar el crítico en el taller",
        say: "Agenda la inspección técnica vencida de Demo - 25: redacta un correo al taller y pon un turno de servicio tentativo en mi calendario para mañana en la mañana." },
      { label: "⚠️ ¿Qué fallas se marcaron esta semana?",
        say: "Muéstrame los códigos de falla marcados en los últimos siete días y su gravedad." },
      { label: "⏱️ ¿Qué activos tuvieron más tiempo de inactividad?",
        say: "¿Qué activos han tenido más tiempo de inactividad no planificado este trimestre?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep-maint-severity": {
    h: "5c63462b",
    events: [
      /*0 assistant*/ { text: "Voy a sacar las fallas de esta semana y clasificarlas según el estado de la luz de advertencia que acompaña a cada una: roja de parada, ámbar de advertencia o informativa. Esa luz J1939 es donde vive la gravedad real, y es lo que separa \"oríllate ya\" de \"ruido\"." },
      /*1 tool*/ { summary: "597 registros de fallas esta semana" },
      /*2 tool*/ { summary: "3 CRÍTICAS (rojas) · 14 ADVERTENCIAS (ámbar) · 580 fallas informativas del dispositivo" },
      /*3 assistant*/ { text: "597 parece que todo se está cayendo a pedazos. No es así, pero **3 de ellas realmente necesitan atención hoy**, y el valor aquí es que la clasificación por gravedad saca esas 3 del ruido en lugar de enterrarlas.\n" +
        "\n" +
        "**🔴 Críticas: luz roja de parada, el mismo día (3):**\n" +
        "- **Demo - 12** (Actros, Pau Serra): *presión de aire del sistema de frenos baja.* Un camión cargado con frenos de aire fallando: detenlo e inspecciónalo antes de su siguiente recorrido, sin excepciones.\n" +
        "- **Demo - 28** (autobús MAN, Lucía Mena): *temperatura del refrigerante alta.* Sobrecalentamiento; riesgo de una culata agrietada si sigue en marcha. Sácalo de servicio.\n" +
        "- **Demo - 31** (autobús MAN, Roberto Vila): *postratamiento SCR, reducción de potencia del motor inminente.* Entrará en modo de emergencia a mitad de ruta y dejará varados a los pasajeros si se ignora.\n" +
        "\n" +
        "**🟡 Advertencia: ámbar, programar esta semana (14):** 5× regeneración del DPF, 4× AdBlue bajo, 3× batería baja, 2× presión de llantas baja. Ninguna deja varado un vehículo hoy, pero las de DPF y AdBlue se convierten en reducciones de potencia si se dejan.\n" +
        "\n" +
        "**⚪ Informativas (580):** el resto son fallas de conectividad del dispositivo GO (la unidad desconectada o sin alimentación), casi todas en tus cinco camionetas Sprinter (Demo - 06–10). Cero luces de motor. No son 580 problemas, es un solo trabajo de cableado; agrúpalo.\n" +
        "\n" +
        "Así que la lista de trabajo se arma sola: **3 vehículos fuera de circulación ya**, 14 agendados esta semana y un arreglo de arnés para las Sprinter que hará desaparecer el 95% de esta cifra." },
      /*4 chart*/ { title: "Fallas accionables por tipo · últimos 7 días (sin fallas informativas del dispositivo)",
        bars: ["🔴 Presión de frenos (Demo-12)", "🔴 Refrigerante alto (Demo-28)", "🔴 SCR: potencia limitada (Demo-31)", "🟡 Regeneración DPF", "🟡 AdBlue bajo", "🟡 Batería baja", "🟡 Presión de llantas"] },
    ],
    choices: [
      { label: "📧 Agendar ya las 3 unidades críticas",
        say: "Saca los detalles de las fallas críticas de las 3 unidades con luz roja, redacta un correo al taller y pon turnos de servicio tentativos en mi calendario para mañana en la mañana." },
      { label: "🔎 ¿Por qué una camioneta falla tanto? Investígalo",
        say: "Demo - 08 sigue apareciendo en las fallas del dispositivo: ¿por qué? Investígalo y no te quedes con la primera explicación." },
      { label: "⏱️ ¿Qué activos tuvieron más tiempo de inactividad?",
        say: "¿Qué activos han tenido más tiempo de inactividad no planificado este trimestre?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep-maint-overdue-book": {
    h: "d8ade7a1",
    events: [
      /*0 system*/ { text: "Este flujo abarca tres conectores: Geotab + Gmail + Google Calendar." },
      /*1 assistant*/ { text: "Empiezo por el que no puede esperar: Demo - 25, el autobús MAN cuya inspección técnica anual (ITV) está 19 días vencida. Voy a sacar sus detalles para que el taller sepa exactamente qué le llega." },
      /*2 tool*/ { summary: "Demo - 25: MAN Lion's Coach, placa 4471-MAN" },
      /*3 assistant*/ { text: "MAN Lion's Coach, placa 4471-MAN, conductora Núria Pons. Redacto ahora el correo al taller (marcándolo como ITV legal, no un servicio de rutina) y lo dejo en Borradores; no lo envío sin que lo revises primero." },
      /*4 tool*/ { summary: "Borrador guardado (NO enviado)" },
      /*5 assistant*/ { text: "Guardado, no enviado. Ahora aparto un turno tentativo para mañana en la mañana para que el autobús salga de circulación y vuelva a estar en regla lo antes posible." },
      /*6 tool*/ { summary: "Turno tentativo de ITV: mañana 09:00" },
      /*7 assistant*/ { text: "Así quedó en las tres herramientas. **Demo - 25** (MAN Lion's Coach, placa 4471-MAN, Núria Pons) lleva **19 días vencida su inspección técnica legal**: un autobús de pasajeros circulando con la ITV vencida es el único punto de la lista que es un problema de multas y seguro, no solo de desgaste. Redacté el correo al taller marcado como urgente, lo dejé en Borradores y puse un turno tentativo a las 09:00 en el calendario para que no pierdas el espacio de mañana.\n" +
        "\n" +
        "Los otros cuatro vehículos vencidos (frenos en Demo - 02, luego lo de aceite/DPF) pueden ir después de este.\n" +
        "\n" +
        "(Esta demo apunta a un buzón y un calendario de prueba, nunca a un destinatario real.)" },
    ],
    choices: [
      { label: "⚠️ ¿Qué fallas se marcaron esta semana?",
        say: "Muéstrame los códigos de falla marcados en los últimos siete días y su gravedad." },
      { label: "⏱️ ¿Qué activos tuvieron más tiempo de inactividad?",
        say: "¿Qué activos han tenido más tiempo de inactividad no planificado este trimestre?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-maint-severity-book": {
    h: "5feb59d6",
    events: [
      /*0 system*/ { text: "Este flujo abarca tres conectores: Geotab + Gmail + Google Calendar." },
      /*1 assistant*/ { text: "Estas son las tres fallas con luz roja de parada de la clasificación: las que deberían salir de circulación hoy. Saco los detalles de cada vehículo para que el taller conozca la falla y el activo antes de que llegue." },
      /*2 tool*/ { summary: "Demo - 12 (Actros) · Demo - 28 (autobús MAN) · Demo - 31 (autobús MAN)" },
      /*3 assistant*/ { text: "Tengo los tres. Redacto un solo correo al taller que cubre a los tres (Demo - 12, presión de aire de frenos; Demo - 28, temperatura del refrigerante; Demo - 31, reducción de potencia SCR) y lo dejo en Borradores para que lo revises." },
      /*4 tool*/ { summary: "Borrador guardado (NO enviado)" },
      /*5 assistant*/ { text: "Guardado, no enviado. Ahora aparto tres turnos tentativos para mañana en la mañana para que los tres queden agendados en cuanto lo envíes." },
      /*6 tool*/ { summary: "3 turnos de servicio tentativos: mañana en la mañana" },
      /*7 assistant*/ { text: "Este es el resultado en las tres herramientas. Las **3 unidades con luz roja de parada** (**Demo - 12**: Actros, presión de aire de frenos baja, Pau Serra; **Demo - 28**: autobús MAN, refrigerante alto, Lucía Mena; **Demo - 31**: autobús MAN, reducción de potencia SCR inminente, Roberto Vila) tienen cada una una razón real para detenerse antes de su siguiente recorrido. Redacté un solo correo al taller que cubre las tres (en Borradores, marcado como urgente) y aparté tres turnos tentativos para mañana en la mañana.\n" +
        "\n" +
        "Los 14 puntos con luz ámbar pueden esperar al tiempo de taller programado de esta semana, y las 580 fallas informativas del dispositivo son el trabajo de arnés de las Sprinter: no forman parte de esta reserva.\n" +
        "\n" +
        "(Esta demo apunta a un buzón y un calendario de prueba, nunca a un destinatario real.)" },
    ],
    choices: [
      { label: "🔎 ¿Por qué una camioneta falla tanto? Investígalo",
        say: "Demo - 08 sigue apareciendo en las fallas del dispositivo: ¿por qué? Investígalo y no te quedes con la primera explicación." },
      { label: "📋 ¿Qué vehículos tienen el servicio vencido?",
        say: "¿Qué vehículos tienen el mantenimiento programado vencido ahora mismo?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-maint-downtime": {
    h: "e88eaab7",
    events: [
      /*0 assistant*/ { text: "Voy a medir el tiempo de inactividad no planificado como realmente te duele (días que un vehículo estuvo fuera de servicio mientras su grupo de pares trabajaba) y vincular cada periodo con la falla que lo causó y lo que costó la disponibilidad perdida. Sacando el trimestre." },
      /*1 tool*/ { summary: "≈38 días fuera de servicio en la flota · los 5 principales = 27.8 (73%) · aprox. €23k perdidos" },
      /*2 assistant*/ { text: "Alrededor de **38 días-vehículo perdidos este trimestre, unos €23k en indisponibilidad**, y está concentrado: los cinco activos principales suman ~28 de esos días (73%). Dos grupos explican casi todo:\n" +
        "\n" +
        "**Grupo 1: las camionetas Sprinter (Demo - 06, 07, 08):** ~20 días fuera de servicio entre las tres, todas con la misma causa raíz: la falla recurrente de alimentación/conector que hemos estado siguiendo. **Solo Demo - 08 suma 9.2 días fuera de servicio** este trimestre, y justo por eso su kilometraje es un tercio del de la flota: está estacionada, no poco programada. Es la victoria más barata del tablero: un solo arreglo de arnés en las tres camionetas recupera la mayoría de esos 20 días y ~€8k.\n" +
        "\n" +
        "**Grupo 2: los activos pesados (autobús Demo - 28, camión Demo - 12):** ~8 días fuera de servicio, y estos son tus días *caros*: un autobús o un camión fuera de circulación pierde €800–900/día en trabajo, frente a ~€400 de una camioneta. Ambos se remontan a fallas ya marcadas como críticas esta semana (sobrecalentamiento, frenos), así que detectarlas antes es lo que acortará estos periodos el próximo trimestre.\n" +
        "\n" +
        "En resumen: aquí la inactividad no es mala suerte repartida; son dos causas solucionables en siete vehículos. Resuélvelas y le das un mordisco visible tanto al conteo de días como a los €23k." },
      /*3 chart*/ { title: "Días fuera de servicio no planificados este trimestre · 5 vehículos principales",
        bars: ["Demo - 08 (camioneta)", "Demo - 06 (camioneta)", "Demo - 07 (camioneta)", "Demo - 28 (autobús)", "Demo - 12 (camión)"] },
    ],
    choices: [
      { label: "🔎 ¿Por qué Demo - 08 sigue fallando?",
        say: "Demo - 08 sigue apareciendo: ¿por qué? Investígalo y no te quedes con la primera explicación." },
      { label: "⚠️ Códigos de falla + gravedad esta semana",
        say: "Muéstrame los códigos de falla marcados en los últimos siete días y su gravedad." },
      { label: "📅 ¿Qué servicio está vencido?",
        say: "¿Qué vehículos tienen el mantenimiento programado vencido ahora mismo?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep-ops-fuel": {
    h: "73603f7e",
    events: [
      /*0 assistant*/ { text: "El rendimiento de combustible se lee de los datos del motor de cada vehículo. Esta flota tiene dos tipos de carrocería (35 camionetas de carga Ford Transit 250 y 15 pickups F-150), así que voy a separar el consumo y la distancia de esa forma y ponerle una cifra en dólares." },
      /*1 tool*/ { summary: "Camionetas 18.2 mpg · pickups 15.1 · $41.5k de gasto · 3 casos atípicos identificados" },
      /*2 assistant*/ { text: "Este es el mes. Las 35 camionetas Transit promedian **18.2 mpg** (nominal 19.5), las 15 pickups F-150 **15.1** (nominal 16), y la flota combinada da **17.3**. El gasto total en combustible es de unos **$41.5k**.\n" +
        "\n" +
        "Pero el promedio es la parte aburrida. Mira *quiénes* están por debajo: las tres camionetas que hunden a la flota de camionetas (**Marcus Bell con 14.9 mpg (-18%)**, Devon Carter con 15.6, Priya Nair con 16.0) son **exactamente los mismos nombres que encabezan tus listas de exceso de velocidad y de riesgo.** No es coincidencia: la velocidad alta y los eventos bruscos queman combustible. Tus peores conductores en seguridad también son tus peores conductores en combustible.\n" +
        "\n" +
        "Lo que significa que una sola intervención rinde por tres. La política de límite señalizado que aplicarías por seguridad también recupera combustible: cerrar la brecha entre tu flota (17.3) y su rendimiento nominal vale aproximadamente **6–8%, del orden de $2.5–3k al mes**, y pega más fuerte en el mismo puñado de conductores. Seguridad, combustible y emisiones: una sola palanca.\n" +
        "\n" +
        "(Y el ciclo de trabajo urbano, corto y compacto de las camionetas es justo el perfil que las convierte en tus candidatas a conversión eléctrica; con gusto armo ese caso a continuación.)" },
      /*3 chart*/ { title: "Rendimiento promedio de combustible por tipo de vehículo · este mes (mpg, vs. nominal)",
        bars: ["Transit 250 — real", "Transit 250 — nominal", "F-150 — real", "F-150 — nominal"] },
    ],
    choices: [
      { label: "🔋 ¿Son candidatos a reemplazo eléctrico?",
        say: "¿Cuáles de estos vehículos son candidatos a reemplazo por eléctricos según sus patrones de kilometraje diario?" },
      { label: "💤 ¿Dónde perdemos combustible en ralentí?",
        say: "Muéstrame qué rutas tuvieron los tiempos de ralentí más largos la semana pasada." },
      { label: "🔔 Aplicar la política de velocidad que lo recupera",
        say: "Configura una alerta por exceder el límite señalizado en toda la flota y envíala a un gerente de flota." },
      { label: "💰 Incluirlo en el caso de ROI completo",
        say: "Incluye esto en el panorama completo: ¿por dónde pierde dinero la flota en general?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep-ops-idle": {
    h: "02968617",
    events: [
      /*0 assistant*/ { text: "Voy a clasificar el ralentí de la semana pasada por conductor y convertir las horas en lo que de verdad llega a una junta de presupuesto: combustible quemado y dólares, por cero millas recorridas." },
      /*1 tool*/ { summary: "118 horas de ralentí en la flota · ≈59 gal · ≈$210/sem ($10.9k/año) · los 5 principales = 40%" },
      /*2 assistant*/ { text: "La semana pasada la flota estuvo en ralentí **118 horas**: unos **59 galones, ~$210 y media tonelada de CO₂ quemados sin ir a ningún lado.** Anualizado son aproximadamente **$10.9k al año** que salen directo por el escape con el vehículo detenido.\n" +
        "\n" +
        "Los que más ralentí tienen (estos cinco son ~40% del total):\n" +
        "- **Hannah Brooks** (Demo - 17): 6.1 h\n" +
        "- **Eddie Vance** (Demo - 29): 5.4 h\n" +
        "- **Sam Whitfield** (Demo - 33): 4.8 h\n" +
        "- **Rosa Mendez** (Demo - 41): 4.3 h\n" +
        "- **Will Dawson** (Demo - 05): 3.9 h\n" +
        "\n" +
        "Con el calor de Las Vegas, la mayor parte es aire acondicionado encendido mientras está estacionado: comprensible, pero hoy es invisible porque nada lo marca en el momento; solo aparece en un reporte como este, cuando el combustible ya se fue.\n" +
        "\n" +
        "La solución es una regla: marcar cualquier ralentí de más de 10 minutos y avisarle al conductor en vivo. Las flotas que lo hacen suelen reducir el ralentí 20–30% el primer mes; digamos **$2–3k/año recuperados** aquí, más el beneficio en emisiones, por una regla que me toma diez segundos crear. ¿La activo?" },
      /*3 chart*/ { title: "Horas de ralentí por conductor · últimos 7 días (5 principales)" },
    ],
    choices: [
      { label: "🔔 Crear una alerta de ralentí (>10 min)",
        say: "Configura una alerta de ralentí para cualquier cosa de más de 10 minutos y envíala a un gerente." },
      { label: "⛽ ¿Cómo va mi rendimiento de combustible en general?",
        say: "¿Cuál es mi rendimiento promedio de combustible por tipo de vehículo este mes?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep-ops-idle-alert": {
    h: "e0c87e33",
    events: [
      /*0 assistant*/ { text: "Primero creo la regla de ralentí, con el umbral en 10 minutos." },
      /*1 tool*/ { summary: "Regla de ralentí creada" },
      /*2 assistant*/ { text: "Activa. Ahora envío la alerta a un gerente de flota." },
      /*3 tool*/ { summary: "Alertas de ralentí enviadas a 1 gerente" },
      /*4 assistant*/ { text: "Listo: cualquier ralentí de más de 10 minutos ahora se marca en vivo y le llega a un gerente. La lista de ralentí de la próxima semana ya debería ser más corta, porque la gente recibe el aviso en el momento y no en un reporte que nadie lee." },
      /*5 confirm*/ { changes: ["Regla \"Idling > 10 min\" creada y activa en demo_fh_vegas4", "Notificación enviada a 1 gerente de flota"] },
      /*6 endcard*/ { lines: ["Conector MCP de Geotab", "Detéctalo en el momento, no en el reporte mensual."] },
    ],
    choices: [
      { label: "⛽ Ahora revisar el rendimiento de combustible",
        say: "¿Cuál es mi rendimiento promedio de combustible por tipo de vehículo este mes?" },
      { label: "⚡ Probar otro",
        say: "Muéstrame otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "ep-agentic-safety": {
    h: "94dd973a",
    events: [
      /*0 assistant*/ { text: "Esto es una evaluación, no una sola consulta: voy a reunir todas las señales de seguridad de la flota, puntuar a los conductores, revisar la exposición en zonas sensibles y luego clasificar los tres riesgos principales y asociar cada uno con una solución concreta y una cifra." },
      /*1 tool*/ { summary: "4,811 eventos de excepción esta semana (≈20,600 / 30 días)" },
      /*2 assistant*/ { text: "Casi 5,000 esta semana. Ahora la forma que tiene: puntúo a los conductores y reviso dónde caen los eventos graves." },
      /*3 tool*/ { summary: "puntuación 78 (▼6%) · 90% exceso de velocidad · 3 conductores multifactor · 7 eventos en zonas escolares" },
      /*4 assistant*/ { text: "Esta es la evaluación: los tres riesgos de seguridad principales, clasificados por lo que realmente te van a costar, cada uno con la acción correctiva que yo tomaría:\n" +
        "\n" +
        "**1. Exceso de velocidad sistémico: el riesgo dominante en toda la flota.** El 90% de ~4,800 eventos semanales, y los diez conductores principales están a menos de 5% entre sí: un grupo compacto sin casos atípicos es la firma de un *sistema* (rutas, límites y expectativas compartidas), no de unos cuantos malos actores. Está bajando la puntuación de seguridad de tu flota a 78, por debajo de la referencia de 82 y 6% menos esta semana.\n" +
        "→ *Solución:* una regla de límite señalizado para toda la flota + alerta en vivo + una política de velocidad por escrito. También es tu mayor palanca de *combustible* (~$2.5–3k/mes): una sola acción, dos presupuestos.\n" +
        "\n" +
        "**2. Tres conductores multifactor que necesitan una conversación esta semana.** La mayor parte de la flota solo excede la velocidad, pero **Marcus Bell** (velocidad + frenado + cinturón, la combinación que mejor predice una colisión con culpa), **Tina Alvarez** (31 aceleraciones bruscas) y **Sam Whitfield** (9 frenadas graves, 40% en una sola intersección) se separan del resto.\n" +
        "→ *Solución:* coaching 1:1 dirigido para estos tres: el riesgo más barato que vas a reducir en todo el trimestre, considerando que una colisión con culpa llega fácilmente a cinco cifras con todos los costos.\n" +
        "\n" +
        "**3. Exposición en zonas escolares a la hora de entrada/salida.** 7 eventos de exceso de velocidad este mes en tramos con nivel de zona escolar, entre Marcus Bell, Devon Carter y Chloe Tran, todos durante el horario escolar. Pocos casos, consecuencias muy altas (también para la reputación).\n" +
        "→ *Solución:* crear geocercas de zonas escolares con sus límites señalizados para que se marquen en vivo, y hacer coaching ya a los tres conductores mencionados.\n" +
        "\n" +
        "Si solo haces el #1 y el #2 esta semana, mueves al mismo tiempo la puntuación de la flota, la factura de combustible y tu mayor exposición a colisiones. ¿Empiezo? ¿La alerta de velocidad en vivo o las notas de coaching?" },
      /*5 chart*/ { title: "La mezcla de excepciones de esta semana · dónde está realmente el riesgo",
        bars: ["Exceso de velocidad", "Frenado brusco", "Aceleración brusca", "Cinturón"] },
    ],
    choices: [
      { label: "✅ Hacer el #1: crear ya la alerta de velocidad",
        say: "Haz el #1: configura la alerta por exceder el límite señalizado en toda la flota y envíala a un gerente de flota." },
      { label: "🧑‍🏫 Hacer el #2: redactar las notas de coaching",
        say: "Identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su gerente." },
      { label: "🏫 Hacer el #3: geocercas en las zonas escolares",
        say: "Crea las geocercas de zonas escolares con alertas de exceso de velocidad para detectar en vivo la velocidad a la hora de entrada." },
      { label: "💰 ¿Cuánto vale todo esto? (caso de ROI)",
        say: "¿Cuánto vale todo esto? Suma los ahorros recuperables y ármame el caso de ROI." },
      { label: "🚦 Mostrar el scorecard completo de conductores",
        say: "¿Quiénes son mis diez conductores más riesgosos esta semana y cuáles fueron sus principales eventos?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep-agentic-coaching": {
    h: "8ca14333",
    events: [
      /*0 system*/ { text: "Este flujo abarca dos conectores: Geotab + Gmail." },
      /*1 assistant*/ { text: "La lista útil de coaching no es \"todos los que excedieron la velocidad\": eso es un problema de política, no de coaching. Es el puñado de personas cuyo riesgo es *individual* y específico. Voy a sacar a esos conductores con lo único concreto que cada uno debería escuchar." },
      /*2 tool*/ { summary: "3 conductores marcados para coaching 1:1, cada uno con un dato específico" },
      /*3 assistant*/ { text: "Tres conductores, tres conversaciones distintas: redacto una nota con la que tu gerente directo pueda actuar de inmediato, un párrafo específico y justo para cada uno. La dejo en Borradores, sin enviarla." },
      /*4 tool*/ { summary: "Borrador guardado (NO enviado)" },
      /*5 assistant*/ { text: "El borrador está guardado, no enviado: abre la tarjeta de arriba para leerlo. Cada conductor recibe un párrafo específico, respaldado con evidencia y con un enfoque justo: los eventos de cinturón y de zona escolar de Marcus van primero porque no son negociables; la nota de Tina relaciona su hábito con el combustible para que no sea solo un regaño; y la de Sam señala explícitamente que su problema es en parte la ruta, no solo él.\n" +
        "\n" +
        "Esa es la diferencia entre una nota de coaching que un gerente puede usar mañana y una tabla de posiciones que solo señala y avergüenza. (Esta demo apunta a un buzón de prueba y los nombres de los conductores son ficticios: nunca un destinatario o registro real.)" },
    ],
    choices: [
      { label: "📤 Enviárselo ya al gerente",
        say: "Se ve bien: envía ahora el resumen de coaching." },
      { label: "🛡️ Evaluar los 3 riesgos principales detrás de esto",
        say: "Evalúa mi flota para encontrar los tres riesgos de seguridad principales y sugiere acciones correctivas." },
      { label: "🔔 Mejor configurar la alerta de velocidad en vivo",
        say: "Olvida el correo: solo configura la alerta por exceder el límite señalizado en toda la flota." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep-coaching-send": {
    h: "207561a7",
    events: [
      /*0 tool*/ { summary: "Enviado a ops-manager@test-mailbox.example" },
      /*1 assistant*/ { text: "Enviado. El gerente ya tiene a Marcus, Tina y Sam, cada uno con un punto de conversación específico y justo, además del enfoque de que el exceso de velocidad generalizado se resuelve con una política, no con tres chivos expiatorios. Las conversaciones empiezan en el lugar correcto. La alerta de velocidad en vivo es el complemento natural de esto si todavía no la configuraste." },
      /*2 endcard*/ { lines: ["Conector MCP de Geotab", "De los datos de la flota a la bandeja de entrada de un gerente, en una sola petición."] },
    ],
    choices: [
      { label: "🔔 Ahora configurar la alerta de velocidad en vivo",
        say: "Ahora configura la alerta por exceder el límite señalizado en toda la flota y envíala a un gerente." },
      { label: "⚡ Probar otro",
        say: "Muéstrame otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "warehouse-intro": {
    h: "439e4fc5",
    events: [
      /*0 system*/ { text: "Partimos de un servidor MCP de Geotab ya conectado y una cuenta MotherDuck Lite." },
      /*1 assistant*/ { text: "**¿Esto siquiera es buena idea? Sí, en cuanto tus preguntas se vuelven más grandes que una sola llamada a la API.**\n" +
        "\n" +
        "El conector MCP en vivo es excelente para preguntas puntuales sobre el estado actual. Un almacén de datos es para las analíticas: **combinar viajes + fallas + excepciones + GPS**, cruzar todo eso **con tus propios datos** (tarjetas de combustible, ERP de mantenimiento, nómina, clima), agregar **toda la flota a la vez**, segmentar por grupo o tipo de vehículo y, claro, también tendencias en el tiempo. Las haces **una y otra vez y a bajo costo** sin volver a jalar datos de la API en vivo, sobre datos que **son tuyos y controlas**, así que puedes colgar de ahí dashboards, resúmenes programados y skills de agentes. El conector es la capa de acceso; MotherDuck es la capa de memoria duradera. (Si prefieres la ruta probada y sin MCP, el **MyGeotab API Adapter** de código abierto de Geotab lleva años replicando datos de flota en Postgres/SQL Server; pregunta *“¿Esto es lo que recomienda Geotab?”* abajo.)\n" +
        "\n" +
        "Esta es la parte genuinamente interesante: **el asistente orquesta todo el pipeline con llamadas MCP**: sin servicio ETL, sin Airflow, sin código de pegamento. Le pide los datos a Geotab (MCP) y le dice a MotherDuck (MCP) que los cargue, transforme y programe. Extraer, cargar, transformar, refrescar: todo son simples llamadas a herramientas en este chat. Geotab Ace incluso devuelve una **URL de CSV firmada** que MotherDuck lee *directamente*, así que nunca se descarga nada.\n" +
        "\n" +
        "Y elegimos **MotherDuck precisamente por su nivel gratuito**: una flota de 50 vehículos cuesta **$0** durante años, así que puedes montar todo esto sin una conversación de presupuesto.\n" +
        "\n" +
        "Este es el plan: primero un ciclo concreto: pedir filas GPS crudas, cargar el CSV firmado en `gps_points` y consultarlo. Una vez que eso funcione, la razón de bronze/silver/gold se vuelve obvia: cargas repetibles, filas tipadas, deduplicación, procedencia, controles de calidad y control de costos." },
      /*2 warehouse*/ { compactSubtitle: "Todavía no hay tablas",
        note: "👉 Abre el panel Almacén en la parte superior del chat: registra cada tabla a medida que la construimos (por ahora vacío). Bronze/silver/gold no se introduce todavía a propósito; tendrá más sentido cuando funcione la carga directa.",
        stages: [{ name: "Base de datos" }] },
    ],
    choices: [
      { label: "🦆 Empezar con filas GPS",
        say: "Ya conecté el MCP de Geotab y creé una cuenta de MotherDuck en el nivel gratuito. Ármame un almacén de datos empezando por los puntos GPS." },
      { label: "❓ ¿Esto es lo que recomienda Geotab?",
        say: "¿Esto es lo que recomienda Geotab?" },
      { label: "❓ ¿Qué es MotherDuck?",
        say: "Antes de empezar: ¿qué es exactamente MotherDuck?" },
      { label: "↩︎ Volver al simulador de flota",
        say: "Llévame de vuelta al simulador principal." },
    ],
  },
  "warehouse-geotab-recommendation": {
    h: "627fe88b",
    events: [
      /*0 assistant*/ { text: "No como recomendación oficial. Esta ruta de almacén de datos Geotab → MotherDuck orquestada por MCP es una **prueba de concepto**: nueva, interesante en este mundo MCP y todavía no probada a escala. El asistente puede coordinar ambos lados (pedirle filas a Geotab y luego pedirle a MotherDuck que las cargue y transforme) sin un servicio ETL aparte.\n" +
        "\n" +
        "El patrón probado que los clientes de Geotab llevan años usando es el **[MyGeotab API Adapter](https://github.com/Geotab/mygeotab-api-adapter/blob/master/MyGeotabAPIAdapter/README.md)** de código abierto: un servicio .NET maduro (sin MCP de por medio) que replica los datos de tu flota en tu propia base de datos **PostgreSQL o SQL Server**. Extrae de forma incremental a través de los data feeds de MyGeotab (registros GPS, viajes, fallas y más), mantiene en caché los datos de referencia de dispositivos/usuarios/zonas e incluye la plomería de producción: reintentos, transacciones, mantenimiento de particiones. Montarlo es un proyecto clásico y bien documentado de ingeniería de datos: corres el servicio una vez y tu base de datos se llena sola.\n" +
        "\n" +
        "Así que el planteamiento honesto es: **MyGeotab API Adapter** para una replicación probada en Postgres/SQL Server que tú operas; **esta ruta MCP + MotherDuck** para un almacén de datos ligero, impulsado por conversación, que puedes montar en un chat por $0. Seguiremos actualizando este nodo a medida que madure el enfoque MCP." },
    ],
    choices: [
      { label: "🦆 Continuar con filas GPS",
        say: "Entendido. Sigue con la ruta MCP experimental y empieza con filas GPS." },
      { label: "⏱ ¿Qué tan actualizada puede estar la ruta MCP?",
        say: "El adapter consulta cada pocos segundos. ¿Qué tan actualizado puede estar realmente este almacén MCP?" },
      { label: "❓ ¿Qué es MotherDuck?",
        say: "Antes de empezar: ¿qué es exactamente MotherDuck?" },
      { label: "↩︎ Volver a la introducción del almacén",
        say: "Vuelve a la introducción del almacén de datos." },
    ],
  },
  "warehouse-what-is": {
    h: "0e463fdf",
    events: [
      /*0 assistant*/ { text: "**MotherDuck** es un almacén de datos analítico serverless construido sobre **DuckDB**, el motor SQL en proceso y veloz. Obtienes la velocidad de DuckDB con almacenamiento en la nube, colaboración y escala, además de un nivel gratuito generoso, así que un almacén de flota como el que vamos a construir puede empezar en **$0**.\n" +
        "\n" +
        "Por qué encaja específicamente con este flujo de Geotab:\n" +
        "- Puede leer *directamente* las **URL de CSV firmadas** que devuelve Geotab Ace (`read_csv_auto('https://…')`), sin descarga ni servicio ETL aparte.\n" +
        "- Habla **SQL de DuckDB** estándar (funciones de ventana, `DISTINCT ON`, `QUALIFY`, espacial + H3), así que las transformaciones bronze/silver/gold son solo SQL.\n" +
        "- Las herramientas `query` / `query_rw` que el asistente llama aquí son la interfaz MCP real de MotherDuck: lo que ves es lo que ejecutarías.\n" +
        "\n" +
        "La documentación completa, el nivel gratuito y los precios están en su sitio: **[motherduck.com](https://motherduck.com)**." },
    ],
    choices: [
      { label: "🦆 Empezar con filas GPS",
        say: "Entendido. Ahora ármame un almacén de datos empezando por los puntos GPS." },
      { label: "↩︎ Volver a la introducción del almacén",
        say: "Vuelve a la introducción del almacén de datos." },
      { label: "⚡ Volver al simulador de flota",
        say: "Llévame de vuelta al simulador principal." },
    ],
  },
  "warehouse-setup": {
    h: "7c3f7b4d",
    events: [
      /*0 assistant*/ { text: "Voy a pedirle a Geotab Ace filas GPS crudas con columnas exactas. Sin dashboard, sin resumen. La respuesta incluye una URL de CSV firmada que MotherDuck puede leer directamente." },
      /*1 tool*/ { summary: "URL de CSV firmada devuelta · 157,419 filas GPS" },
      /*2 assistant*/ { text: "Listo: Ace devolvió **157,419 filas** como un CSV firmado (la URL vence en ~24 h). Todavía no se guarda nada. ¿Quieres que lo cargue directo en una tabla de MotherDuck?" },
      /*3 warehouse*/ { compactSubtitle: "gps_points listo",
        note: "Este es el puente más simple: un resultado grande en CSV firmado se puede leer directamente en MotherDuck.",
        stages: [{ name: "Base de datos" }] },
    ],
    choices: [
      { label: "📥 Cargar el CSV en MotherDuck",
        say: "Ahora crea una tabla en MotherDuck y carga en ella esa URL de CSV firmada." },
      { label: "↩︎ Volver al simulador principal",
        say: "Llévame de vuelta al simulador principal." },
    ],
  },
  "warehouse-first-load": {
    h: "77e245bf",
    events: [
      /*0 assistant*/ { text: "Ahora creo **una tabla** llamada `gps_points` y dejo que MotherDuck lea directamente la URL de CSV firmada. Sin descarga en Python, sin archivo local, sin servicio ETL: solo llamadas MCP." },
      /*1 tool*/ { summary: "gps_points creada a partir del CSV de Ace" },
      /*2 tool*/ { summary: "la tabla se puede consultar" },
      /*3 assistant*/ { text: "Listo: `gps_points` contiene las 157,419 filas y la consulta de prueba las devuelve. Fíjate en que las columnas llegaron como cadenas de texto crudas; eso es lo primero que vamos a arreglar." },
      /*4 warehouse*/ { compactSubtitle: "gps_points cargada",
        note: "👉 Abre el panel Almacén para ver cómo se llena gps_points; expande sus filas de muestra para ver llegar las cadenas crudas. Esta tabla directa es ingenua a propósito: perfecta para enseñar la conexión, pero todavía no es segura para cargas diarias repetidas.",
        stages: [{ name: "Base de datos" }] },
    ],
    choices: [
      { label: "🧠 ¿Por qué no basta con una tabla?",
        say: "Esto funciona, pero antes de programarlo a diario, sigue esta skill y muéstrame por qué una sola tabla cruda no está lista para producción: [https://github.com/fhoffa/geotab-vibe-guide/blob/main/skills/geotab-motherduck-warehouse/SKILL.md](https://github.com/fhoffa/geotab-vibe-guide/blob/main/skills/geotab-motherduck-warehouse/SKILL.md)" },
      { label: "↩︎ Volver al simulador principal",
        say: "Llévame de vuelta al simulador principal." },
    ],
  },
  "warehouse-layering": {
    h: "fe548b6f",
    events: [
      /*0 assistant*/ { text: "Sigo la [skill geotab-motherduck-warehouse](https://github.com/fhoffa/geotab-vibe-guide/blob/main/skills/geotab-motherduck-warehouse/SKILL.md) que me indicaste. La carga en una sola tabla funcionó, pero aparecen tres problemas en cuanto la vuelves a correr mañana:\n" +
        "\n" +
        "- La URL de CSV firmada vence, así que necesitas una copia duradera de exactamente lo que devolvió Ace.\n" +
        "- Ace puede solapar segundos en los límites y a veces cambia sus decisiones de SQL, así que las cargas repetidas necesitan deduplicación y procedencia.\n" +
        "- Las columnas del CSV crudo son cadenas de texto; la analítica necesita timestamps tipados, números y claves estables.\n" +
        "\n" +
        "Así que refactorizamos la tabla simple `gps_points` en capas: **bronze** guarda las filas crudas y reproducibles, **silver** está tipada y deduplicada, y **gold** es la tabla lista para el negocio." },
      /*1 tool*/ { summary: "tabla simple refactorizada en bronze + silver" },
      /*2 assistant*/ { text: "Refactorizado: **bronze** guarda la copia cruda para reproducir, **silver** contiene las filas tipadas y deduplicadas. Los mismos datos, ahora seguros para recargarse a diario." },
      /*3 warehouse*/ { compactSubtitle: "Tablas en capas",
        note: "👉 En el panel Almacén ya puedes ver la división bronze/silver/gold. Bronze/silver/gold no es ceremonia: resuelve el vencimiento de la URL, el solapamiento, la conversión de tipos, la deduplicación y la procedencia." },
    ],
    choices: [
      { label: "🔁 Mostrar el refresco incremental",
        say: "Ahora muestra el refresco incremental diario con marcas de agua y deduplicación." },
      { label: "↩︎ Volver al simulador principal",
        say: "Llévame de vuelta al simulador principal." },
    ],
  },
  "warehouse-incremental": {
    h: "6776b756",
    events: [
      /*0 assistant*/ { text: "Ahora puedo correr la versión diaria de forma segura: le pido a MotherDuck la marca de agua de silver, le paso ese timestamp a Ace, dejo el nuevo CSV en bronze y luego inserto en silver solo las filas más recientes que la marca de agua.\n" +
        "\n" +
        "En este paso es donde rinden las capas anteriores: **Ace solo respeta los límites de subsegundo hasta el segundo**, así que el solapamiento es normal, y **lee el SQL devuelto cada vez** antes de cargar, porque Ace puede inyectar predicados." },
      /*1 tool*/ { summary: "marca de agua encontrada" },
      /*2 tool*/ { summary: "CSV incremental devuelto" },
      /*3 tool*/ { summary: "lote incremental confirmado" },
      /*4 warehouse*/ { compactSubtitle: "Refresco incremental",
        note: "En una implementación real esto se vuelve un trabajo programado: marca de agua → prompt a Ace → anexar a bronze → derivar silver → controles de calidad → refrescar gold." },
      /*5 assistant*/ { text: "Este es el ciclo de refresco duradero, no la meta: marca de agua → extraer → anexar a bronze → derivar silver → controles de calidad → refrescar gold.\n" +
        "\n" +
        "A partir de aquí puedes seguir construyendo: ¿quieres que agregue el resto del almacén operativo (viajes, fallas, estado, excepciones y las dimensiones que los decodifican)?" },
    ],
    choices: [
      { label: "🧩 Agregar viajes, fallas, estado y dimensiones",
        say: "Esto es útil, pero los puntos GPS solos no son un almacén de datos. Agrega viajes, fallas, datos de estado, excepciones y las dimensiones que los hacen legibles." },
      { label: "⏱ ¿Qué tan actualizado está esto, en realidad?",
        say: "¿Qué tan actualizado está este almacén, en realidad? El propio adapter de Geotab consulta cada pocos segundos: ¿por qué no usamos su feed?" },
      { label: "🩺 ¿Y si se queda atrás?",
        say: "¿Qué pasa si el almacén se queda atrás: una programación pausada, unas vacaciones, una caída? ¿Cómo me daría cuenta siquiera?" },
      { label: "🧱 Repetir desde la configuración",
        say: "Repite la configuración de MotherDuck desde el principio." },
      { label: "⚡ Probar preguntas de flota",
        say: "Llévame de vuelta al simulador de flota." },
      { label: "↻ Reiniciar" },
    ],
  },
  "warehouse-operational": {
    h: "b6cf89d8",
    events: [
      /*0 assistant*/ { text: "Exacto: el GPS demuestra que la tubería funciona, pero un almacén operativo también necesita las otras superficies de Geotab. La regla práctica de la skill es simple: **hechos con timestamp vía Ace hacia bronze**, y **listas de consulta vía Get hacia dimensiones**.\n" +
        "\n" +
        "Así que agregamos viajes, asignaciones de conductores, datos de estado/motor, eventos de excepción de seguridad y fallas como hechos. Luego agregamos usuarios/conductores, reglas, diagnósticos, grupos y zonas como dimensiones para que las filas de hechos sean legibles. El conductor es una trampa de Geotab: no existe el typeName `Driver`; los conductores son filas de `User` donde `isDriver=true`." },
      /*1 tool*/ { summary: "52 tipos de entidad disponibles" },
      /*2 tool*/ { summary: "4 extracciones masivas de hechos en cola" },
      /*3 tool*/ { summary: "instantáneas de dimensiones devueltas" },
      /*4 tool*/ { summary: "espejo operativo cargado" },
      /*5 assistant*/ { text: "Cargado: el almacén ahora tiene **6 familias de hechos y 6 dimensiones**. El panel de arriba las muestra todas; los hechos ya se pueden unir con nombres legibles a través de las dimensiones." },
      /*6 warehouse*/ { compactSubtitle: "Espejo operativo",
        note: "Cargado, pero estos viajes entraron en modo de solo anexar como el GPS, y eso todavía no es seguro: mira lo que la redivisión de mañana les hace a estas filas.",
        stages: [null, { notes: [null, null, null, null, null, null, "el padrón completo de la flota (vía Get)", "los conductores son Users con isDriver=true", null, null, null, null] }, null] },
    ],
    choices: [
      { label: "⚠️ Por qué los viajes y conductores no pueden solo anexarse",
        say: "Espera: los viajes y las asignaciones de conductores no son de solo anexar como el GPS. Muéstrame qué se rompe y cómo conciliarlo." },
      { label: "📍 ¿Las fallas no tienen ubicación?",
        say: "Un momento: ¿las filas de fallas y de estado no incluyen coordenadas GPS? ¿Cómo pondría las fallas en un mapa?" },
      { label: "🗑 ¿Y las eliminaciones?",
        say: "¿Qué pasa cuando alguien elimina una zona o desactiva a un conductor en Geotab? ¿Mi almacén se da cuenta?" },
      { label: "↩︎ Volver al simulador principal",
        say: "Llévame de vuelta al simulador de flota." },
    ],
  },
  "warehouse-restated": {
    h: "2541c961",
    events: [
      /*0 assistant*/ { text: "Cuidado: acabamos de cargar los viajes y las asignaciones de conductores de la *misma* forma de solo anexar que el GPS, y eso es un bug esperando a ocurrir. Los pings GPS, el estado, las excepciones y las fallas son **eventos inmutables**: una vez que se escribe `(device, timestamp)` nunca cambia, así que anexar + deduplicar es correcto.\n" +
        "\n" +
        "**Un `Trip` es distinto: es derivado, no registrado.** Geotab recalcula los límites de un viaje cuando llega nueva evidencia (una asignación `DriverChange`, o GPS tardío o fuera de orden). Un recálculo puede cambiar la hora de fin del viaje y darle un **`TripId` completamente nuevo, retirando el anterior**. Así que un viaje que ya cargaste puede desaparecer con su id viejo y reaparecer con uno nuevo: una *actualización* que anexar + deduplicar nunca ve.\n" +
        "\n" +
        "👉 Mantén abierto el panel **Almacén** (arriba del chat) para esta parte: vas a ver cómo se reemplaza una fila de viaje retirada." },
      /*1 tool*/ { summary: "el viaje que cargamos esta mañana ya no está" },
      /*2 tool*/ { summary: "silver vs. una extracción nueva de la fuente para el 06-29" },
      /*3 assistant*/ { text: "Por qué una actualización normal hacia adelante no puede arreglarlo: el **inicio del viaje redividido no cambió (23:18) y queda *antes* de la marca de agua**, así que `WHERE start > watermark` nunca trae el id nuevo. Deduplicar por `TripId` no sirve (el id cambió), y deduplicar por `(DeviceId, start)` conservaría la fila *obsoleta*.\n" +
        "\n" +
        "La solución es una **conciliación de redivisión de viajes**, que se corre justo después de cada carga de viajes hacia adelante. Vuelve a extraer desde `watermark − L`, donde `L` ≥ tu viaje más largo esperado (unas horas para flotas urbanas, ≥24–36 h para larga distancia). La misma ventana de revisión también captura los viajes largos que *terminaron* después de que un viaje más corto adelantara la marca de agua." },
      /*4 tool*/ { summary: "volver a extraer la ventana de asentamiento hacia bronze" },
      /*5 tool*/ { summary: "DELETE de los huérfanos retirados + anti-join de las divisiones actuales" },
      /*6 warehouse*/ { compactSubtitle: "Viajes conciliados",
        note: "👉 Abre el panel Almacén para comparar bronze.trips_raw (dos versiones del recorrido de las 23:18) con silver.trips (solo el actual b11011A1).",
        stages: [
          { notes: [null, "solo anexar: los ids de viaje retirados y actuales, ambos en disco", "login/logout de DriverChange: eventos de solo anexar", null, null, null] },
          { notes: [null, "1 fila por recorrido · clave (DeviceId, trip_start_utc) · gana la última carga", "Trip.driver → dim_user.id o UnknownDriverId", null, null, null, null, "los conductores son Users con isDriver=true", null, null, null, null] },
          { notes: [null, null, null, null, "50 retirados · 51 redivididos"] },
        ] },
      /*7 assistant*/ { text: "Una última trampa: bronze guarda todas las versiones, así que es tentador simplemente reproducir bronze → silver, pero eso **resucitaría los ids retirados** (bronze todavía tiene el viejo `b10FEE52` junto al nuevo `b11011A1`). La skill se encarga de esto por ti: en lugar de usar el id del viaje como clave, su reconstrucción conserva **una fila por recorrido, tomando la versión cargada más recientemente**, así que un viaje retirado se colapsa en su reemplazo en lugar de duplicarse.\n" +
        "\n" +
        "Y las asignaciones de conductores: los eventos `DriverChange` en sí *son* de solo anexar, pero `Trip.driver` se deriva de ellos: se resuelve en un conductor real o en el centinela `UnknownDriverId`, así que toda unión viajes→conductores debe tolerar ese centinela.\n" +
        "\n" +
        "**El modelo mental: tres formas, tres estrategias:**\n" +
        "\n" +
        "- **Eventos inmutables** (GPS, estado, excepciones, fallas) → anexar + deduplicar por la clave natural.\n" +
        "- **El Trip mutable** → derivar hacia adelante y luego conciliar (DELETE de retirados + anti-join), o reconstruir por clave de recorrido.\n" +
        "- **Dimensiones** (Device, User/conductores, Zone, Rule, Diagnostic) → `Get`, sin bronze, `CREATE OR REPLACE`." },
    ],
    choices: [
      { label: "✅ Agregar controles de calidad y detección de huecos",
        say: "Ahora agrega controles de calidad, controles de actualización y detección de huecos para que pueda confiar en este almacén." },
      { label: "🧩 Volver al espejo operativo",
        say: "Vuelve a la vista del espejo operativo." },
      { label: "↩︎ Volver al simulador principal",
        say: "Llévame de vuelta al simulador de flota." },
    ],
  },
  "warehouse-quality": {
    h: "19ff24b2",
    events: [
      /*0 assistant*/ { text: "Antes de programar esto, decide qué cuenta como confiable. Los controles no buscan que cada vehículo y cada conductor aparezca en cada tabla de hechos; buscan huecos que no podemos explicar.\n" +
        "\n" +
        "Ejemplos: los vehículos estacionados pueden no tener GPS/viajes hoy aunque `dim_device` siga listando toda la flota. Los viajes sin conductor asignado deben quedar explícitos como `UnknownDriverId`, no desaparecer del reporte. También conservamos dos advertencias **semánticas** que salen de leer el SQL que devolvió Ace (Ace agregó un filtro `Speed != 0` a un prompt de estado, y eligió una tabla de origen distinta para dos prompts de viajes equivalentes), porque esa deriva nunca aparece como una fila mala, solo como una forma equivocada." },
      /*1 tool*/ { summary: "batería de calidad: una fila por control, distinto de cero = investigar" },
      /*2 tool*/ { summary: "tablas de confianza creadas + las 2 advertencias semánticas guardadas" },
      /*3 assistant*/ { text: "Los controles están listos: todo pasa excepto la **cobertura de conductores en 88%** (el resto son `UnknownDriverId`, conservados de forma explícita), más las **2 advertencias semánticas** registradas para revisión. Todas las tablas de confianza viven ahora junto a los datos." },
      /*4 warehouse*/ { compactSubtitle: "Controles de calidad",
        note: "Esto también enseña por qué el SQL que devuelve Ace es una ventaja: te permite detectar la deriva semántica antes de que los datos se conviertan en la verdad del negocio.",
        stages: [null,
          { notes: [null, null, null, null, null, null, null, null, null, null, null, null, "control de confianza", "control de confianza", "control de confianza", "control de confianza"] },
          { notes: [null, null, null, null, "50 retirados · 51 redivididos"] }] },
    ],
    choices: [
      { label: "💵 Estimar el costo de operación",
        say: "Estima cuánto cuesta operar este almacén y cómo le daríamos seguimiento." },
      { label: "📊 Mostrar lo que ya podemos responder",
        say: "Muestra qué nuevas preguntas de flota puede responder ahora este almacén." },
      { label: "🩺 Agregar una vista de salud del almacén",
        say: "Falta una cosa: ¿cómo me doy cuenta cuando una tabla se queda atrás sin hacer ruido?" },
      { label: "🧩 Cómo se redividen los viajes",
        say: "Recuérdame por qué los viajes y las asignaciones de conductores no son de solo anexar." },
      { label: "↩︎ Volver al simulador principal",
        say: "Llévame de vuelta al simulador de flota." },
    ],
  },
  "warehouse-costs": {
    h: "40028611",
    events: [
      /*0 assistant*/ { text: "Antes de elegir un calendario de refresco, revisa si esto cabe en el nivel gratuito de MotherDuck y qué haría que empezara a costar dinero.\n" +
        "\n" +
        "La referencia de costos está aquí: [COST_AND_SIZING.md](https://github.com/fhoffa/geotab-vibe-guide/blob/main/skills/geotab-motherduck-warehouse/references/COST_AND_SIZING.md). Midió un almacén demo en **35.2 MiB** para 679,577 pings GPS más viajes/excepciones/dimensiones. El GPS de bronze+silver ocupa unos **54 bytes por ping**, así que el almacenamiento normalmente no es el factor limitante." },
      /*1 tool*/ { summary: "modelo de precios medido aplicado" },
      /*2 assistant*/ { text: "Estimación de costos de la skill:\n" +
        "\n" +
        "- **50 vehículos:** $0/mes en Lite en este modelo: 10 GB de almacenamiento gratis y 10 CU-horas/mes cubren años de historial bronze+silver y refrescos frecuentes.\n" +
        "- **500 vehículos:** todavía puede costar $0 en Lite si conservas solo silver; Business sale en unos **$260/mes** si eliges el plan de plataforma de $250.\n" +
        "- **5,000 vehículos:** aproximadamente **$270–300/mes** en Business.\n" +
        "- **50,000 vehículos:** aproximadamente **$370–520/mes** por un año de historial bronze+silver.\n" +
        "\n" +
        "En resumen: para una flota típica esto sigue siendo gratis; solo empiezas a pagar cuando conservas mucho historial o refrescas muy seguido. Elige una ventana de retención y una cadencia de refresco que encajen con el plan que quieres." },
      /*3 warehouse*/ { compactSubtitle: "Precios + nivel gratuito",
        note: "El panel sigue mostrando todo el almacén que construiste: las cifras de costo de arriba se midieron exactamente contra estas tablas bronze/silver/gold. La confianza incluye controles de costo: conteos de filas, bytes escaneados, segundos de ejecución y alertas cuando el uso se dispara.",
        stages: [null,
          { notes: [null, null, null, null, null, null, null, null, null, null, null, null, "control de confianza", "control de confianza", "control de confianza", "control de confianza"] },
          { notes: [null, null, null, null, "50 retirados · 51 redivididos"] }] },
    ],
    choices: [
      { label: "📉 ¿Puedo submuestrear para seguir gratis?",
        say: "La tabla grande es status_data. ¿Puedo muestrearla o submuestrearla para seguir en el nivel gratuito?" },
      { label: "📊 Mostrar lo que ya podemos responder",
        say: "Muestra qué nuevas preguntas de flota puede responder ahora este almacén." },
      { label: "✅ Revisar los controles de calidad",
        say: "Muestra de nuevo los controles de calidad del almacén." },
      { label: "↩︎ Volver al simulador principal",
        say: "Llévame de vuelta al simulador de flota." },
    ],
  },
  "warehouse-answers": {
    h: "64b7a24d",
    events: [
      /*0 assistant*/ { text: "Una vez que los viajes, las excepciones, las fallas, los datos de estado y las dimensiones están en el mismo almacén, las preguntas se vuelven más grandes que cualquier llamada MCP individual. Ahora el asistente puede cruzar el historial:\n" +
        "\n" +
        "- **Utilización:** ¿Qué vehículos están subutilizados considerando viajes, GPS y grupos?\n" +
        "- **Seguridad:** ¿Qué conductores son riesgosos por excepciones por milla, no solo por conteos brutos de eventos?\n" +
        "- **Mantenimiento:** ¿Qué grupos de fallas se correlacionan con el tiempo de inactividad, las horas de motor y el tipo de vehículo?\n" +
        "- **Costo:** ¿Dónde se acumulan el ralentí, las rutas y el exceso de velocidad en desperdicio de combustible?\n" +
        "\n" +
        "Esa es la verdadera historia: el conector MCP de Geotab es excelente para preguntas en vivo, y MotherDuck convierte esas extracciones MCP en memoria institucional duradera y consultable." },
      /*1 tool*/ { summary: "3 marts listos para responder consultados" },
      /*2 assistant*/ { text: "Ahí está: una **cola de coaching de 14 conductores** y una **lista de trabajo de taller de 9 vehículos**, ambas construidas con historial que ninguna llamada en vivo podría armar sola. A partir de aquí convertirías esto en **dashboards internos** para tu equipo: MotherDuck tiene notebooks y dashboards integrados, así que puedes graficarlos y compartirlos justo donde viven los datos. Vale la pena explorar sus funciones en [motherduck.com](https://motherduck.com)." },
      /*3 warehouse*/ { compactSubtitle: "Marts listos para responder",
        note: "El momento de aprendizaje final: MCP es la capa de acceso; MotherDuck es la capa de memoria; los marts gold son la superficie del producto.",
        stages: [null,
          { notes: [null, null, null, null, null, null, null, null, null, null, null, null, "control de confianza", "control de confianza", "control de confianza", "control de confianza"] },
          { notes: [null, null, null, null, "50 retirados · 51 redivididos", null, null, null] }] },
    ],
    choices: [
      { label: "📍 Poner las fallas en el mapa",
        say: "¿Puedo poner las fallas en un mapa? No recuerdo que las filas de fallas tuvieran coordenadas." },
      { label: "✅ Revisar otra vez los controles de calidad",
        say: "Muestra de nuevo los controles de calidad del almacén." },
      { label: "🧱 Repetir desde la configuración",
        say: "Repite la historia del almacén de MotherDuck desde la configuración." },
      { label: "⚡ Probar preguntas de flota",
        say: "Llévame de vuelta al simulador de flota." },
    ],
  },
  "warehouse-freshness": {
    h: "6e2f4f43",
    events: [
      /*0 assistant*/ { text: "Pregunta justa, y es la diferencia arquitectónica honesta entre esta ruta y el adapter propio de Geotab.\n" +
        "\n" +
        "El MyGeotab API Adapter se sincroniza con **`GetFeed`**: una API oficial que devuelve un **cursor de versión** por tipo de entidad, así que el servicio puede consultar cada pocos segundos (configurable hasta 2 s) y nunca perder ni volver a traer una fila, incluso tras reinicios. **El conector MCP no expone `GetFeed`**: la skill auditó las 20 herramientas MCP y ninguna acepta un token de feed.\n" +
        "\n" +
        "Así que este almacén usa el sustituto compatible con MCP: **marca de agua + deduplicación por clave natural**. Pide las filas más recientes que el último timestamp ya guardado y deja que la deduplicación absorba el solapamiento en los límites (recuerda: Ace solo respeta los límites hasta el segundo). Es la misma idea que un cursor de feed, reconstruida con lo que MCP sí ofrece.\n" +
        "\n" +
        "Lo que gana y lo que cuesta ese intercambio:\n" +
        "- **Cadencia:** este almacén se refresca cuando corre un agente, bajo demanda o con un calendario, normalmente de minutos a diario. El adapter es un servicio 24/7 que se refresca en segundos.\n" +
        "- **Exactitud:** equivalente para eventos inmutables (la deduplicación maneja el solapamiento); los viajes necesitan su paso de conciliación en cualquiera de las dos rutas.\n" +
        "- **El límite que hay que respetar:** analítica, dashboards, resúmenes programados: esta ruta alcanza. Despacho en vivo o alertas sobre datos de hace segundos: eso le toca al conector en vivo, o al adapter.\n" +
        "\n" +
        "La skill mantiene una comparación completa de las dos: **[MCP → MotherDuck vs GetFeed → API Adapter](https://github.com/fhoffa/geotab-vibe-guide/blob/main/guides/MCP_TO_MOTHERDUCK_VS_GETFEED_API_ADAPTER.md)**, incluida la ruta de graduación: haz el prototipo aquí sin infraestructura y pasa al adapter si alguna vez necesitas actualización de menos de un minuto. Los conceptos se transfieren directamente; ambos reflejan las mismas entidades." },
    ],
    choices: [
      { label: "🩺 ¿Y si se queda atrás?",
        say: "Entonces, si los refrescos solo corren cuando corre un agente, ¿qué pasa cuando el almacén se queda atrás? ¿Cómo me daría cuenta siquiera?" },
      { label: "🦆 Empezar a construir (filas GPS)",
        say: "Suficiente para analítica. Construye el almacén, empezando por los puntos GPS." },
      { label: "↩︎ Volver al ciclo de refresco",
        say: "Vuelve al paso de refresco incremental." },
      { label: "⚡ Volver al simulador de flota",
        say: "Llévame de vuelta al simulador principal." },
    ],
  },
  "warehouse-backfill": {
    h: "736408fe",
    events: [
      /*0 assistant*/ { text: "En esa pregunta se esconden dos problemas distintos: **darte cuenta de que vas atrasado** y **ponerte al día de forma segura**. La mayoría solo piensa en el segundo.\n" +
        "\n" +
        "Darte cuenta es trabajo del propio almacén. El adapter registra cursores por servicio en una tabla de salud; el nuestro es una vista: por cada tabla de hechos, la hora del evento más reciente, el retraso respecto a ahora y la última carga:" },
      /*1 tool*/ { summary: "una sola vista responde '¿hay algo atrasado?'" },
      /*2 assistant*/ { text: "Ahí está: **`status_data` va 3.2 horas atrasada** y nada dio error. La extracción de estado de ayer devolvió *exactamente* el límite de página, y el ciclo trató una página llena como 'terminado'. Esa es la trampa para la que existe la heurística de ritmo del adapter:\n" +
        "\n" +
        "**Si la extracción de una ventana devuelve filas hasta el límite superior, o llena el límite de página, sigues atrasado: vuelve a extraer de inmediato. Solo una ventana parcial significa que estás al día.** Sin adivinar, sin esperas fijas." },
      /*3 tool*/ { summary: "puesta al día al ritmo de la regla de parada" },
      /*4 assistant*/ { text: "Al día en tres ventanas, y el resultado parcial de la tercera es la *prueba* de que estamos al día: el ciclo se gana su propia condición de parada.\n" +
        "\n" +
        "Una regla operativa más del adapter, que la impone con una protección por nombre de máquina; nosotros la adoptamos como disciplina: **un solo escritor por almacén**. Dos sesiones de agente refrescando las mismas tablas intercalarán cargas y se corromperán mutuamente las marcas de agua. Una sesión es dueña del refresco; todo lo demás solo lee." },
      /*5 warehouse*/ { compactSubtitle: "Salud + puesta al día",
        note: "Corre la vista de salud al inicio de cada refresco: es la diferencia entre encontrar un hueco ahora y encontrarlo en el reporte del mes que viene.",
        stages: [null,
          { notes: [null, null, null, null, null, null, null, null, null, null, null, null, "control de confianza", "control de confianza", "control de confianza", "control de confianza"] },
          { notes: [null, null, null, null, "50 retirados · 51 redivididos"] }] },
    ],
    choices: [
      { label: "✅ Continuar a los controles de calidad",
        say: "Bien. Ahora agrega los controles de calidad y la detección de huecos." },
      { label: "⏱ ¿Por qué marcas de agua y no GetFeed?",
        say: "Un paso atrás: ¿por qué este almacén usa marcas de agua en lugar de la API de feed oficial de Geotab?" },
      { label: "↩︎ Volver al ciclo de refresco",
        say: "Vuelve al paso de refresco incremental." },
      { label: "⚡ Volver al simulador de flota",
        say: "Llévame de vuelta al simulador principal." },
    ],
  },
  "warehouse-enrichment": {
    h: "6e75b2a6",
    events: [
      /*0 assistant*/ { text: "Buena observación: **`FaultData` y `StatusData` no traen coordenadas**. En el modelo de Geotab, la ubicación vive en `LogRecord`; una falla solo conoce su dispositivo y su timestamp. El API Adapter dedica **dos servicios en segundo plano completos** a interpolar lat/lon/velocidad/rumbo desde los LogRecords cercanos hacia las filas de fallas y de estado.\n" +
        "\n" +
        "En un almacén columnar eso es una sola consulta. El **`ASOF JOIN`** de DuckDB toma, para cada falla, el ping GPS más cercano en o antes del timestamp de la falla, por dispositivo:" },
      /*1 tool*/ { summary: "cada falla ubicada en una sola consulta" },
      /*2 assistant*/ { text: "Las **4,912 fallas obtuvieron coordenadas**, y la distribución de la brecha dice que la coincidencia es honesta: mediana de 2 segundos al ping más cercano, p95 de 23 segundos. (La skill validó este mismo patrón en vivo con **822,203 eventos, 100% emparejados**: aguanta a escala.)\n" +
        "\n" +
        "Una trampa, y es la misma lección de datos tardíos que enseñaron los viajes: **el GPS también llega tarde**. Una falla registrada hace 30 segundos puede no tener todavía en silver los pings que la rodean, así que la unión tomaría un ping de hace minutos. O bien **solo enriqueces eventos más antiguos que un pequeño margen**, o simplemente **reconstruyes este mart en cada refresco**: a este tamaño la reconstrucción es barata, así que eso es lo que programamos." },
      /*3 warehouse*/ { compactSubtitle: "Fallas ubicadas",
        note: "El adapter necesita dos servicios de interpolación dedicados para esto; el almacén lo hace en una consulta. Es el momento más claro de 'por qué un almacén' en toda la construcción.",
        stages: [null, null, { notes: [null, null, null, null, "unido con ASOF al ping GPS previo más cercano"] }] },
    ],
    choices: [
      { label: "📊 Mostrar lo que ya podemos responder",
        say: "Muestra qué nuevas preguntas de flota puede responder ahora este almacén." },
      { label: "✅ Agregar controles de calidad",
        say: "Ahora agrega controles de calidad, controles de actualización y detección de huecos para que pueda confiar en este almacén." },
      { label: "↩︎ Volver al espejo operativo",
        say: "Vuelve a la vista del espejo operativo." },
      { label: "⚡ Volver al simulador de flota",
        say: "Llévame de vuelta al simulador principal." },
    ],
  },
  "warehouse-deletions": {
    h: "b2afc27a",
    events: [
      /*0 assistant*/ { text: "No por sí solo, y esta es una de las trampas más silenciosas de la replicación incremental. **Una eliminación nunca aparece en una extracción incremental.** Una zona eliminada no llega marcada como 'eliminada'; simplemente deja de aparecer. Los ciclos con marca de agua solo ven filas *nuevas*, así que `dim_zone` seguiría sirviendo tan tranquila una zona que ya no existe.\n" +
        "\n" +
        "La respuesta del adapter, que este almacén ya sigue sin haber dicho por qué, es que **las dimensiones reciben una instantánea completa periódica, nunca una incremental**. Por eso cada dim aquí es `Get` → `CREATE OR REPLACE`: sin bronze, sin marca de agua. Cada refresco reemplaza el padrón completo, así que una desaparición *es* la señal. También es la razón por la que **las dimensiones se cargan antes que los hechos**: las filas de hechos nunca deberían llegar antes que las filas que las decodifican.\n" +
        "\n" +
        "Dos refinamientos:\n" +
        "- Geotab a menudo **retira en lugar de eliminar**: `activeFrom`/`activeTo` en Users y similares. Conserva las filas retiradas con sus fechas: el historial todavía se une a ellas.\n" +
        "- El atajo del subconjunto hereda la regla: si conservas solo los ~56 diagnósticos que tus fallas realmente referencian (de 65K), ese subconjunto también debe **derivarse completo de nuevo** en cada refresco, o un diagnóstico recién referenciado nunca aparece." },
      /*1 tool*/ { summary: "control de huérfanos: hechos que apuntan a filas de dimensión faltantes" },
      /*2 assistant*/ { text: "El hábito general que enseña el adapter: antes de cargar cualquier entidad nueva, pregúntate **\"¿esta fila cambia después de crearse?\"**\n" +
        "\n" +
        "- **Nunca** (GPS, estado, excepciones, fallas, `DriverChange`) → anexar + deduplicar por la clave natural.\n" +
        "- **Sí: se reemplaza** (`Trip`: se redivide con un id completamente nuevo) → el paso de conciliación que ya viste.\n" +
        "- **Sí: se actualiza en el lugar** (`DVIRLog`: un defecto luego obtiene su estado de reparación) → vuelve a extraer una ventana reciente, gana la última versión.\n" +
        "- **Dimensiones** (Device, User, Zone, Rule, Diagnostic) → instantánea completa; las eliminaciones se resuelven por construcción.\n" +
        "\n" +
        "Una fila de esa lista es engañosa: `DriverChange` es en sí de solo anexar, pero su *llegada* dispara redivisiones de viajes: un evento inmutable que modifica otra tabla." },
    ],
    choices: [
      { label: "🧩 Cómo se redividen los viajes",
        say: "Recuérdame cómo funciona la conciliación de redivisión de viajes." },
      { label: "✅ Continuar a los controles de calidad",
        say: "Ahora agrega controles de calidad, controles de actualización y detección de huecos para que pueda confiar en este almacén." },
      { label: "↩︎ Volver al espejo operativo",
        say: "Vuelve a la vista del espejo operativo." },
      { label: "⚡ Volver al simulador de flota",
        say: "Llévame de vuelta al simulador principal." },
    ],
  },
  "warehouse-downsample": {
    h: "8e5295d4",
    events: [
      /*0 assistant*/ { text: "Sí, pero *dónde* submuestreas decide si alguna vez puedes cambiar de opinión.\n" +
        "\n" +
        "El API Adapter ofrece muestreo al momento de la ingesta: un intervalo mínimo de 1–3600 s por dispositivo para LogRecords y StatusData. Es efectivo, y su propia documentación trae la advertencia que importa: **lo que descartas en la ingesta nunca se puede recuperar con un backfill.** Eliges un piso de 60 s hoy, necesitas granularidad de 10 s el próximo trimestre: ese historial ya no existe.\n" +
        "\n" +
        "La versión de almacén de esa misma palanca es más segura: **mantén bronze completo y submuestrea en la derivación de silver o en el mart gold.** El almacenamiento es la parte barata (~54 bytes por ping, recuerda); lo que realmente ajustas es el tamaño del mart y el costo de escaneo:" },
      /*1 tool*/ { summary: "piso de 30 segundos aplicado en el mart; bronze intacto" },
      /*2 assistant*/ { text: "Un mart 78% más pequeño para dashboards y preguntas diarias, mientras **cada fila original sigue a un `CREATE TABLE` de distancia**: cambia el piso a 10 s el próximo trimestre y reconstruye.\n" +
        "\n" +
        "Una advertencia honesta antes de apoyarte en esa reversibilidad: solo dura lo que dure bronze. Si más adelante agregas una **ventana de depuración de bronze** (por ejemplo, una ventana móvil de 7–30 días) para limitar el almacenamiento, entonces para el historial depurado el submuestreo se vuelve tan permanente como el del adapter. Así que el orden de las decisiones importa: **elige tu piso de granularidad antes de que la depuración alcance** el historial que te importa.\n" +
        "\n" +
        "Para esta flota de 50 vehículos nada de esto es obligatorio: todo el almacén ocupa 35.2 MiB frente a 10 GB gratis. Esta palanca existe para el día en que la flota sea 10× y `status_data` sea la razón por la que se movió la línea de almacenamiento." },
      /*3 warehouse*/ { compactSubtitle: "Mart submuestreado",
        note: "El adapter muestrea en la ingesta y nunca puede hacer backfill; el almacén muestrea en la derivación y sí puede. La misma palanca, con el perfil de arrepentimiento opuesto.",
        stages: [null,
          { notes: [null, null, null, null, null, null, null, null, null, null, null, null, "control de confianza", "control de confianza", "control de confianza", "control de confianza"] },
          { notes: [null, null, null, null, "50 retirados · 51 redivididos"] }] },
    ],
    choices: [
      { label: "📊 Mostrar lo que ya podemos responder",
        say: "Muestra qué nuevas preguntas de flota puede responder ahora este almacén." },
      { label: "💵 Volver a la estimación de costos",
        say: "Muestra de nuevo la estimación de costos." },
      { label: "⚡ Volver al simulador de flota",
        say: "Llévame de vuelta al simulador principal." },
    ],
  },
  "ep-roi": {
    h: "fc8e4fa5",
    events: [
      /*0 system*/ { text: "Cruzando seguridad, combustible, ralentí y mantenimiento para totalizar la oportunidad recuperable…" },
      /*1 assistant*/ { text: "Preguntaste a dónde se va el dinero: déjame totalizar la oportunidad *recuperable* en todo lo que hemos revisado, manteniendo cada número conservador. Un caso de ROI que exagera se desarma en la sala, así que uso el extremo bajo de cada rango." },
      /*2 tool*/ { summary: "≈ $75,500 / año capturables (~$1,510 por vehículo) en 4 palancas" },
      /*3 assistant*/ { text: "Aquí está el dinero, totalizado para la flota de Las Vegas: unos **$75,500 al año recuperables, aproximadamente $1,510 por vehículo**:\n" +
        "\n" +
        "- **Exceso de velocidad → combustible: ~$33,000.** Un 6–8% de una factura de combustible de ~$498k/año, cerrando la brecha entre tus 17.3 mpg y el rendimiento nominal. *Solución: la regla de límite señalizado en toda la flota + alerta.*\n" +
        "- **Colisiones y seguro: ~$28,000** (ponderado por riesgo). Coaching a los tres conductores con múltiples factores, más el crédito de prima por telemática que dan las aseguradoras a un programa de scorecard. *Solución: coaching de conductores + scorecard.*\n" +
        "- **Mantenimiento y tiempo fuera de servicio: ~$12,000.** Servicio preventivo en lugar de reactivo y menos días fuera de servicio no planeados. *Solución: recordatorios de mantenimiento + triaje por severidad.*\n" +
        "- **Ralentí: ~$2,500.** Un recorte de 20–30% sobre los $10.9k/año que hoy quemas estacionado. *Solución: una regla de ralentí.*\n" +
        "\n" +
        "Dos advertencias honestas para que esto aguante el escrutinio: la **línea de colisiones es un valor esperado, no un ahorro asegurado** (trátala como el premio, no como la factura), y **no conté doble** el solapamiento entre las líneas de combustible y ralentí (un pie derecho más tranquilo ayuda a ambas; la línea de exceso de velocidad ya absorbe la ganancia de combustible por estilo de manejo).\n" +
        "\n" +
        "El patrón que vale la pena llevar arriba: las dos palancas más grandes, combustible y colisiones, son el *mismo comportamiento*: velocidad y agresividad. Así que no son cuatro proyectos compitiendo por presupuesto; es **un solo programa de seguridad** (política de velocidad + coaching) que cubre ~80% del total, y las piezas de mantenimiento y ralentí vienen detrás. ¿Quieres que lo ponga en una página que puedas reenviarle a tu jefe?" },
      /*4 chart*/ { title: "Ahorro anual recuperable por palanca · flota de Las Vegas (USD, conservador)",
        bars: ["Exceso de velocidad → combustible", "Colisiones y seguro", "Mantenimiento y tiempo fuera de servicio", "Ralentí"] },
    ],
    choices: [
      { label: "📄 Redactar el resumen de una página para mi jefe",
        say: "Conviértelo en un caso de negocio de una página que pueda reenviarle a mi jefe." },
      { label: "🛠️ Empaquetarlo como una skill trimestral de ROI",
        say: "Empaqueta esto en una skill reutilizable que reconstruya el caso de ROI con datos en vivo cada trimestre." },
      { label: "🔔 Empezar por la palanca más grande: alerta de velocidad",
        say: "Empieza por la palanca más grande: configura la alerta por exceder el límite señalizado en toda la flota." },
      { label: "🧑‍🏫 Dar coaching a los conductores de alto riesgo",
        say: "Identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su gerente." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep-roi-onepager": {
    h: "9f8cf5f1",
    events: [
      /*0 system*/ { text: "Este flujo usa dos conectores: Geotab + Gmail." },
      /*1 assistant*/ { text: "Redactando un caso de negocio de una página con los números que acabamos de obtener: resumen ejecutivo, las cuatro palancas con cifras conservadoras, el primer paso recomendado y las advertencias honestas para que aguante en la sala. Lo dejo en Borradores, sin enviarlo." },
      /*2 tool*/ { summary: "Resumen de una página guardado en Borradores (NO enviado)" },
      /*3 assistant*/ { text: "Listo: el resumen de una página está en Borradores (abre la tarjeta para leerlo). Abre con la cifra principal, desglosa las cuatro palancas, hace una sola recomendación clara y, lo más importante, plantea él mismo las advertencias, para que tu director vea que ya lo pusiste a prueba. Esa es la versión que consigue un sí.\n" +
        "\n" +
        "(La demo apunta a un buzón de prueba, nunca a un destinatario real.)" },
    ],
    choices: [
      { label: "📤 Enviarlo al director",
        say: "Se ve bien: envía el caso de negocio ahora." },
      { label: "🔔 Arrancar la palanca #1 en Geotab ya",
        say: "Configura la alerta por exceder el límite señalizado en toda la flota y envíala a un gerente." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Déjame probar otra cosa." },
    ],
  },
  "ep-roi-send": {
    h: "d503101a",
    events: [
      /*0 tool*/ { summary: "Enviado a ops-director@test-mailbox.example" },
      /*1 assistant*/ { text: "Enviado. Tu director ya tiene un caso de negocio con costos y advertencias, construido con datos de flota en vivo, no con una diapositiva de un proveedor, y con una sola petición clara. Cuando estés listo para actuar con la aprobación, puedo montar la regla de velocidad, la lista de coaching y los recordatorios de mantenimiento en unos minutos." },
      /*2 endcard*/ { lines: ["Conector MCP de Geotab", "De la telemetría a la sala de juntas, en una sola conversación."] },
    ],
    choices: [
      { label: "🔔 Arrancar la palanca #1: la alerta de velocidad",
        say: "Ahora configura la alerta por exceder el límite señalizado en toda la flota y envíala a un gerente." },
      { label: "⚡ Probar otro",
        say: "Muéstrame otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "carto-fleet": {
    h: "6fa38ebf",
    events: [
      /*0 system*/ { text: "Dos servidores MCP conectados: **Geotab** (base de datos `demo_fh_vegas8`, una flota demo de 50 vehículos en Las Vegas) y **CARTO** (conexión `carto_dw`, que además puede consultar los datasets públicos Kontur Population y Spatial Features de CARTO)." },
      /*1 assistant*/ { text: "Primero reviso la guía de consultas de Geotab, luego cuento los vehículos y obtengo la última posición de cada uno." },
      /*2 tool*/ { summary: "guía de consultas seguras: contar primero, luego DeviceStatusInfo con un selector de propiedades" },
      /*3 tool*/ { summary: "50 vehículos" },
      /*4 tool*/ { summary: "50 posiciones · 22 en marcha · 28 estacionados · todos comunicando" },
      /*5 map*/ { title: "La flota ahora mismo · 7:08 pm hora de Las Vegas (30 sep)",
        summary: "22 en marcha (azul) · 28 estacionados (puntos rojos, más grande = más vehículos)",
        layerLabel: "Vehículos · última posición",
        disclosure: "Mapa creado en CARTO Builder · © CARTO, © colaboradores de OpenStreetMap · instantánea del 1 oct 2026, ~02:08 UTC" },
      /*6 assistant*/ { text: "**50 vehículos: 22 en marcha, 28 estacionados**, todos alrededor de Las Vegas. Los 50 reportaron en los últimos minutos, así que esto está actualizado a las 7:08 pm hora de Las Vegas (30 sep)." },
    ],
    choices: [
      { label: "📍 Agrupar los vehículos estacionados en hubs",
        say: "Agrupa los vehículos estacionados en hubs." },
      { label: "❓ ¿Qué es CARTO?",
        say: "¿Qué es CARTO y qué hace aquí?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Muéstrame otra cosa." },
    ],
  },
  "carto-what-is": {
    h: "f278b3d3",
    events: [
      /*0 assistant*/ { text: "CARTO es una plataforma de analítica de ubicación que ejecuta SQL espacial en tu almacén de datos. Aquí la uso para agrupar los vehículos estacionados, ver qué hay a su alrededor y calcular hasta dónde puedes llegar manejando en 15 minutos." },
    ],
    choices: [
      { label: "📍 Agrupar los vehículos estacionados en hubs",
        say: "Agrupa los vehículos estacionados en hubs." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Muéstrame otra cosa." },
    ],
  },
  "carto-hubs": {
    h: "11900dcc",
    events: [
      /*0 assistant*/ { text: "Paso las 28 posiciones de estacionamiento directamente a una consulta en tu conexión de CARTO, agrupadas en hexágonos H3 de resolución 8 (unos 0.7 km² cada uno). Varios vehículos en un mismo hexágono suelen indicar un patio compartido." },
      /*1 tool*/ { summary: "5 celdas con varios vehículos · 25 de 28 vehículos estacionados" },
      /*2 map*/ { title: "Cinco hubs · vehículos estacionados por celda H3",
        summary: "25 de 28 vehículos estacionados están en cinco celdas",
        layerLabel: "H3 res 8 · residentes",
        disclosure: "Dibujado por el asistente a partir de los resultados de consultas CARTO de esta sesión · residentes: Kontur Population (H3 res 8) · instantánea del 1 oct 2026, ~02:08 UTC",
        pins: ["Oeste · 6", "Centro · 5", "Sureste · 5", "Sur · 4", "Norte · 5"] },
      /*3 assistant*/ { text: "**Cinco hubs.** 25 de los 28 vehículos estacionados están en uno de cinco puntos; los otros 3 están estacionados solos. Nombré los hubs según dónde quedan en el mapa.\n" +
        "\n" +
        "Pero esto es una sola instantánea a eso de las 7 pm, así que no puedo asegurar que sean patios. Algunos podrían ser el sitio de un cliente o un estacionamiento compartido. Unas semanas de datos de estacionamiento, o tu lista de bases, lo resolverían." },
    ],
    choices: [
      { label: "🏙️ ¿Qué hay alrededor de cada hub?",
        say: "¿Qué hay alrededor de cada hub?" },
      { label: "❓ ¿Qué es CARTO?",
        say: "¿Qué es CARTO y qué hace aquí?" },
    ],
  },
  "carto-context": {
    h: "c0dac835",
    events: [
      /*0 assistant*/ { text: "Voy a contar residentes (Kontur Population) más tiendas, restaurantes, turismo y luz nocturna (Spatial Features) dentro de 3 anillos de hexágonos alrededor de cada hub, unos 2.5 km a la redonda." },
      /*1 tool*/ { summary: "5 hubs × residentes, comercio, comida y bebida, turismo, luz nocturna" },
      /*2 chart*/ { title: "Residentes dentro de 3 anillos (miles)",
        bars: ["Oeste", "Centro", "Sureste", "Sur", "Norte"] },
      /*3 chart*/ { title: "POIs comerciales dentro de 3 anillos",
        bars: ["Oeste", "Centro", "Sureste", "Sur", "Norte"] },
      /*4 assistant*/ { text: "**Sur** es el núcleo comercial: la menor cantidad de residentes (~14k) pero la mayor de tiendas (2,140), lugares para comer (1,758), turismo y luz nocturna. **Norte** es lo opuesto, con ~55k residentes y solo 158 tiendas, la menor de todos los hubs. **Oeste** tiene la mayor cantidad de residentes (~70k) y unas cuatro veces el comercio de Norte. Centro (~58k residentes, 1,582 tiendas) está activo en ambos frentes, y Sureste queda en medio." },
    ],
    choices: [
      { label: "🚗 ¿A quién alcanza cada hub en 15 min?",
        say: "¿A cuántas personas puede llegar cada hub en 15 minutos en auto?" },
    ],
  },
  "carto-reach": {
    h: "a2bb9e7b",
    events: [
      /*0 assistant*/ { text: "Las calles deciden hasta dónde llegas en realidad, así que voy a obtener un área de 15 minutos en auto para cada hub y luego contar a las personas dentro." },
      /*1 tool*/ { summary: "Oeste · área de 15 min en auto (GeoJSON)" },
      /*2 tool*/ { summary: "Centro · área de 15 min en auto (GeoJSON)" },
      /*3 tool*/ { summary: "Sureste · área de 15 min en auto (GeoJSON)" },
      /*4 tool*/ { summary: "Sur · área de 15 min en auto (GeoJSON)" },
      /*5 tool*/ { summary: "Norte · área de 15 min en auto (GeoJSON)" },
      /*6 assistant*/ { text: "Vienen como GeoJSON, así que simplifico un poco los cinco polígonos, los meto en la consulta como geometría y cuento los residentes dentro de cada uno." },
      /*7 tool*/ { summary: "1.65M residentes a 15 min · 80% de 2.07M" },
      /*8 map*/ { title: "Áreas de 15 minutos en auto desde cada hub",
        summary: "1.65M residentes (80%) a 15 min de un hub",
        layerLabel: "H3 res 8 · residentes",
        disclosure: "Dibujado por el asistente a partir de los resultados de consultas CARTO de esta sesión · residentes: Kontur Population (H3 res 8) · áreas de manejo simplificadas · instantánea del 1 oct 2026, ~02:08 UTC",
        pins: ["Oeste", "Centro", "Sureste", "Sur", "Norte"] },
      /*9 chart*/ { title: "Residentes alcanzables en 15 min en auto (miles)",
        bars: ["Centro", "Sureste", "Sur", "Oeste", "Norte"] },
      /*10 assistant*/ { text: "**Unas 1.65M personas viven a menos de 15 minutos en auto de al menos un hub**, aproximadamente el 80% de los 2.07M del área que estoy contando: celdas pobladas dentro de 55 anillos H3 (unos 50 km) del centro de Las Vegas. Centro alcanza a más (680k) y Norte a menos (405k).\n" +
        "\n" +
        "Las cifras por hub suman más de 1.65M porque las áreas de manejo se solapan." },
    ],
    choices: [
      { label: "➕ ¿Dónde ayudaría más un sexto hub?",
        say: "¿Dónde agregaría más alcance un sexto hub?" },
    ],
  },
  "carto-site": {
    h: "bd0d7b3f",
    events: [
      /*0 assistant*/ { text: "Revisar los tiempos de manejo de cada punto posible tomaría cientos de llamadas, así que lo hago en dos pasos. Primero, una preselección rápida por distancia en línea recta: considero sin cobertura un vecindario si está a más de 8 km del hub más cercano, y califico cada punto posible según cuántos residentes sin cobertura viven a menos de 8 km. Luego, una revisión real de tiempo de manejo para el ganador." },
      /*1 tool*/ { summary: "las 5 mejores celdas · 225k residentes sin cobertura a menos de 8 km de la #1" },
      /*2 assistant*/ { text: "Para ver por qué ganan esas cinco, traigo cada celda con su distancia al hub más cercano y su puntaje:" },
      /*3 tool*/ { summary: "2,090 celdas · distancia al hub más cercano + puntaje" },
      /*4 assistant*/ { text: "Las celdas rojas están a más de 8 km de todos los hubs, así que cuentan como sin cobertura. El segundo mapa califica cada punto según cuántos de esos residentes viven a menos de 8 km." },
      /*5 map*/ { title: "Huecos · a más de 8 km del hub más cercano",
        summary: "Rojo = celdas pobladas a más de 8 km en línea recta de todos los hubs · anillos punteados = 8 km alrededor de cada hub",
        layerLabel: "H3 res 8 · sin cobertura (> 8 km)",
        disclosure: "Dibujado por el asistente a partir de los resultados de consultas CARTO de esta sesión · residentes: Kontur Population (H3 res 8) · instantánea del 1 oct 2026, ~02:08 UTC" },
      /*6 map*/ { title: "Puntaje de candidatos · residentes sin cobertura a menos de 8 km",
        summary: "Más oscuro = más residentes sin cobertura a menos de 8 km · los cinco mejores candidatos, en un círculo",
        layerLabel: "H3 res 8 · puntaje de candidato",
        disclosure: "Dibujado por el asistente a partir de los resultados de consultas CARTO de esta sesión · residentes: Kontur Population (H3 res 8) · instantánea del 1 oct 2026, ~02:08 UTC",
        pins: ["Top 5"] },
      /*7 assistant*/ { text: "Los cinco mejores son celdas vecinas a unos 2 km entre sí, y sus puntajes difieren menos de 2%. Así que la respuesta es esta zona de la ciudad, no una celda exacta. Reviso la mejor por tiempo de manejo:" },
      /*8 tool*/ { summary: "Mejor celda · área de 15 min en auto (GeoJSON)" },
      /*9 tool*/ { summary: "+181k residentes con nueva cobertura · cobertura 80% → 88.5%" },
      /*10 map*/ { title: "Sexto hub propuesto · área de 15 minutos en auto",
        summary: "+181k residentes nuevos a 15 min · cobertura → 88.5%",
        layerLabel: "H3 res 8 · residentes",
        disclosure: "Dibujado por el asistente a partir de los resultados de consultas CARTO de esta sesión · residentes: Kontur Population (H3 res 8) · áreas de manejo simplificadas · instantánea del 1 oct 2026, ~02:08 UTC",
        pins: ["Hub 6"] },
      /*11 assistant*/ { text: "**La mejor zona está justo al este de Centro, alrededor de 36.17°N, 115.06°O.** Un hub ahí pondría a **181k personas más** a menos de 15 minutos en auto, llevando la cobertura del 80% al 88.5%.\n" +
        "\n" +
        "Los 225k y los 181k miden cosas distintas. 225k son personas a más de 8 km en línea recta de cualquier hub que viven a menos de 8 km del sitio. 181k son personas dentro de la nueva área de 15 minutos en auto que no están ya dentro de una de las cinco existentes. (Las dos medidas tampoco coinciden hoy: 8 km en línea recta desde un hub cubren el 68%; las áreas de 15 minutos en auto, cerca del 80%.)" },
    ],
    choices: [
      { label: "🗺️ Ponerlo en un mapa que pueda compartir",
        say: "Ponlo en un mapa que pueda compartir." },
      { label: "🎯 Optimizar por algo distinto a residentes",
        say: "¿Y si optimizo por algo distinto a residentes?" },
      { label: "🧐 ¿Qué debería verificar?",
        say: "¿Qué debería verificar antes de actuar con esto?" },
    ],
  },
  "carto-data": {
    h: "a18ba0b5",
    events: [
      /*0 assistant*/ { text: "Kontur solo sabe cuántas personas viven en cada celda, así que para ingresos o comercios necesito otros datos. Primero reviso qué hay ya en tu conexión de CARTO." },
      /*1 tool*/ { summary: "sin coincidencias en esta conexión" },
      /*2 assistant*/ { text: "No hay nada suscrito en tu cuenta, pero los datasets públicos de CARTO se pueden consultar directamente, que es como leí los residentes de Kontur. Ahora busco en el catálogo del Data Observatory por lo que quiero medir, no por nombre de dataset." },
      /*3 tool*/ { summary: "5 coincidencias · la mejor: Households By Income Quintiles (Michael Bauer International)" },
      /*4 tool*/ { summary: "licencia: Premium data" },
      /*5 assistant*/ { text: "Ese es un dataset premium con licencia. La Encuesta sobre la Comunidad Estadounidense (ACS) de la Oficina del Censo es pública y gratuita, así que uso esa:" },
      /*6 tool*/ { summary: "ACS DP03 Selected Economic Characteristics · sector censal · público" },
      /*7 assistant*/ { text: "Los sectores censales son el nivel más fino. Son polígonos, no hexágonos, así que cada celda toma el sector donde cae. Reviso qué tan bien coinciden:" },
      /*8 tool*/ { summary: "datos 2019: 100% de los residentes con coincidencia en un sector con datos de ingresos" },
      /*9 assistant*/ { text: "Todas las celdas coinciden, porque las tablas de 2019 usan los mismos límites de sectores que los de tu conexión.\n\n**Cómo encontré los datos:** reviso qué tiene ya la conexión, busco en el catálogo por la medida que quiero, miro la licencia, elijo la geografía más fina que sirva y pruebo la unión antes de depender de ella. Los comercios y restaurantes ya están en la tabla pública Spatial Features de CARTO, que uno por celda." },
    ],
    choices: [
      { label: "🎯 Correr los tres objetivos",
        say: "Corre la búsqueda para los tres objetivos." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Muéstrame otra cosa." },
    ],
  },
  "carto-explore": {
    h: "ca50a803",
    events: [
      /*0 assistant*/ { text: "Déjame ver qué te ofrece el lado de CARTO antes de sugerir nada." },
      /*1 tool*/ { summary: "1 conexión · carto_dw (BigQuery)" },
      /*2 tool*/ { summary: "áreas de manejo y rutas activas · quedan 14,991 de 15,000 llamadas del servicio de ubicación" },
      /*3 tool*/ { summary: "151 datasets demográficos públicos para EE. UU." },
      /*4 tool*/ { summary: "172 datasets premium para EE. UU. (todas las categorías)" },
      /*5 assistant*/ { text: "Esto es lo que tienes. Una conexión de CARTO que puede ejecutar SQL espacial por sí sola, un servicio de tiempos de manejo con casi toda su cuota anual disponible (las llamadas de ubicación se miden; las usaré con moderación) y un catálogo público de unos 151 datasets demográficos que puedes consultar sin pagar, además de los premium si los compras.\n\nCombinado con Geotab, tres cosas que la gente suele probar primero:\n- **¿Dónde están mis vehículos y dónde se agrupan?** Agrupar los vehículos estacionados en hubs y ver qué hay alrededor.\n- **¿Dónde ayudaría más un hub nuevo?** Alcance por tiempo de manejo y luego una búsqueda de sitio, ponderada por lo que te importe.\n- **¿Pueden mis propios viajes decírmelo?** Usar dónde terminan realmente los viajes en vez de datos públicos." },
    ],
    choices: [
      { label: "📍 ¿Dónde está mi flota ahora mismo?",
        say: "¿Dónde está mi flota ahora mismo?" },
      { label: "🎯 ¿Dónde ayudaría más un hub nuevo?",
        say: "¿Dónde ayudaría más un hub nuevo y con qué datos podría ponderarlo?" },
      { label: "🧭 Usar mis propios viajes",
        say: "¿Puedo usar mis propios viajes en vez de datos públicos?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Muéstrame otra cosa." },
    ],
  },
  "carto-trips": {
    h: "f54b9785",
    events: [
      /*0 assistant*/ { text: "Dónde terminan tus propios viajes muestra lo que tus vehículos realmente hacen. Los viajes son de alto volumen, así que primero miro una ventana corta." },
      /*1 tool*/ { summary: "534 viajes en 6 horas · cada uno con su punto de parada" },
      /*2 assistant*/ { text: "**Tus viajes confirman los hubs.** Los 534 puntos de parada caen en 6 lugares: los cinco hubs que encontramos con los vehículos estacionados, más uno. Así que los hubs son lugares de trabajo reales, no solo donde los vehículos se estacionaron.\n\nPara planear el próximo hub ponderaría por demanda, es decir, dónde están tus clientes. Puedes obtenerlo de sitios de clientes guardados como zonas en MyGeotab, de unas semanas de historial de viajes o de tu CRM. Lo más probable es que tus clientes estén en un CRM, así que ahí es lo más rápido empezar." },
    ],
    choices: [
      { label: "🧾 Traer mis clientes desde Salesforce",
        say: "Mis clientes están en Salesforce. ¿Puedes traerlos y usar esos?" },
      { label: "🎯 Probar con datos públicos",
        say: "Está bien, ¿con qué datos públicos podría ponderarlo?" },
      { label: "📍 ¿Dónde está mi flota ahora mismo?",
        say: "¿Dónde está mi flota ahora mismo?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Muéstrame otra cosa." },
    ],
  },
  "carto-customers": {
    h: "51b3fb5a",
    events: [
      /*0 assistant*/ { text: "Tus clientes viven en Salesforce. Traeré la dirección de entrega de cada cuenta y cuántos pedidos hizo en los últimos 90 días." },
      /*1 tool*/ { summary: "12 cuentas · 953 pedidos en 90 días" },
      /*2 system*/ { text: "La llamada a Salesforce y estos clientes son **ilustrativos**: empresas y cantidades de pedidos inventadas, en lugar de tu CRM. La geocodificación y la búsqueda de sitio de abajo sí se ejecutaron de verdad en CARTO." },
      /*3 assistant*/ { text: "Las direcciones son solo texto, así que las convierto en coordenadas en una sola llamada." },
      /*4 tool*/ { summary: "12 de 12 con coincidencia · todas a nivel de calle (confianza 1.0)" },
      /*5 assistant*/ { text: "Ahora la misma búsqueda de sitio con los pedidos como objetivo. Para cada pedido mido qué tan lejos está del hub más cercano, luego pruebo cada celda poblada como hub nuevo y me quedo con la que más acorta la distancia ponderada por pedidos." },
      /*6 tool*/ { summary: "distancia promedio 5.72 km → 3.16 km con el mejor hub nuevo" },
      /*7 chart*/ { title: "Distancia al hub más cercano hoy (km)" },
      /*8 assistant*/ { text: "**Un hub nuevo cerca de Green Valley, en Henderson (36.02°N, 115.08°O), reduce la distancia promedio que recorre un pedido de 5.72 km a 3.16 km, cerca de un 45% menos.**\n\nEl motivo se ve en la lista: tus tres cuentas de Henderson son el 37% de los pedidos y están a 6 a 10 km del hub más cercano, mientras que los clientes del centro y de Summerlin ya están a unos 2.5 km de uno.\n\nEsa es también la esquina del valle que señalaron los datos públicos (ingresos y comercios), a unos 5 a 6 km. Que tres objetivos independientes coincidan es un argumento más fuerte que cualquiera por separado.\n\nAquí es donde ya vendes, así que es el lugar correcto para atender mejor a tus clientes. Para ver dónde podrías vender más, sumaría los datos demográficos. Una corrida real usaría además todas tus cuentas, y la revisión de tiempo de manejo viene después." },
    ],
    choices: [
      { label: "🔍 ¿Dónde podría vender más?",
        say: "Ahí es donde vendo hoy. ¿Dónde podría vender más?" },
      { label: "🗺️ Ponerlo en un mapa que pueda compartir",
        say: "Ponlo en un mapa que pueda compartir." },
      { label: "↩︎ Preguntar otra cosa",
        say: "Muéstrame otra cosa." },
    ],
  },
  "carto-potential": {
    h: "1b978822",
    events: [
      /*0 assistant*/ { text: "Los pedidos muestran dónde ya vendes. Para encontrar dónde podrías vender más, tomo a los residentes de mayores ingresos de los datos del Censo y me quedo solo con los que viven a más de 5 km de cualquiera de tus clientes actuales. Ese es tu espacio sin atender. Luego califico cada hub posible según cuánto de eso queda a menos de 8 km." },
      /*1 tool*/ { summary: "201,147 de 515,898 residentes de mayores ingresos (39%) están a más de 5 km de cualquier cliente" },
      /*2 map*/ { title: "Dónde vendes hoy vs. dónde podrías vender más",
        summary: "Naranja = residentes de mayores ingresos a más de 5 km de cualquier cliente (más oscuro = más) · puntos verdes = clientes (más grande = más pedidos) · azul = hubs · anillos punteados = 8 km alrededor de cada opción de hub",
        layerLabel: "H3 res 8 · espacio sin atender",
        disclosure: "Dibujado por el asistente a partir de los resultados de consultas CARTO de esta sesión · residentes: Kontur Population (H3 res 8) · ingresos: ACS 2015–2019 por sector censal · los clientes son ilustrativos · instantánea del 8 oct 2026, ~15:15 UTC",
        pins: ["Atender · Green Valley", "Crecer · Suroeste"] },
      /*3 chart*/ { title: "Residentes de mayores ingresos sin atender a menos de 8 km del hub",
        bars: ["Opción de los clientes (Henderson)", "Opción del espacio sin atender (suroeste)"] },
      /*4 assistant*/ { text: "**Los dos objetivos señalan hubs distintos, y ambos sirven.**\n- **Atender a los clientes que ya tienes:** Green Valley, en Henderson, acorta en un 45% el viaje promedio de un pedido.\n- **Abrir terreno nuevo:** el suroeste del valle (36.03°N, 115.22°O) tiene unas 4 veces más residentes de mayores ingresos sin ningún cliente cerca (43,538 vs 10,987).\n\nEl 39% de los residentes de mayores ingresos del área vive a más de 5 km de cualquier cuenta, así que hay espacio para crecer. Muchas flotas usan el primer hub para mejorar el servicio ahora y el segundo como base para una campaña de ventas. Con tu lista completa de cuentas, esto se afina más." },
    ],
    choices: [
      { label: "🗺️ Ponerlo en un mapa que pueda compartir",
        say: "Ponlo en un mapa que pueda compartir." },
      { label: "🧐 ¿Qué debería verificar?",
        say: "¿Qué debería verificar antes de actuar con esto?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Muéstrame otra cosa." },
    ],
  },
  "carto-objective": {
    h: "6c173b7a",
    events: [
      /*0 assistant*/ { text: "Ahora la misma búsqueda con tres pesos: residentes (como antes), **residentes de mayores ingresos** (un dato demográfico) y **comercios y restaurantes** (un indicador del tránsito diurno). Primero, una mirada nueva a dónde están tus vehículos estacionados." },
      /*1 tool*/ { summary: "50 posiciones · 23 en marcha · 27 estacionados · 24 en los mismos cinco hubs" },
      /*2 tool*/ { summary: "3 objetivos · la mejor celda de cada uno" },
      /*3 tool*/ { summary: "Ganador de mayores ingresos · área de 15 min en auto (GeoJSON)" },
      /*4 chart*/ { title: "Porcentaje a más de 8 km de todos los hubs hoy (%)",
        bars: ["Residentes", "Residentes de mayores ingresos", "Comercios + restaurantes"] },
      /*5 assistant*/ { text: "**El objetivo cambia la respuesta.**\n" +
        "- **Residentes:** 36.17°N, 115.06°O, justo al este de Centro, la misma celda de antes.\n" +
        "- **Residentes de mayores ingresos:** 36.02°N, 115.02°O, en el sureste del valle hacia Henderson, a unos 17 km de la opción por residentes.\n" +
        "- **Comercios + restaurantes:** 36.05°N, 115.03°O, a unos 3 km de la opción por ingresos.\n\n" +
        "Elegir residentes cuesta mucho en los otros objetivos: esa celda conserva solo el 64% del mejor puntaje de ingresos y el 60% del mejor puntaje de comercios. Las opciones por ingresos y por comercios están cerca una de la otra, y cada una conserva el 92% y el 92% de la mejor de la otra.\n\n" +
        "La brecha también cambia. El 35.9% de los residentes de mayores ingresos vive a más de 8 km de todos los hubs, frente al 32.6% de todos los residentes y el 19.4% de los comercios y restaurantes." },
      /*6 assistant*/ { text: "Unas notas. El puntaje de residentes es un poco distinto del paso anterior (234,038 vs 225,133) porque usé las posiciones de hoy y no las del 1 oct. Esta es la preselección en línea recta, más un área de 15 minutos en auto para la opción por ingresos; el siguiente paso es la revisión de tiempo de manejo de cada opción. El ingreso es la cifra del ACS 2015–2019 de cada sector censal, un promedio de la zona y no las personas que atenderán tus conductores, y dejé fuera raza y etnia a propósito. También puedes invertir el objetivo por equidad y preguntar dónde tienen la peor cobertura las zonas de menores ingresos." },
    ],
    choices: [
      { label: "🗺️ Ponerlo en un mapa que pueda compartir",
        say: "Ponlo en un mapa que pueda compartir." },
      { label: "🧭 Usar mis propios viajes como objetivo",
        say: "¿Puedo usar mis propios viajes como objetivo?" },
      { label: "🧐 ¿Qué debería verificar?",
        say: "¿Qué debería verificar antes de actuar con esto?" },
      { label: "↩︎ Preguntar otra cosa",
        say: "Muéstrame otra cosa." },
    ],
  },
  "carto-map": {
    h: "97f4bae8",
    events: [
      /*0 assistant*/ { text: "Primero leo el formato de mapas de CARTO en lugar de adivinar nombres de campos, valido el mapa contra él y luego lo guardo en Builder. Lo dejo privado para que tú elijas con quién compartirlo." },
      /*1 tool*/ { summary: "formato de mapa: datasets, capas, estilos" },
      /*2 tool*/ { summary: "paquete válido · 3 datasets · prueba en seco del SQL OK" },
      /*3 tool*/ { summary: "mapa privado de Builder creado" },
      /*4 tool*/ { summary: "mapa interactivo en el chat (solo en hosts con MCP Apps)" },
      /*5 tool*/ { summary: "plantilla de URL del workspace para enlaces de Builder" },
      /*6 system*/ { text: "`view_map` muestra el mapa interactivo en el chat solo en apps compatibles con MCP Apps; en las demás recibes el enlace. El mapa es privado para la cuenta de CARTO que lo creó, así que el simulador no puede mostrarlo." },
      /*7 assistant*/ { text: "Lo guardé como un **mapa privado en Builder**: los vehículos (azul en marcha, rojo estacionados), los cinco hubs más el sexto sitio propuesto, y la distancia al hub más cercano. Si no apareció arriba, ábrelo desde el enlace: `https://<your-carto-workspace>/builder/<mapId>`. Compártelo desde ahí cuando estés listo.\n" +
        "\n" +
        "El siguiente paso es agregar las áreas de tiempo de manejo: las guardaría en una tabla con `execute_query` y apuntaría el mapa a esa tabla." },
      /*8 endcard*/ { lines: ["Geotab MCP + CARTO MCP", "Seis preguntas en lenguaje natural. El asistente escribió el SQL."] },
    ],
    choices: [
      { label: "🧐 ¿Qué debería verificar?",
        say: "¿Qué debería verificar antes de actuar con esto?" },
      { label: "⚡ Probar otro",
        say: "Muéstrame otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  "carto-caveats": {
    h: "7e1f056e",
    events: [
      /*0 assistant*/ { text: "Algunas cosas, antes de que alguien actúe con esto:\n" +
        "- **Los hubs son inferidos** a partir de una sola instantánea nocturna, no de tu lista de bases.\n" +
        "- **El sexto hub es un candidato derivado del mapa, no una ubicación verificada.** La zonificación, los patios disponibles y la renta todavía hay que revisarlos.\n" +
        "- **Solo la celda ganadora pasó por una revisión de tiempo de manejo.** Las otras cuatro son celdas vecinas con casi el mismo puntaje, así que trátalo como una zona, no como una dirección.\n" +
        "- **La cobertura cuenta residentes, no clientes.** Si tienes ubicaciones de pedidos o de clientes, usa esas.\n" +
        "- **La cobertura se cuenta por el centro del hexágono.** Un hexágono cuenta como cubierto si su centro está dentro de un área de manejo, así que los bordes son aproximados.\n" +
        "- **Los tiempos de manejo suponen un auto, 15 minutos y una sola hora del día.** El tráfico cambia según la hora, así que vuelve a correrlo para tu hora de más actividad." },
    ],
    choices: [
      { label: "🗺️ Ponerlo en un mapa que pueda compartir",
        say: "Ponlo en un mapa que pueda compartir." },
      { label: "⚡ Probar otro",
        say: "Muéstrame otra cosa." },
      { label: "↻ Reiniciar" },
    ],
  },
  },
};
