/*
 * Spanish (Spain, es-ES) layer over es-419.js.
 *
 * Loaded after es-419.js and merged slot by slot: a field here replaces the
 * es-419 field, anything absent falls through to es-419 (then English). It
 * only holds wording that differs in Spain — informe, conducir, furgoneta,
 * avería, matrícula, aparcar, coste, añadir, vídeo… — plus Spanish number
 * formatting (4.912, 18,2). Generated from es-419 and then reviewed; when an
 * es-419 node changes, revisit its entry here too, then run
 * `node scripts/check-graph.js --stamp-i18n`.
 */
window.SIM_I18N = window.SIM_I18N || {};
window.SIM_I18N["es-ES"] = {
  ui: {
    "landing.title": "Ya usas Geotab. Ahora hazle preguntas en lugar de preparar informes.",
    "landing.b1": "<strong><span class=\"bullet-glyph\" aria-hidden=\"true\">ASK</span>Preguntas sobre tu flota en lenguaje natural.</strong> Revisiones semanales, triaje de averías, \"quién está más cerca y libre ahora mismo\": respondido con datos en vivo, no con una exportación estática.",
    "landing.b3": "<strong><span class=\"bullet-glyph\" aria-hidden=\"true\">DEMO</span>Prueba esta versión sin riesgo.</strong> Todo lo que sigue se ejecuta sobre una flota demo anonimizada de Geotab: sin cuenta real, sin configuración y sin riesgo para los datos de producción.",
    "landing.foot": "¿Ya te sientes cómodo con MCP? Entra directamente abajo.",
    "settings.playbackBody": "Elige a qué velocidad se reproduce la transcripción MCP pregrabada.",
    "game.offCopy": "Simulador simple: sin puntuaciones ni marcas de verificación.",
    "about.videoTitle": "Vídeo demo del conector MCP de Geotab",
    "about.video": "🎥 Mira cómo el conector MCP oficial de Geotab permite que los asistentes de IA investiguen problemas de la flota, automaticen alertas y coordinen acciones entre herramientas como Gmail y calendarios (vídeo en inglés): <a href=\"https://youtube.com/watch?v=7uMXqWfxlC0\" target=\"_blank\" rel=\"noopener\">abrir en YouTube</a>.",
    "about.learn": "Más información sobre el conector real en la página del <a href=\"https://www.geotab.com/geotab-mcp-connector/\" target=\"_blank\" rel=\"noopener\">Conector MCP de Geotab</a>.",
    "about.bug": "¿Has encontrado un error o quieres ver otro escenario? Abre un <a href=\"https://github.com/fhoffa/geotab-mcp-simulator/issues\" target=\"_blank\" rel=\"noopener\">issue en GitHub</a>.",
    "real.s2": "<strong>Conecta el conector MCP de Geotab a tu asistente preferido.</strong> Geotab publica un servidor MCP (Model Context Protocol) oficial. La forma más rápida: está listado en los directorios de Claude y ChatGPT, y vienen más. Microsoft Copilot y cualquier otro cliente compatible con MCP pueden añadir el mismo servidor por su URL.",
    "real.optAChatgpt": "<strong>ChatGPT:</strong> abre <strong>Plugins</strong>, busca \"Geotab\", elige <strong>MyGeotab MCP</strong> y pulsa <strong>Install plugin</strong>. <a href=\"https://www.linkedin.com/feed/update/urn:li:activity:7508970838931435520/\" target=\"_blank\" rel=\"noopener\">Mira el recorrido</a> (todo desde un móvil).",
    "real.optB5": "De vuelta en el cliente, el conector ahora aparece como <strong>Connected</strong>. Actívalo para un chat desde el selector de herramientas/conectores (el icono de conector debajo del cuadro de mensaje) y pregúntale cualquier cosa que hayas probado en este simulador.",
    "real.setupFoot": "Microsoft Copilot y otros clientes compatibles con MCP siguen el mismo patrón: añade un conector MCP personalizado/remoto, apúntalo a <code>https://mcp.geotab.com/mygeotab</code> e inicia sesión con tus credenciales de MyGeotab cuando te lo pida.",
    "real.piiFoot": "Esto no es asesoramiento jurídico: consulta con tu propio equipo legal o de cumplimiento antes de conectar datos de producción.",
    "media.fallback": "No se encontró el clip: consulta media/README.md para generarlo y añadirlo.",
    "progress.full": "🏆 Flota completa de 50 vehículos desbloqueada. ¿Listo para conducir una de verdad? Usa \"Conectar cuenta real\" arriba.",
  },
  nodes: {
  "connect": {
    h: "f2f47efa",
    events: [
      { text: "Hola, soy un asistente. Cuando conectes el conector MCP de Geotab, podré leer datos en vivo de tu flota y realizar acciones sobre ella, aquí mismo en el chat, sin un panel aparte.\n\n(Vale la pena saberlo: MCP es el *Protocolo de Contexto de Modelo* (Model Context Protocol), un estándar abierto para conectar asistentes de IA con herramientas, y el conector es simplemente un servidor MCP abierto. Copilot, ChatGPT, Claude: cualquier cliente que hable MCP puede conectarse al mismo. Ningún asistente es especial aquí: Claude y ChatGPT ya lo incluyen en sus directorios, y cualquier otro cliente puede añadirlo por URL.)\n\nUn detalle práctico: el servidor MCP no conoce ni enumera automáticamente todas las bases de datos a las que tu cuenta tiene acceso. Necesitas saber el nombre de la base de datos que quieres y pedirle al asistente que la use.\n\nEsta página en particular es un simulador, así que harás clic en preguntas sugeridas en lugar de escribir, y las respuestas están pregrabadas, pero los números detrás de todo vienen de flotas demo reales de Geotab. Conéctalo y te muestro." },
    ],
    choices: [
      null,
      { label: "🎥 Ver primero el vídeo demo de 2 minutos" },
    ],
  },
  "hub": {
    h: "11611b5a",
    choices: [
      { say: "Dame mi revisión semanal de la flota de los últimos 7 días: averías, ralentí y conducción brusca, infracciones de HOS, pendientes de DVIR y actividad de viajes. Que sea un resumen corto sobre el que pueda actuar." },
      null,
      null,
      { say: "¿Por dónde pierde dinero mi flota? Suma los ahorros recuperables y prepara el caso de ROI." },
      { label: "🚦 ¿Quiénes son mis conductores con más riesgo?", say: "¿Quiénes son mis diez conductores con más riesgo esta semana y cuáles fueron sus principales eventos?" },
      null,
      null,
      null,
      null,
      null,
      { say: "Tengo un montón de averías en la flota de España. ¿Están en todas partes o en unos pocos vehículos? Dame una lista de trabajo priorizada para el taller." },
      null,
      { label: "⚠️ Códigos de avería + gravedad (últimos 7 días)", say: "Muéstrame los códigos de avería registrados en los últimos siete días y su gravedad." },
      null,
      { say: "Demo - 08 sigue apareciendo en la lista de averías. ¿Por qué? Investígalo y no te quedes con la primera explicación." },
      { label: "📧 Avería → correo al taller → programar servicio", say: "Una de nuestras furgonetas acaba de registrar una avería. Obtén los detalles, redacta un correo al taller pidiéndoles que la revisen y pon una cita provisional de taller en mi calendario para mañana por la mañana." },
      null,
      null,
      null,
      null,
      null,
      null,
      { say: "Empaqueta mi revisión semanal de la flota en una skill reutilizable para que yo, y cualquiera de mi equipo, pueda ejecutar exactamente la misma revisión con solo pedirla." },
      { say: "Tengo varias tareas de la flota pendientes: crear una geocerca para el depósito, una alerta de ralentí, borrar las averías de una furgoneta que ya pasó por servicio, agrupar mis vehículos de Valencia y enviar las alertas a un responsable." },
      { label: "🧑‍🏫 Redactar notas de coaching para un responsable", say: "Identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su responsable." },
      null,
      null,
      null,
      null,
      { label: "📊 Dame un resumen para la dirección, ambas flotas", say: "Dame un resumen a nivel de dirección de ambas flotas (utilización, seguridad, mantenimiento y sostenibilidad) en cinco números." },
    ],
  },
  "ep1-answer": {
    h: "82b6fe8a",
    events: [
      { text: "Déjame preparar esto, empezando por cuántos vehículos están enviando datos realmente." },
      null,
      { text: "50, todos enviando datos. Ahora la pregunta que de verdad importa: ¿hay averías activas esta semana?" },
      { summary: "0 averías activas" },
      null,
      null,
      null,
      null,
      { text: "Bien, esta es tu semana en demo_fh_vegas4.\n\nPrimero lo bueno: 50 vehículos, todos enviando datos, cero averías activas. Una semana realmente limpia en mantenimiento.\n\nLo que hay que revisar es el exceso de velocidad, y no es un conductor: es toda la flota. Los eventos por exceder el límite señalizado están repartidos entre muchos vehículos, con los peores muy parejos y ninguna furgoneta despegándose del resto. Eso cambia la solución: no es una conversación con una persona, es un tema de política, más una alerta en vivo para detectarlo en el momento y no el lunes siguiente.\n\nDos salvedades para que no lo sobreinterpretes: HOS es solo por conductor (la API no devuelve infracciones sin nombrar a alguien), así que lo que hice fue una revisión por muestreo, no un visto bueno de toda la flota. Y DVIR no tiene nada registrado esta semana, lo que interpreto como \"nada que informar\" y no como \"nadie las está llenando\", pero vale la pena confirmarlo de tu lado.\n\n(No incluí el recuento de viajes: el contador histórico total no es un número semanal con sentido, así que lo dejé fuera en lugar de informar de algo engañoso.)\n\nEsta es la versión de un resumen que antes implicaba sacar cuatro informes y cruzarlos a mano: probablemente 30–45 minutos un lunes. Esto fue una sola petición.\n\nUna cosa antes de archivarlo: ese es *mi* formato por defecto, varios párrafos de prosa. Si esto se va a convertir en tu ritual de los lunes, dilo ahora. ¿Demasiado largo? ¿Orden equivocado? ¿Lo quieres visual? Lo que acordemos entre los dos es lo que después podemos congelar en una skill para todo tu equipo." },
    ],
  },
  "ep1-shape-viz": {
    h: "4dc2c555",
    events: [
      null,
      null,
      null,
      { text: "Ahí está la imagen, y fíjate que sostiene el argumento que hacía el párrafo. Un solo vehículo malo se vería como una barra larga y luego un precipicio; esto es una meseta, cinco vehículos a unos 20 eventos entre sí. \"Problema de toda la flota, se arregla con política\": ahora de un vistazo en lugar de en una oración.\n\n(Yo no graficaría el lado de mantenimiento esta semana: todas las barras serían cero. Cuando un gráfico no tiene nada que decir, la frase \"cero averías activas\" lo dice mejor.)\n\nSigamos dándole forma: ¿y el texto alrededor? ¿Las mismas seis secciones o algo más compacto?" },
    ],
    choices: [
      { say: "Más compacto. Titular arriba, luego el gráfico y luego tres viñetas como máximo. Y se lo reenvío a mi responsable de operaciones, así que mantenlo simple y sin nombres de conductores." },
    ],
  },
  "ep1-shape-brief": {
    h: "e33b5e6b",
    events: [
      null,
      null,
      { text: "- Los 50 vehículos enviando datos, **cero averías activas**: una semana de mantenimiento realmente limpia.\n- **El exceso de velocidad es de toda la flota**: los cinco principales están entre 118 y 142 eventos, nadie se despega. La solución es una política más una alerta en vivo, no una sola conversación.\n- **HOS limpio en la revisión por muestreo; DVIR sin registros**: HOS es solo por conductor, así que confirma que los equipos están llenando las inspecciones en vez de suponerlo.\n\nEso es todo: se puede reenviar tal cual, habla de vehículos y no de personas, y el gráfico hace el argumento.\n\nVale la pena notar lo que acaba de pasar: este formato no salió de mí, salió de la conversación. Dijiste que el tú del lunes no lee párrafos, así que el gráfico va primero. Dijiste que se reenvía, así que es simple y no nombra conductores. Eso es exactamente lo que hace que valga la pena congelarlo: ¿quieres que empaquete *esto*, con el formato y todas las trampas de datos que tuve que esquivar, en una skill que cualquiera de tu equipo pueda ejecutar?" },
    ],
  },
  "ep1-skill-first": {
    h: "ee199f9f",
    events: [
      { text: "Con gusto, pero no quiero empaquetar una suposición. Una skill es tan buena como la conversación de la que se congela, así que este es el plan: ejecuto tu revisión una vez, tú me dices qué está mal (demasiado larga, formato equivocado, cosas que faltan) y lo que acordemos es lo que guardo. Ejecutándola ahora." },
    ],
  },
  "ep1-skill": {
    h: "7840c88e",
    events: [
      null,
      { text: "La empaqueté como geotab-weekly-review; abre la tarjeta de arriba si quieres ver qué contiene. Cada línea se remonta a algo que pasó en esta conversación:\n\n- El **formato con el gráfico primero** está ahí porque dijiste que el tú del lunes no lee párrafos.\n- El **límite de tres viñetas** y la **regla de no nombrar conductores** están ahí porque dijiste que el resumen se reenvía.\n- La regla **\"agrega toda la ventana, nunca hagas un ranking a partir de una lista limitada\"** está ahí porque la consulta en bruto habría contado la historia equivocada antes de que Ace la corrigiera.\n- Además de las trampas que nunca me viste esquivar: el contador de Trip que ignora las fechas, y que HOS es solo por conductor.\n\nPonla en las skills compartidas de tu equipo y cualquiera podrá decir \"ejecuta mi revisión semanal\" y obtener exactamente el resumen que definimos: la versión cuidadosa cada vez, sin volver a discutir todo esto.\n\nEse es el patrón que vale la pena copiar de toda esta demo: **primero conversaciones, después skills.** No escribas una skill desde una página en blanco: haz la revisión a mano, discútela como acabas de hacerlo y luego congela lo que acuerden. La de arriba queda pública en este proyecto como ejemplo práctico — [skills/geotab-weekly-review/SKILL.md](https://github.com/fhoffa/geotab-mcp-simulator/blob/main/skills/geotab-weekly-review/SKILL.md) — no como algo para instalar tal cual, porque las reglas que le dan valor a una skill salen de las conversaciones de *tu* flota. (Para skills compartidas listas para usar, como la del data warehouse en MotherDuck que usa la ruta de warehouse de este simulador, consulta la guía complementaria [geotab-vibe-guide](https://github.com/fhoffa/geotab-vibe-guide).)" },
    ],
  },
  "ep-safety-skill": {
    h: "90a6d735",
    events: [
      null,
      { text: "La empaqueté como fleet-safety-scorecard; abre la tarjeta para ver qué contiene. No es solo una tabla de posiciones más rápida: codifica el criterio, que la puntuación está ponderada para que la gravedad pese más que el volumen, que un grupo compacto significa una solución de política y no diez conversaciones, y que un pico en una sola esquina es un problema de ruta. Además del criterio de no incluir PII por defecto, para que quien la ejecute obtenga la versión cuidadosa.\n\nPonla en las skills compartidas de tu equipo y cualquiera podrá decir \"ejecuta el scorecard de seguridad\" y obtener esta misma lectura." },
    ],
    choices: [
      { label: "🚦 Ejecutar el scorecard ahora", say: "¿Quiénes son mis diez conductores con más riesgo esta semana y cuáles fueron sus principales eventos?" },
      { say: "Identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su responsable." },
    ],
  },
  "ep-maint-skill": {
    h: "cf9990e1",
    events: [
      null,
      { text: "La empaqueté como maintenance-triage; abre la tarjeta para leerla. Lleva el criterio que la hace útil: ordenar por consecuencia, para que una ITV legal pase por delante de un cambio de aceite más grande; leer la gravedad en el testigo del cuadro de instrumentos y no en el recuento bruto; y reconocer que 580 averías del dispositivo suelen ser un solo trabajo de cableado, no 580 problemas.\n\nPonla en tus skills compartidas y cualquiera podrá decir \"prioriza la flota\" y obtener la misma lista de trabajo priorizada." },
    ],
    choices: [
      { label: "🔧 Ejecutar la priorización ahora", say: "Tengo un montón de averías en la flota de España. ¿Están en todas partes o en unos pocos vehículos? Dame una lista de trabajo priorizada para el taller." },
    ],
  },
  "ep-roi-skill": {
    h: "7e694a0b",
    events: [
      { summary: "SKILL.md escrito: modelo de palancas conservador, salvedades honestas, sin doble recuento" },
    ],
    choices: [
      null,
      { label: "💰 Volver a ejecutar el desglose completo de ROI", say: "¿Por dónde pierde dinero mi flota? Suma los ahorros recuperables y prepara el caso de ROI." },
    ],
  },
  "ep2-answer": {
    h: "1d4697dd",
    events: [
      null,
      { summary: "las 200 más recientes de ~5.645 filas → falsa impresión de 'un caso atípico'" },
      { text: "En la consulta en bruto, Demo - 01 y Demo - 02 van muy por delante. Pero eso son solo los 200 eventos más recientes de unos 5.645 esta semana, aproximadamente el 3,5% de los datos. Antes de señalar a una furgoneta, voy a pedirle a Ace que agregue toda la semana en toda la flota en lugar de solo la página más reciente." },
      { summary: "agregado de toda la flota → los 5 principales agrupados entre 118–142, ninguna furgoneta se despega" },
      { text: "Esto es lo que realmente pasó. Una consulta rápida en bruto solo devuelve los ~200 eventos más recientes, y resulta que esos se concentran en un par de furgonetas, lo que hace parecer que Demo - 01 es el problema.\n\nNo lo es: eso es un artefacto de paginación, no una respuesta. Esas 200 filas son alrededor del 3,5% de los 5.645 eventos de esta semana. Cuando Ace agrega toda la semana en todos los vehículos, Demo - 01 ni siquiera está en primer lugar: es Demo - 16 con 142, luego Demo - 01 con 134, luego 129, 121 y 118. Es una variación real, no un empate, pero nadie se despega como lo haría un verdadero caso atípico (piensa en 2–3 veces el siguiente vehículo, no 1,2 veces).\n\nAsí que no es una furgoneta, es toda la flota. El \"por qué\" no es una persona, es sistémico: rutas compartidas, límites compartidos, expectativas compartidas. Eso requiere otra solución: no una conversación con un conductor, sino un cambio de política más una barrera de control en vivo.\n\n(Para ser justos, recorrer los 5.645 eventos o simplemente contar bien por vehículo también lo habría detectado; simplemente no debí confiar en la primera página.)" },
    ],
    choices: [
      { say: "Configura una alerta por exceder el límite señalizado en toda la flota para que los eventos se marquen en vivo de ahora en adelante, y envíala a un responsable de flota." },
    ],
  },
  "ep2-action": {
    h: "a8691fcb",
    events: [
      null,
      null,
      { text: "La regla está activa. Ahora envío la alerta a tu responsable de flota." },
      { summary: "Alerta enviada a 1 responsable" },
      { text: "Listo: la regla de límite señalizado para toda la flota está activa y la alerta va a un responsable de flota (por nombre, sin mostrar el correo). Cualquier vehículo que supere el límite señalizado se marca en el momento, no cuando ejecutes la revisión de la próxima semana." },
      { changes: ["Regla \"Posted Speed — fleet-wide\" creada y activa en demo_fh_vegas4", "Notificación enviada a 1 responsable de flota"] },
    ],
    choices: [
      { label: "🔧 Ahora revisa también las averías" },
    ],
  },
  "ep3-answer": {
    h: "3297a318",
    events: [
      null,
      null,
      { text: "En realidad es más enredado de lo que esperaba: 278 cámaras ya activas, una multa legal de €200 sobre el papel, pero la ordenanza fue rechazada en diciembre, así que por ahora se está monitorizando, no multando. Voy a revisar si alguno de tus vehículos siquiera anda por esa zona antes de preocuparnos." },
      { summary: "posiciones en vivo: Demo-23 y Demo-31 dentro del área de Valencia (~39,4°N)" },
      { text: "Qué bueno que revisé las noticias de hoy en lugar de quedarme con lo que ya sabía: la zona de bajas emisiones de Valencia está realmente en cambio ahora mismo. Cubre unos 27,8 km², la mayor parte de la ciudad, y ya hay 278 cámaras ANPR encendidas. La multa legal por una entrada no permitida es de €200, pero la ordenanza de la ciudad fue rechazada en diciembre, así que por ahora las cámaras están monitorizando, no multando, y ni siquiera las fuentes que encontré coinciden en si ya empezaron las sanciones. Se supone que las restricciones entran en vigor gradualmente entre 2026 y 2028, favoreciendo las etiquetas más limpias a medida que se endurecen.\n\nY sí, esto te afecta: Demo - 23 y Demo - 31 están operando ahora mismo en el área de Valencia, así que, sean cuales sean las reglas finales, estás expuesto.\n\nUna salvedad: esto cambia de una semana a otra, así que yo lo volvería a confirmar en valencia.es antes de actuar." },
    ],
    choices: [
      { say: "Crea una zona en Geotab que coincida con la ZBE de Valencia y añade una alerta para cuando nuestros vehículos entren en ella." },
    ],
  },
  "ep3-prefs": {
    h: "18da0c75",
    events: [
      { text: "Antes de configurarlo, dos preguntas rápidas para que de verdad se ajuste a tu forma de trabajar:\n\nPrimero, ¿qué debería dispararla: solo las entradas, o también las salidas (útil si quieres confirmar que un vehículo volvió a salir de la zona)?\n\nSegundo, ¿quién debería recibirla: un responsable de flota o todo el grupo de operaciones de Valencia?" },
    ],
    choices: [
      { label: "🔔 Solo entrada → un responsable", say: "Solo alertas de entrada, enviadas a un responsable de flota." },
    ],
  },
  "ep3-action": {
    h: "82c548ba",
    events: [
      null,
      null,
      null,
      null,
      { text: "Y envío la alerta a tu responsable de flota." },
      { summary: "Alerta enviada a 1 responsable" },
      { text: "Listo: la zona ZBE València está creada, la alerta de entrada está activa y va a un responsable. Te enterarás en el momento en que la aplicación de multas realmente se active, y no por una multa en el correo.\n\nSi más adelante quieres afinarla, podrías restringir la alerta solo a las etiquetas no permitidas (las furgonetas más viejas sin distintivo ECO o Cero), pero por ahora es opcional." },
    ],
  },
  "ep3-action-wide": {
    h: "6bb56e25",
    events: [
      null,
      null,
      null,
      null,
      { text: "Y envío la alerta a todo el grupo de operaciones de Valencia, no solo a un responsable." },
    ],
  },
  "ep-zonelife-answer": {
    h: "f088deb0",
    events: [
      null,
      null,
      null,
      { text: "Todavía no hay zonas, ya existen 17 reglas estándar y ninguna personalizada basada en zonas. Voy a crear un par desechable, con nombres que dejen clarísimo que son datos de prueba, verificarlos, luego eliminar ambos y confirmar que los recuentos vuelvan a 0 y 17." },
    ],
  },
  "ep-zonelife-create": {
    h: "04de46c3",
    events: [
      null,
      null,
      { text: "La zona está lista; verifico que realmente se pueda recuperar antes de construir sobre ella, y luego añado la regla vinculada." },
      null,
      { text: "El primer intento rebotó: `Undefined or empty ExceptionRule.Groups`. El esquema indica que `groups` es opcional, pero la API en vivo no está de acuerdo: todas las reglas reales de esta base de datos llevan `groups: [{ id: \"GroupCompanyId\" }]`, así que lo añado y vuelvo a intentar en lugar de seguir adivinando." },
    ],
  },
  "ep-zonelife-delete": {
    h: "9d532755",
    events: [
      null,
      null,
      null,
      { text: "Ambas llamadas volvieron sin errores. Confirmo que realmente desaparecieron en lugar de confiar en una respuesta de éxito: reviso `Get` por id, no solo `activeTo`." },
      null,
      null,
      null,
      null,
      { text: "Confirmado: `Remove` realmente elimina en esta API; el `Get` de seguimiento volvió vacío, no un registro con `activeTo` en una fecha pasada. Eso importa, porque `activeFrom`/`activeTo` existen en ambas entidades para programación y fácilmente podrían confundirse con el mecanismo de eliminación; no lo son. Los recuentos volvieron a la línea base (0 zonas, 17 reglas), así que no queda nada de la prueba." },
      { changes: ["Regla eliminada y confirmada como desaparecida (Get devuelve vacío, no un registro retirado)", "Zona eliminada y confirmada como desaparecida (Get devuelve vacío, no un registro retirado)", "Recuentos de zonas y reglas de vuelta en la línea base (0 zonas / 17 reglas)"] },
    ],
  },
  "ep-zonelife-safety": {
    h: "10ac31ab",
    events: [
      null,
      null,
      null,
      { text: "Entonces: sí. Editar o eliminar una regla invalida su historial de `ExceptionEvent` asociado; es el comportamiento esperado dado cómo funcionan las reglas, no un fallo. Lo que vale la pena hacer con cuidado es que esto no es un evento aparte en el registro de auditoría: el registro guarda el cambio de la regla en sí, no un inventario de lo que se invalidó debajo, así que no hay nada integrado que te diga después cuánto historial borró realmente un cambio.\n\nMyGeotab muestra una ventana de advertencia antes de una eliminación así: justo el tipo de momento en que una persona debería detenerse. Las llamadas a `Remove` que hice antes en esta prueba pasaron directamente, sin preguntar, porque esa regla de prueba era nueva y no tenía excepciones asociadas, así que no había nada en juego. Pero la regla estándar real \"Speeding\" de esta misma base de datos tiene **518** eventos de excepción históricos. Cualquiera que llame a `Remove` sobre una regla así a través de este conector debería saber de antemano que tiene el mismo peso que la eliminación nativa; la capa MCP simplemente no se detiene a preguntar.\n\nUn hábito práctico para incorporar en cualquier automatización real: antes de llamar a `Remove` sobre una `Rule` real, revisa primero `GetCountOf(ExceptionEvent, search:{ruleSearch:{id:...}})`. `ExceptionEvent` solo lleva un id de regla, no un id de zona, así que no hay un filtro directo para una `Zone`: primero encuentra la(s) regla(s) que la referencian (`Get(Rule)`, comparando `condition.zone.id`) y luego ejecuta el mismo recuento para cada una. Muéstrale a una persona lo que encuentres y obtén su aprobación explícita si no es cero. No confíes en que la herramienta MCP te detenga: no lo hará." },
    ],
  },
  "ep-zonelife-skill": {
    h: "ca61ff48",
    events: [
      null,
      { summary: "SKILL.md escrito: verificación de ExceptionEvent antes de eliminar, aprobación humana ante cualquier recuento distinto de cero" },
    ],
  },
  "ep-zonelife-cascade": {
    h: "d81850a7",
    events: [
      null,
      null,
      null,
      null,
      null,
      null,
      { text: "No hubo error de integridad referencial y la regla no quedó huérfana: se eliminó en cascada junto con la zona de la que dependía. El recuento de reglas volvió directamente a la línea base de 17 sin que yo llamara nunca a `Remove(Rule)` directamente sobre ella.\n\nEs útil saberlo, pero yo igual no escribiría scripts que dependan de esto: un comportamiento en cascada así no está documentado, y no hay garantía de que todas las combinaciones de `baseType`/`conditionType` de una regla se comporten igual. En todo lo que automatices, elimina explícitamente la regla antes que la zona: es la suposición que sigue siendo correcta aunque esta cascada en particular no lo sea." },
      { changes: ["Confirmado: eliminar una zona referenciada no da error, aun con una regla dependiente asociada", "La regla dependiente ZoneStop se eliminó en cascada junto con su zona (Get y el recuento lo confirman)", "Recuentos de vuelta en la línea base después de ambos órdenes: sin huérfanos en ninguna prueba"] },
    ],
  },
  "ep4-answer": {
    h: "48953206",
    events: [
      null,
      null,
      null,
      null,
      { text: "Activa: cualquier vehículo en ralentí por más de 15 minutos se marca. Ahora borro las averías reconocidas de Demo - 06 tras su servicio." },
      { summary: "Averías reconocidas descartadas" },
      null,
      null,
      { text: "Creado. La última: enviar las alertas de ralentí a un responsable." },
      { summary: "Alertas de ralentí enviadas a 1 responsable" },
      { text: "Las cinco listas. Un resumen para que quede registrado: una geocerca de 300 m alrededor del depósito principal, una alerta de ralentí después de 15 minutos, las averías reconocidas de Demo - 06 borradas tras el servicio, tus vehículos de Valencia agrupados en una sola unidad para informes y las alertas de ralentí enviadas a un responsable.\n\nNo queda nada por configurar a mano: todo está activo ya." },
      { lines: ["Conector MCP de Geotab", "No solo informa. Actúa."] },
    ],
    choices: [
      { label: "🔧 Ahora prioriza las averías" },
    ],
  },
  "ep5-answer": {
    h: "f3c33815",
    events: [
      null,
      { text: "Primero voy a sacar la avería de Demo - 06 para saber con qué estamos tratando realmente." },
      null,
      { text: "Dispositivo desconectado más una avería de antena GPS: dejará de enviar su posición hasta que alguien lo revise. Voy a obtener la marca, el modelo y la matrícula para que el taller sepa qué le va a llegar." },
      { summary: "Demo - 06: Mercedes-Benz Sprinter, matrícula VAL-4471-B" },
      { text: "Mercedes-Benz Sprinter, matrícula VAL-4471-B. Redactando ahora el correo al taller; lo dejo en Borradores, no lo envío sin que lo revises primero." },
      null,
      { text: "Guardado, no enviado. Ya que estoy aquí, también voy a reservar una cita provisional de taller para que no pierdas la ventana de reserva mientras esperas responder." },
      { summary: "Cita provisional de taller: mañana 09:00" },
      { text: "Bien, así quedó todo entre tres herramientas. Demo - 06 registró una avería de dispositivo desconectado / antena GPS el día 18: es una Mercedes-Benz Sprinter, matrícula VAL-4471-B, y dejará de enviar su posición hasta que la revisen. Redacté un correo al taller con los datos del vehículo y de la avería, pero lo dejé en Borradores: no sale hasta que lo revises. Y puse una cita provisional en el calendario para mañana a las 09:00, para que no pierdas la ventana de reserva mientras tanto.\n\nEl borrador está ahí para cuando estés listo.\n\n(Esta demo apunta a un buzón y un calendario de prueba, nunca a un destinatario real.)" },
    ],
  },
  "ep5-send": {
    h: "87ec946b",
    events: [
      null,
      { text: "Enviado. El taller ya tiene los detalles de la avería y la matrícula, y el horario de las 09:00 ya está en el calendario esperando su confirmación." },
    ],
    choices: [
      { label: "🚐 ¿Qué tipo de furgoneta es Demo - 06?" },
    ],
  },
  "ep5-hold": {
    h: "711c68c4",
    choices: [
      { label: "🚐 ¿Qué tipo de furgoneta es Demo - 06?" },
    ],
  },
  "ep13-close": {
    h: "2d0a417b",
    events: [
      null,
      null,
      null,
      null,
      null,
      { lines: ["Conector MCP de Geotab", "La verdad de tu flota, directamente en el CRM."] },
    ],
  },
  "ep13-leaveopen": {
    h: "1c1a1758",
    events: [
      null,
      { lines: ["Conector MCP de Geotab", "La verdad de tu flota, directamente en el CRM."] },
    ],
  },
  "ep7-ace": {
    h: "27f90de4",
    events: [
      null,
      { text: "Ese es Geotab Ace haciendo lo suyo: pregunté en lenguaje natural, sin SQL, y escribió la consulta por su cuenta, la ejecutó en toda la flota y devolvió una respuesta en ranking, más un gráfico y su razonamiento.\n\nPero fíjate en la forma: Demo - 08 se despega con 188, aproximadamente 3 veces el siguiente vehículo, y todos los demás van bajando normalmente después. Es la misma furgoneta que ya apareció dos veces en esta revisión por averías. Yo hablaría un momento con ese conductor antes de que se convierta en un tercer problema, aparentemente sin relación." },
    ],
    choices: [
      null,
      { say: "Configura una alerta por exceder el límite señalizado en toda la flota y envíala a un responsable de flota." },
    ],
  },
  "ep7-reasoning": {
    h: "3b1485a0",
    events: [
      { text: "Ace muestra su trabajo, no solo la respuesta. Esto es lo que devolvió: entendió que querías los cinco vehículos con más eventos de exceso de velocidad en los últimos 7 días, con un recuento para cada uno. Para llegar ahí, recorrió los datos de eventos de la flota en ese periodo, aisló los eventos de exceso de velocidad por vehículo, los contó, los ordenó y devolvió los cinco principales: Demo - 08 con 188, luego 15, 01, 16 y 04, bajando hasta 39.\n\nEs útil tener ese rastro por si algún número no cuadra y quieres saber exactamente qué contó." },
    ],
    choices: [
      { label: "🔧 Ahora pregúntale a Ace por las averías", say: "Ahora pregúntale a Ace qué vehículos tienen más averías esta semana." },
      { label: "📋 Ejecutar la revisión semanal completa" },
    ],
  },
  "ep8-maintenance": {
    h: "13e8eb8e",
    events: [
      { text: "Primero voy a contar los registros de averías de esta semana." },
      { summary: "599 registros de averías esta semana" },
      null,
      null,
      { text: "599 registros de averías esta semana suena a un incendio que apagar en todas partes. En realidad no lo es.\n\nCuando Ace lo desglosa por vehículo, una furgoneta concentra la mayoría: Demo - 08 registró 112 averías, aproximadamente 1 de cada 5 del total de la flota. Todo lo demás está en un solo dígito, de 4 a 7 cada uno.\n\nAsí que tu lista de trabajo prácticamente se hace sola: lleva primero a Demo - 08; no son 50 problemas, es básicamente uno. Los otros cuatro pueden esperar. Y como contexto, la flota de Las Vegas tuvo cero averías activas esta semana, así que esto realmente es específico de esta furgoneta y no algo sistémico." },
      { title: "Top 5 vehículos por registros de averías · últimos 7 días (vía Ace)" },
    ],
    choices: [
      { say: "Convierte esta priorización de mantenimiento en una skill reutilizable que todo mi taller pueda ejecutar cada semana." },
      null,
      null,
      { label: "📧 Programarlo en el taller ahora", say: "Obtén los detalles de la avería de Demo - 08, redacta un correo al taller y pon una cita provisional de taller en mi calendario para mañana por la mañana." },
    ],
  },
  "ep9-fleet-08": {
    h: "00e026f9",
    events: [
      null,
      null,
      null,
      { text: "Demo - 08 es una Mercedes-Benz Sprinter 907, una de tus 5 furgonetas ligeras, de Demo - 06 a Demo - 10." },
    ],
    choices: [
      null,
      { label: "📧 Programarlo en el taller ahora", say: "Obtén los detalles de la avería de Demo - 08, redacta un correo al taller y pon una cita provisional de taller en mi calendario para mañana por la mañana." },
    ],
  },
  "ep9-fleet-06": {
    h: "fcef7cbf",
    events: [
      null,
      null,
      null,
      { text: "Demo - 06 es una Mercedes-Benz Sprinter 907, una de tus 5 furgonetas ligeras." },
    ],
  },
  "ep9-fleet-23-31": {
    h: "c7653ad2",
    events: [
      null,
      null,
      null,
      { text: "Distintos tipos de vehículo, misma zona: Demo - 23 es una cabeza tractora Renault T (Euro 6) y Demo - 31 es un autobús MAN Lion's Intercity; uno transporta carga y el otro cubre una ruta de pasajeros, y ambos están dentro de la ZBE ahora mismo." },
    ],
  },
  "ep9-fleet-01-vegas": {
    h: "ae5a3d57",
    events: [
      null,
      null,
      null,
      { text: "Demo - 01 es una Ford Transit 250 de carga, una de 35 en esta flota; las otras 15 son pick-ups F-150 para los servicios más pesados." },
    ],
  },
  "ep9-fleet-vegas": {
    h: "07b77288",
    events: [
      null,
      null,
      { text: "Las Vegas es una flota de servicio en campo: 35 furgonetas de carga Ford Transit 250 que hacen la mayor parte del trabajo de despacho en el centro, y 15 pick-ups Ford F-150 para los servicios más pesados." },
    ],
    choices: [
      { say: "Trayectos urbanos cortos y de vuelta al depósito por la noche: ¿Las Vegas es buena candidata para pasar a eléctricos?" },
    ],
  },
  "ep9-fleet-hub": {
    h: "995935ac",
    events: [
      null,
      null,
      null,
      null,
      { text: "Listo, decodificado. Es una operación de transporte de pasajeros, no una flota de reparto: 30 autobuses interurbanos (25 MAN Lion's Intercity más 5 Mercedes-Benz Intouro), 15 unidades de carga pesada (10 Mercedes Actros y 5 cabezas tractoras Renault T, Euro 6) y solo 5 furgonetas ligeras: Mercedes-Benz Sprinter, de Demo - 06 a Demo - 10, que incluye tu foco de averías Demo - 08.\n\nSobre los eléctricos: las 5 Sprinter son las candidatas realistas a corto plazo, ligeras, urbanas y con rutas predecibles. Los autobuses y las cabezas tractoras de 40 toneladas todavía están lejos de ser viables." },
      { lines: ["Conector MCP de Geotab", "Sabe lo que realmente gestionas, no solo cuántos."] },
    ],
    choices: [
      null,
      null,
      { label: "🔋 Preparar el caso detallado de eléctricos", say: "Prepara el caso detallado para pasar las Sprinter a eléctricas: ¿qué se necesitaría?" },
    ],
  },
  "ep9-fleet": {
    h: "966dc41f",
    events: [
      null,
      null,
      null,
      null,
      { text: "Listo, decodificado. Es una operación de transporte de pasajeros, no una flota de reparto: 30 autobuses interurbanos (25 MAN Lion's Intercity más 5 Mercedes-Benz Intouro), 15 unidades de carga pesada (10 Mercedes Actros y 5 cabezas tractoras Renault T, Euro 6) y solo 5 furgonetas ligeras: Mercedes-Benz Sprinter, de Demo - 06 a Demo - 10, que incluye tu foco de averías Demo - 08." },
      { lines: ["Conector MCP de Geotab", "Sabe lo que realmente gestionas, no solo cuántos."] },
    ],
    choices: [
      null,
      null,
      { say: "Prepara el caso para pasar las Sprinter a eléctricas: ¿qué se necesitaría?" },
    ],
  },
  "ep9-fleet-chart": {
    h: "a31b2885",
    events: [
      { bars: ["MAN Lion's Intercity (autobús)", "Mercedes Actros (camión)", "Renault T (cabeza tractora)", "Mercedes Intouro (autobús)", "Mercedes Sprinter (furgoneta)"] },
      { text: "30 autobuses, 15 unidades de carga pesada, 5 furgonetas ligeras: las Sprinter son realmente el único segmento que vale la pena revisar para pasar a eléctricos." },
    ],
    choices: [
      null,
      { say: "Prepara el caso para pasar las Sprinter a eléctricas: ¿qué se necesitaría?" },
    ],
  },
  "ep9-ev": {
    h: "f970c85e",
    events: [
      null,
      { text: "Las cinco Sprinter promedian unas 62 millas al día, con un viaje más largo de unas 140 millas, y hay un hueco de aproximadamente 9 horas por la noche entre rutas. Eso queda holgadamente dentro de lo que una furgoneta eléctrica mediana puede hacer con una carga, y ese hueco nocturno sirve perfectamente como tiempo de carga.\n\nCompáralo con los autobuses o las cabezas tractoras Actros/Renault: larga distancia, cargas más pesadas, tiempos de vuelta ajustados, nada de lo cual encaja todavía con un perfil eléctrico. Las Sprinter son realmente la única parte de esta flota donde el cambio es una decisión a corto plazo, no un \"algún día\".\n\n(Vale la pena aclararlo: las cifras de kilometraje diario aquí son ilustrativas para la demo, coherentes en dirección con el uso típico de las Sprinter, pero no un total en vivo que yo le citaría a un proveedor.)" },
      { lines: ["Conector MCP de Geotab", "Sabe lo que realmente gestionas, no solo cuántos."] },
    ],
  },
  "ep9-ev-vegas": {
    h: "506ef5bd",
    events: [
      null,
      { text: "Separándolo por tipo de vehículo: las furgonetas Transit promedian ~58 millas al día con un hueco nocturno de ~11 horas, holgadamente dentro del alcance de una furgoneta eléctrica mediana. Las F-150 (muestreadas con Demo - 45) hacen servicios más largos y pesados, ~71 millas al día con un viaje de 130 millas; todavía es viable para una pick-up eléctrica, pero es un caso más ajustado que el de las furgonetas. De cualquier forma, el mayor obstáculo para la conversación sobre eléctricos en esta flota no es el hardware, es el exceso de velocidad: arregla primero el lado del comportamiento y luego el caso de los eléctricos será más fácil de presentar a la dirección.\n\n(Vale la pena aclararlo: las cifras de kilometraje diario aquí son ilustrativas para la demo, coherentes en dirección con el uso de las rutas de Transit/F-150, pero no un total en vivo que yo le citaría a un proveedor.)" },
      { lines: ["Conector MCP de Geotab", "Sabe lo que realmente gestionas, no solo cuántos."] },
    ],
  },
  "ep10-postedspeed": {
    h: "fed5d963",
    events: [
      null,
      { text: "Cuando un conductor disputa una alerta de exceso de velocidad, no deberías tener que discutir de memoria. Saqué el límite de velocidad señalizado a lo largo de la ruta real de Demo - 01 el día 18, tramo por tramo.\n\nLa ruta pasó por límites de 10 hasta 65 mph: los tramos rápidos llegan a 65 (105 km/h), con muchas vías urbanas de 35–45 mph intercaladas. Unos cuantos tramos vuelven sin límite registrado o marcados como estimaciones, así que yo trataría esos puntos específicos como de baja confianza y no como evidencia sólida.\n\nEsa es la diferencia entre \"ibas con exceso de velocidad\" y \"en este tramo de 35 mph a las 00:13 ibas por encima\": una conversación de coaching basada en la vía real, no en una corazonada. También respalda el hallazgo anterior de exceso de velocidad en toda la flota: los límites son reales y verificables, así que la solución realmente es política más alertas en vivo." },
    ],
    choices: [
      { say: "Configura una alerta por exceder el límite señalizado en toda la flota y envíala a un responsable de flota." },
      { label: "📹 Sacar el vídeo de la dashcam de ese momento" },
    ],
  },
  "ep12-investigate": {
    h: "c2d66b30",
    events: [
      { summary: "Demo - 08: 14 averías en 30 días, 9 de ellas con el mismo código" },
      { text: "Antes de sacar conclusiones, voy a revisar si es solo exposición: una furgoneta que pasa más tiempo en la calle naturalmente acumula más averías. Comparando su kilometraje con el promedio de la flota." },
      { summary: "Demo - 08: 2.140 mi en 30 días vs. promedio de la flota de 5.800 mi" },
      { text: "Lo contrario de lo que esperaba: Demo - 08 ha recorrido menos de un tercio del promedio de la flota este mes. Menos millas pero más averías descarta la exposición, en todo caso.\n\nSiguiente hipótesis: conducción brusca que provoca falsos positivos en los sensores del motor. Voy a revisar sus eventos de excepción." },
      { summary: "Demo - 08: 3 eventos de frenado brusco en 30 días (promedio de la flota: 2,5)" },
      { text: "Eso tampoco explica nada: está cerca del promedio de la flota, nada apunta a una conducción brusca. Así que tampoco es el comportamiento del conductor.\n\nDe vuelta al desglose de averías: 9 de las 14 son exactamente el mismo código, dispositivo desconectado. Voy a sacar las fechas para ver si se agrupan." },
      null,
      { text: "Ahí está: las 9 averías de \"dispositivo desconectado\" empiezan el 22 de mayo, ninguna antes. Eso no es desgaste aleatorio, es un momento puntual en que algo cambió. Parece un conector de alimentación o un arnés flojo: una desconexión intermitente, no nueve incidentes separados sin relación.\n\nAsí que tomó tres rondas llegar aquí: no es exposición, no es el conductor, es solo un conector desde una fecha. Vale la pena que el taller revise el arnés en lugar de perseguir cada avería por separado." },
    ],
    choices: [
      { label: "📧 Avería → correo al taller → programar servicio", say: "Obtén los detalles de la avería de Demo - 08, redacta un correo al taller sobre el conector de alimentación flojo y pon una cita provisional de taller en mi calendario para mañana por la mañana." },
    ],
  },
  "ep-dispatch": {
    h: "b7504f41",
    events: [
      { summary: "50 posiciones en vivo · 21 en movimiento, 29 aparcados ahora mismo" },
      { text: "Saqué las posiciones en vivo de toda la flota en lugar de adivinar.\n\nDemo - 45 es el más cercano, a aproximadamente 1,0 milla del centro, y está aparcado, así que realmente está libre. Demo - 50 le sigue de cerca a 1,1 millas, también aparcado. Demo - 01 está más cerca que la mayoría, pero ya va circulando a 59 mph, así que el más cercano no es lo mismo que el disponible: queda descartado.\n\nLas posiciones de ambos candidatos tienen segundos de antigüedad (último informe ~20 s antes de esta consulta), así que despacha con la posición en vivo, no con un mapa en caché." },
    ],
  },
  "ep-dispatch-send-45": {
    h: "eb05f1cd",
    events: [
      null,
      { text: "Demo - 45 está despachado: la unidad libre más cercana, a aproximadamente 1,0 milla. Demo - 50 queda disponible como respaldo." },
    ],
  },
  "ep-dispatch-send-50": {
    h: "50cb849c",
    events: [
      null,
      { text: "Demo - 50 está despachado: a 1,1 millas y libre. Queda anotado que Demo - 45 era la opción más cercana si la próxima vez necesitas una hora de llegada más rápida." },
    ],
  },
  "ep-dispatch-map": {
    h: "d6e6a859",
    events: [
      { summary: "Las unidades libres más cercanas están a una o dos manzanas del trabajo en el centro" },
      { text: "Las dos unidades libres están justo alrededor del sitio del trabajo: Demo - 45 un poco más cerca, Demo - 50 a poco más de una manzana. Demo - 01 está más allá y sigue en movimiento, así que no entra en juego." },
    ],
  },
  "ep-exec": {
    h: "537b99f3",
    events: [
      null,
      null,
      null,
      null,
      null,
      null,
      { summary: "4.933 eventos de excepción esta semana" },
      { text: "4.933 en Las Vegas. Y el recuento de España para la misma semana." },
      { summary: "1.347 eventos de excepción esta semana" },
      { text: "Poniendo ambas flotas lado a lado: la utilización en este momento es Las Vegas 21/50 en movimiento (42%) vs. España 10/50 (20%). En seguridad, Las Vegas registró 4.933 excepciones esta semana vs. 1.347 de España, casi 4 veces más, lo que coincide con el patrón de exceso de velocidad en toda la flota que ya se había señalado.\n\nEl mantenimiento va al revés: España registró 599 averías (una furgoneta Sprinter, Demo - 08, concentra 112) vs. cero de Las Vegas. Y en sostenibilidad, ya se decodifican los VIN de ambas flotas: la de España son 30 autobuses, 15 camiones y cabezas tractoras pesados y 5 furgonetas Sprinter candidatas a eléctricas, mientras que Las Vegas son 35 furgonetas de carga Transit y 15 pick-ups F-150 haciendo trayectos urbanos cortos. Sobre el papel, Las Vegas es en realidad el caso más fuerte para eléctricos; lo que la frena para esa conversación es el exceso de velocidad, no el hardware.\n\nDos flotas, dos modos de fallo distintos: el riesgo de Las Vegas es de comportamiento, el de España es mecánico y concentrado. Vale la pena presentarle cada una a la dirección por separado, porque necesitan soluciones distintas." },
    ],
    choices: [
      null,
      null,
      null,
      { say: "Analiza primero España a fondo: ¿qué está pasando con todas esas averías?" },
    ],
  },
  "ep-exec-chart": {
    h: "f78ae2c8",
    events: [
      null,
      { title: "Excepciones (7 d) y averías (7 d) · ambas flotas", bars: ["Exc. Vegas", "Exc. España", "Averías España", "Averías Vegas"] },
      { text: "Las Vegas conduce más y rompe más las reglas; España conduce menos pero se descompone más. Mismo tamaño de flota, perfil de riesgo opuesto." },
    ],
    choices: [
      null,
      { label: "🔧 Analizar las averías en España", say: "Analiza España a fondo: ¿qué está pasando con todas esas averías?" },
    ],
  },
  "ep-dashcam": {
    h: "e1ec3436",
    events: [
      null,
      { text: "SearchMedia es una herramienta real y en vivo, pero esta base de datos demo no tiene hardware de dashcam registrado, así que realmente vuelve vacía (la base de datos demo de España devuelve un error de servidor para la misma llamada). No voy a inventar un resultado para una herramienta que nos acaba de decir que no.\n\nLo que sí puedo mostrarte es cómo se ve esta revisión una vez que hay multimedia de cámaras conectada, marcado claramente abajo como reconstrucción, no como captura." },
      null,
      { text: "Cuando un vídeo así esté realmente conectado, la petición no cambia mucho (*\"saca el clip de esa alerta de exceso de velocidad de Demo - 01\"*), pero podría entregarte el momento en sí, no solo la telemetría. Combínalo con la verificación del límite señalizado: la vía te dice el límite y el clip te dice lo que vio el conductor." },
    ],
  },
  "ep-safety-risk": {
    h: "365a3150",
    events: [
      { text: "Voy a prepararte un buen scorecard de seguridad de conductores para la semana; primero confirmo quién va realmente al volante de cada vehículo." },
      null,
      null,
      { summary: "10 conductores con más riesgo · puntuaciones 47–68 vs. promedio de la flota 78" },
      { text: "Esta es tu semana. La puntuación de seguridad promedio de la flota es **78** (la referencia de la comunidad Geotab para flotas similares es ~82) y bajó **6% respecto a la semana anterior**, así que la tendencia va en la dirección equivocada, sobre todo por la velocidad.\n\n**Tus diez conductores con más riesgo:**\n\n1. **Marcus Bell** (Demo - 08): puntuación 47 · 131 eventos · *Exceso de velocidad 109, frenado brusco 14, cinturón 8*\n2. **Tina Alvarez** (Demo - 22): 52 · 119 · *Aceleración brusca 31, exceso de velocidad 74, giros 14*\n3. **Sam Whitfield** (Demo - 33): 55 · 102 · *Frenado brusco 41, exceso de velocidad 56*\n4. **Devon Carter** (Demo - 15): 58 · 118 · *Exceso de velocidad 107, frenado brusco 9*\n5. **Priya Nair** (Demo - 01): 61 · 121 · *Exceso de velocidad 111*\n6. **Luis Romero** (Demo - 04): 63 · 117 · *Exceso de velocidad 110*\n7. **Grace Kim** (Demo - 10): 65 · 116 · *Exceso de velocidad 110*\n8. **Andre Foster** (Demo - 25): 66 · 110 · *Exceso de velocidad 107*\n9. **Ben Ortiz** (Demo - 16): 67 · 113 · *Exceso de velocidad 107*\n10. **Chloe Tran** (Demo - 20): 68 · 109 · *Exceso de velocidad 107*\n\nLa lectura detrás de la lista importa más que la lista. **Siete de los diez solo tienen exceso de velocidad**, agrupados a pocos puntos entre sí: es un problema sistémico (rutas y límites compartidos), y la solución es una política más una alerta en vivo, no diez conversaciones por separado.\n\nPero **tres rompen ese patrón y merecen una conversación de verdad esta semana**: Marcus Bell es el único riesgo multifactor (velocidad *y* frenado *y* cinturón, la combinación que las aseguradoras ponderan más para la probabilidad de colisión); Tina Alvarez es tu caso de agresividad (31 aceleraciones bruscas); y Sam Whitfield tiene menos eventos, pero los más *graves*: 41 frenadas bruscas. Fíjate en que queda tercero por puntuación a pesar de tener el menor número de eventos: la gravedad pesa más que el volumen, y justo por eso la puntuación es mejor que un recuento bruto.\n\nSi quieres hablar de dinero: los eventos de frenado brusco y de exceso de velocidad son los dos predictores telemáticos más fuertes de colisiones con culpa, y una sola colisión con culpa en una flota como esta promedia fácilmente cinco cifras una vez que sumas el tiempo de inactividad y el impacto en la prima. Hacer coaching a los tres conductores multifactor es el riesgo más barato que vas a reducir en todo el trimestre.\n\n*(Los nombres de conductores en esta demo son ficticios, pero esta es exactamente la vista que ve un responsable cuando la identificación de conductor está activa y tiene permiso para verla.)*" },
      { title: "Puntuación de seguridad por conductor · los 10 con más riesgo esta semana (más bajo = más riesgo · promedio de la flota 78)" },
    ],
    choices: [
      { say: "Convierte esto en una skill reutilizable de scorecard de seguridad semanal que cualquiera de mi equipo pueda ejecutar." },
      { label: "🧑‍🏫 Redactar notas de coaching para su responsable", say: "Identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su responsable." },
      null,
      { say: "Configura una alerta por exceder el límite señalizado en toda la flota y envíala a un responsable de flota." },
    ],
  },
  "ep-safety-harsh": {
    h: "b5f8c08b",
    events: [
      null,
      null,
      { text: "Este es el panorama de 30 días. El frenado brusco en toda la flota en realidad **bajó 12%**, así que el programa está funcionando en general. Pero el promedio esconde al único conductor que necesitas revisar.\n\n**Frenado brusco por conductor (grave / moderado / leve):**\n\n- **Sam Whitfield** (Demo - 33): **58** eventos (9 graves, 21 moderados, 28 leves) · **▲ +22%**\n- **Tina Alvarez** (Demo - 22): 47 (6 / 18 / 23) · ▲ +4%\n- **Marcus Bell** (Demo - 08): 39 (5 / 14 / 20) · ▼ -8%\n- **Grace Kim** (Demo - 10): 28 (2 / 9 / 17) · ▼ -15%\n- **Devon Carter** (Demo - 15): 24 (1 / 8 / 15) · ▼ -3%\n\nSam Whitfield es el caso atípico en todos los ejes que importan: más eventos, los más **graves** (9 desaceleraciones fuertes por encima de 0,45 g, eso es frenar para evitar una colisión, no tráfico normal) y el único conductor con tendencia en la dirección equivocada, **+22%**, mientras la flota mejora. Todos los demás de esta lista están estables o bajando.\n\nAsí que esto no es una charla para toda la flota: es una conversación de coaching dirigida con Sam esta semana, antes de que una frenada grave se convierta en un reclamo por alcance. ¿Quieres que vea *dónde* ocurren sus eventos graves? Si se agrupan, podría ser tanto un problema de ruta como de conducción." },
      { title: "Eventos graves de frenado brusco (>0,45 g) por conductor · últimos 30 días" },
    ],
    choices: [
      null,
      { say: "Identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su responsable." },
      { say: "Muéstrame los diez conductores con más riesgo esta semana y sus principales eventos." },
    ],
  },
  "ep-safety-harsh-spain": {
    h: "0be4dc8b",
    events: [
      null,
      null,
      null,
      { text: "Eso cambia el enfoque. **El 40% del frenado brusco de Sam (23 de 58, incluidos 7 de sus 9 eventos graves) ocurre en una sola intersección**: West Charleston & South Rancho, y casi todo entre las 4 y las 6 de la tarde.\n\nUn conductor que frena bruscamente por toda la ciudad tiene un problema de hábitos de conducción. Un conductor que frena bruscamente en la *misma esquina a la misma hora todos los días* tiene un **problema de ruta**: un semáforo mal sincronizado, una incorporación sin visibilidad o un horario que lo hace pasar por ese cruce en hora pico. La solución probablemente tiene dos frentes: una charla rápida con Sam sobre cómo se aproxima, *y* reordenar sus recorridos de la tarde para evitar esa intersección en hora pico.\n\nEste es el tipo de cosas que nunca aparecen en una tabla por conductor: solo lo ves cuando pones los eventos en un mapa. Vale la pena revisar si *otros* conductores también tienen picos en esa misma esquina; si es así, es infraestructura, y es completamente un tema de la ruta, no de las personas." },
    ],
    choices: [
      { say: "Identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su responsable." },
      { say: "Muéstrame los diez conductores con más riesgo esta semana y sus principales eventos." },
    ],
  },
  "ep-safety-schoolzone": {
    h: "d4fb96bb",
    events: [
      null,
      null,
      { text: "Todavía no hay geocercas de zonas escolares configuradas, así que no puedo darte un recuento preciso basado en geocercas. Pero no tengo por qué dejarte con las manos vacías: los datos de límites señalizados ya conocen el límite de cada tramo, así que voy a cruzar los eventos de exceso de velocidad de este mes con los tramos de límite bajo (≤20 mph) que están junto a escuelas del condado de Clark." },
    ],
    choices: [
      null,
      { say: "Identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su responsable." },
    ],
  },
  "ep-safety-schoolzone-create": {
    h: "603c27f5",
    events: [
      null,
      null,
      null,
      null,
      { text: "Y envío la alerta a un responsable de flota para que una infracción en zona escolar le avise a alguien en el momento." },
      { summary: "Alerta enviada a 1 responsable" },
      { text: "Listo: tres geocercas de zonas escolares, una regla de exceso de velocidad en cada una con su límite señalizado real y alertas en vivo a un responsable. De ahora en adelante, cualquier exceso del límite dentro de una de ellas se marca en el momento en que ocurre, asociado al conductor.\n\nDos cosas que ganaste: la pregunta de este mes (\"¿quién excedió la velocidad en una zona escolar?\") ahora es una consulta *exacta, con validez para hacerla cumplir*, en lugar de una aproximación, y nunca más tendrás que hacerla en retrospectiva, porque Marcus o cualquier otro que pase a 30 frente a Bracken a la hora de entrada ahora dispara una alerta ese mismo día. Mándame el resto de tu lista de escuelas y replico esto en todas de una sola vez." },
      { changes: ["3 geocercas de zonas escolares creadas (150 m) en demo_fh_vegas4", "Reglas de exceso de velocidad limitadas a cada zona con su límite señalizado (15 / 15 / 20 mph)", "Alerta en vivo enviada a 1 responsable de flota"] },
    ],
    choices: [
      { say: "Ahora identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su responsable." },
      { label: "🚦 Mostrar mis conductores con más riesgo", say: "Ahora muéstrame mis diez conductores con más riesgo esta semana." },
    ],
  },
  "ep-safety-postedspeed-08": {
    h: "bfb3590d",
    choices: [
      { say: "Identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su responsable." },
    ],
  },
  "ep-maint-overdue": {
    h: "81ef2d4e",
    events: [
      null,
      null,
      { text: "Cinco vehículos tienen mantenimiento vencido, y el orden para atenderlos no depende de cuánto se pasaron, sino de lo que pasa si los sigues usando:\n\n1. **Demo - 25** (autobús MAN, Núria Pons): **inspección técnica anual, 19 días vencida.** Esta se salta la fila: no es una pieza de desgaste, es un tema *legal*. Un autobús con pasajeros y la ITV vencida es un problema de quedarse sin seguro si hay un incidente y una multa esperando a llegar. Agéndalo hoy.\n2. **Demo - 02** (autobús MAN, Iker Sáez): **inspección de frenos, 6.100 km pasada.** Vehículo de pasajeros, sistema de frenos, muy vencida: prioridad alta solo por seguridad.\n3. **Demo - 14** (Actros, Marta Ferrer): aceite y filtro de motor, 8.400 km pasada. La más vencida por distancia; posponer el aceite tanto en un camión es como un servicio de €200 se convierte en un motor de €6–8k.\n4–5. **Demo - 19** y **Demo - 41**: rutina, prioridad media, se pueden agrupar en las citas de taller de la próxima semana.\n\nEn resumen: dos urgentes (uno legal, uno de frenos), uno de prioridad alta y dos de rutina. Tus cinco furgonetas Sprinter, en contraste, están todas holgadamente dentro del intervalo. ¿Quieres que programe la primera en el taller y reserve una cita?\n\n*(Confírmalo con los registros del propio taller antes de aprobarlo, pero esto se lee directamente de los recordatorios configurados, no es una suposición.)*" },
    ],
    choices: [
      { label: "📧 Programar el crítico en el taller", say: "Programa la inspección técnica vencida de Demo - 25: redacta un correo al taller y pon una cita de taller provisional en mi calendario para mañana por la mañana." },
      { label: "⚠️ ¿Qué averías se marcaron esta semana?", say: "Muéstrame los códigos de avería marcados en los últimos siete días y su gravedad." },
    ],
  },
  "ep-maint-severity": {
    h: "5c63462b",
    events: [
      { text: "Voy a sacar las averías de esta semana y clasificarlas según el estado de la luz de advertencia que acompaña a cada una: roja de parada, ámbar de advertencia o informativa. Esa luz J1939 es donde vive la gravedad real, y es lo que separa \"detente en el arcén ya\" de \"ruido\"." },
      { summary: "597 registros de averías esta semana" },
      { summary: "3 CRÍTICAS (rojas) · 14 ADVERTENCIAS (ámbar) · 580 averías informativas del dispositivo" },
      { text: "597 parece que todo se está cayendo a pedazos. No es así, pero **3 de ellas realmente necesitan atención hoy**, y el valor aquí es que la clasificación por gravedad saca esas 3 del ruido en lugar de enterrarlas.\n\n**🔴 Críticas: luz roja de parada, el mismo día (3):**\n- **Demo - 12** (Actros, Pau Serra): *presión de aire del sistema de frenos baja.* Un camión cargado con frenos de aire fallando: detenlo e inspecciónalo antes de su siguiente recorrido, sin excepciones.\n- **Demo - 28** (autobús MAN, Lucía Mena): *temperatura del refrigerante alta.* Sobrecalentamiento; riesgo de una culata agrietada si sigue en marcha. Sácalo de servicio.\n- **Demo - 31** (autobús MAN, Roberto Vila): *postratamiento SCR, reducción de potencia del motor inminente.* Entrará en modo de emergencia a mitad de ruta y dejará varados a los pasajeros si se ignora.\n\n**🟡 Advertencia: ámbar, programar esta semana (14):** 5× regeneración del DPF, 4× AdBlue bajo, 3× batería baja, 2× presión de neumáticos baja. Ninguna deja varado un vehículo hoy, pero las de DPF y AdBlue se convierten en reducciones de potencia si se dejan.\n\n**⚪ Informativas (580):** el resto son averías de conectividad del dispositivo GO (la unidad desconectada o sin alimentación), casi todas en tus cinco furgonetas Sprinter (Demo - 06–10). Cero luces de motor. No son 580 problemas, es un solo trabajo de cableado; agrúpalo.\n\nAsí que la lista de trabajo se hace sola: **3 vehículos fuera de circulación ya**, 14 programados esta semana y un arreglo de arnés para las Sprinter que hará desaparecer el 95% de esta cifra." },
      { title: "Averías accionables por tipo · últimos 7 días (sin averías informativas del dispositivo)", bars: ["🔴 Presión de frenos (Demo-12)", "🔴 Refrigerante alto (Demo-28)", "🔴 SCR: potencia limitada (Demo-31)", "🟡 Regeneración DPF", "🟡 AdBlue bajo", "🟡 Batería baja", "🟡 Presión de neumáticos"] },
    ],
    choices: [
      { label: "📧 Programar ya las 3 unidades críticas", say: "Saca los detalles de las averías críticas de las 3 unidades con luz roja, redacta un correo al taller y pon citas de taller provisionales en mi calendario para mañana por la mañana." },
      { label: "🔎 ¿Por qué una furgoneta falla tanto? Investígalo", say: "Demo - 08 sigue apareciendo en las averías del dispositivo: ¿por qué? Investígalo y no te quedes con la primera explicación." },
    ],
  },
  "ep-maint-overdue-book": {
    h: "d8ade7a1",
    events: [
      null,
      null,
      { summary: "Demo - 25: MAN Lion's Coach, matrícula 4471-MAN" },
      { text: "MAN Lion's Coach, matrícula 4471-MAN, conductora Núria Pons. Redacto ahora el correo al taller (marcándolo como ITV legal, no un servicio de rutina) y lo dejo en Borradores; no lo envío sin que lo revises primero." },
      null,
      { text: "Guardado, no enviado. Ahora reservo una cita provisional para mañana por la mañana para que el autobús salga de circulación y vuelva a estar en regla lo antes posible." },
      { summary: "Cita provisional de ITV: mañana 09:00" },
      { text: "Así quedó en las tres herramientas. **Demo - 25** (MAN Lion's Coach, matrícula 4471-MAN, Núria Pons) lleva **19 días vencida su inspección técnica legal**: un autobús de pasajeros circulando con la ITV vencida es el único punto de la lista que es un problema de multas y seguro, no solo de desgaste. Redacté el correo al taller marcado como urgente, lo dejé en Borradores y puse una cita provisional a las 09:00 en el calendario para que no pierdas el espacio de mañana.\n\nLos otros cuatro vehículos vencidos (frenos en Demo - 02, luego lo de aceite/DPF) pueden ir después de este.\n\n(Esta demo apunta a un buzón y un calendario de prueba, nunca a un destinatario real.)" },
    ],
    choices: [
      { label: "⚠️ ¿Qué averías se marcaron esta semana?", say: "Muéstrame los códigos de avería marcados en los últimos siete días y su gravedad." },
    ],
  },
  "ep-maint-severity-book": {
    h: "5feb59d6",
    events: [
      null,
      { text: "Estas son las tres averías con luz roja de parada de la clasificación: las que deberían salir de circulación hoy. Saco los detalles de cada vehículo para que el taller conozca la avería y el activo antes de que llegue." },
      null,
      null,
      null,
      { text: "Guardado, no enviado. Ahora reservo tres citas provisionales para mañana por la mañana para que los tres queden programados en cuanto lo envíes." },
      { summary: "3 citas de taller provisionales: mañana por la mañana" },
      { text: "Este es el resultado en las tres herramientas. Las **3 unidades con luz roja de parada** (**Demo - 12**: Actros, presión de aire de frenos baja, Pau Serra; **Demo - 28**: autobús MAN, refrigerante alto, Lucía Mena; **Demo - 31**: autobús MAN, reducción de potencia SCR inminente, Roberto Vila) tienen cada una una razón real para detenerse antes de su siguiente recorrido. Redacté un solo correo al taller que cubre las tres (en Borradores, marcado como urgente) y reservé tres citas provisionales para mañana por la mañana.\n\nLos 14 puntos con luz ámbar pueden esperar al tiempo de taller programado de esta semana, y las 580 averías informativas del dispositivo son el trabajo de arnés de las Sprinter: no forman parte de esta reserva.\n\n(Esta demo apunta a un buzón y un calendario de prueba, nunca a un destinatario real.)" },
    ],
    choices: [
      { label: "🔎 ¿Por qué una furgoneta falla tanto? Investígalo", say: "Demo - 08 sigue apareciendo en las averías del dispositivo: ¿por qué? Investígalo y no te quedes con la primera explicación." },
    ],
  },
  "ep-maint-downtime": {
    h: "e88eaab7",
    events: [
      { text: "Voy a medir el tiempo de inactividad no planificado como realmente te duele (días que un vehículo estuvo fuera de servicio mientras su grupo de pares trabajaba) y vincular cada periodo con la avería que lo causó y lo que costó la disponibilidad perdida. Sacando el trimestre." },
      { summary: "≈38 días fuera de servicio en la flota · los 5 principales = 27,8 (73%) · aprox. €23k perdidos" },
      { text: "Alrededor de **38 días-vehículo perdidos este trimestre, unos €23k en indisponibilidad**, y está concentrado: los cinco activos principales suman ~28 de esos días (73%). Dos grupos explican casi todo:\n\n**Grupo 1: las furgonetas Sprinter (Demo - 06, 07, 08):** ~20 días fuera de servicio entre las tres, todas con la misma causa raíz: la avería recurrente de alimentación/conector que hemos estado siguiendo. **Solo Demo - 08 suma 9,2 días fuera de servicio** este trimestre, y justo por eso su kilometraje es un tercio del de la flota: está aparcada, no poco programada. Es la victoria más barata de la lista: un solo arreglo de arnés en las tres furgonetas recupera la mayoría de esos 20 días y ~€8k.\n\n**Grupo 2: los activos pesados (autobús Demo - 28, camión Demo - 12):** ~8 días fuera de servicio, y estos son tus días *caros*: un autobús o un camión fuera de circulación pierde €800–900/día en trabajo, frente a ~€400 de una furgoneta. Ambos se remontan a averías ya marcadas como críticas esta semana (sobrecalentamiento, frenos), así que detectarlas antes es lo que acortará estos periodos el próximo trimestre.\n\nEn resumen: aquí la inactividad no es mala suerte repartida; son dos causas solucionables en siete vehículos. Resuélvelas y le das un mordisco visible tanto al recuento de días como a los €23k." },
      { bars: ["Demo - 08 (furgoneta)", "Demo - 06 (furgoneta)", "Demo - 07 (furgoneta)", "Demo - 28 (autobús)", "Demo - 12 (camión)"] },
    ],
    choices: [
      null,
      { label: "⚠️ Códigos de avería + gravedad esta semana", say: "Muéstrame los códigos de avería marcados en los últimos siete días y su gravedad." },
    ],
  },
  "ep-ops-fuel": {
    h: "73603f7e",
    events: [
      { text: "El rendimiento de combustible se lee de los datos del motor de cada vehículo. Esta flota tiene dos tipos de carrocería (35 furgonetas de carga Ford Transit 250 y 15 pick-ups F-150), así que voy a separar el consumo y la distancia de esa forma y ponerle una cifra en dólares." },
      { summary: "Furgonetas 18,2 mpg · pick-ups 15,1 · $41,5k de gasto · 3 casos atípicos identificados" },
      { text: "Este es el mes. Las 35 furgonetas Transit promedian **18,2 mpg** (nominal 19,5), las 15 pick-ups F-150 **15,1** (nominal 16), y la flota combinada da **17,3**. El gasto total en combustible es de unos **$41,5k**.\n\nPero el promedio es la parte aburrida. Mira *quiénes* están por debajo: las tres furgonetas que hunden a la flota de furgonetas (**Marcus Bell con 14,9 mpg (-18%)**, Devon Carter con 15,6, Priya Nair con 16,0) son **exactamente los mismos nombres que encabezan tus listas de exceso de velocidad y de riesgo.** No es coincidencia: la velocidad alta y los eventos bruscos queman combustible. Tus peores conductores en seguridad también son tus peores conductores en combustible.\n\nLo que significa que una sola intervención rinde por tres. La política de límite señalizado que aplicarías por seguridad también recupera combustible: cerrar la brecha entre tu flota (17,3) y su rendimiento nominal vale aproximadamente **6–8%, del orden de $2,5–3k al mes**, y pega más fuerte en el mismo puñado de conductores. Seguridad, combustible y emisiones: una sola palanca.\n\n(Y el ciclo de trabajo urbano, corto y compacto de las furgonetas es justo el perfil que las convierte en tus candidatas a conversión eléctrica; con gusto preparo ese caso a continuación.)" },
    ],
    choices: [
      null,
      null,
      { say: "Configura una alerta por exceder el límite señalizado en toda la flota y envíala a un responsable de flota." },
    ],
  },
  "ep-ops-idle": {
    h: "02968617",
    events: [
      { text: "Voy a clasificar el ralentí de la semana pasada por conductor y convertir las horas en lo que de verdad llega a una reunión de presupuesto: combustible quemado y dólares, por cero millas recorridas." },
      { summary: "118 horas de ralentí en la flota · ≈59 gal · ≈$210/sem ($10,9k/año) · los 5 principales = 40%" },
      { text: "La semana pasada la flota estuvo en ralentí **118 horas**: unos **59 galones, ~$210 y media tonelada de CO₂ quemados sin ir a ningún lado.** Anualizado son aproximadamente **$10,9k al año** que salen directamente por el escape con el vehículo detenido.\n\nLos que más ralentí tienen (estos cinco son ~40% del total):\n- **Hannah Brooks** (Demo - 17): 6,1 h\n- **Eddie Vance** (Demo - 29): 5,4 h\n- **Sam Whitfield** (Demo - 33): 4,8 h\n- **Rosa Mendez** (Demo - 41): 4,3 h\n- **Will Dawson** (Demo - 05): 3,9 h\n\nCon el calor de Las Vegas, la mayor parte es aire acondicionado encendido mientras está aparcado: comprensible, pero hoy es invisible porque nada lo marca en el momento; solo aparece en un informe como este, cuando el combustible ya se fue.\n\nLa solución es una regla: marcar cualquier ralentí de más de 10 minutos y avisarle al conductor en vivo. Las flotas que lo hacen suelen reducir el ralentí 20–30% el primer mes; digamos **$2–3k/año recuperados** aquí, más el beneficio en emisiones, por una regla que me toma diez segundos crear. ¿La activo?" },
    ],
    choices: [
      { say: "Configura una alerta de ralentí para cualquier cosa de más de 10 minutos y envíala a un responsable." },
    ],
  },
  "ep-ops-idle-alert": {
    h: "e0c87e33",
    events: [
      null,
      null,
      { text: "Activa. Ahora envío la alerta a un responsable de flota." },
      { summary: "Alertas de ralentí enviadas a 1 responsable" },
      { text: "Listo: cualquier ralentí de más de 10 minutos ahora se marca en vivo y le llega a un responsable. La lista de ralentí de la próxima semana ya debería ser más corta, porque la gente recibe el aviso en el momento y no en un informe que nadie lee." },
      { changes: ["Regla \"Idling > 10 min\" creada y activa en demo_fh_vegas4", "Notificación enviada a 1 responsable de flota"] },
      { lines: ["Conector MCP de Geotab", "Detéctalo en el momento, no en el informe mensual."] },
    ],
  },
  "ep-agentic-safety": {
    h: "94dd973a",
    events: [
      null,
      { summary: "4.811 eventos de excepción esta semana (≈20.600 / 30 días)" },
      { text: "Casi 5.000 esta semana. Ahora la forma que tiene: puntúo a los conductores y reviso dónde caen los eventos graves." },
      null,
      { text: "Esta es la evaluación: los tres riesgos de seguridad principales, clasificados por lo que realmente te van a costar, cada uno con la acción correctiva que yo tomaría:\n\n**1. Exceso de velocidad sistémico: el riesgo dominante en toda la flota.** El 90% de ~4.800 eventos semanales, y los diez conductores principales están a menos de 5% entre sí: un grupo compacto sin casos atípicos es la firma de un *sistema* (rutas, límites y expectativas compartidas), no de unos cuantos malos actores. Está bajando la puntuación de seguridad de tu flota a 78, por debajo de la referencia de 82 y 6% menos esta semana.\n→ *Solución:* una regla de límite señalizado para toda la flota + alerta en vivo + una política de velocidad por escrito. También es tu mayor palanca de *combustible* (~$2,5–3k/mes): una sola acción, dos presupuestos.\n\n**2. Tres conductores multifactor que necesitan una conversación esta semana.** La mayor parte de la flota solo excede la velocidad, pero **Marcus Bell** (velocidad + frenado + cinturón, la combinación que mejor predice una colisión con culpa), **Tina Alvarez** (31 aceleraciones bruscas) y **Sam Whitfield** (9 frenadas graves, 40% en una sola intersección) se separan del resto.\n→ *Solución:* coaching 1:1 dirigido para estos tres: el riesgo más barato que vas a reducir en todo el trimestre, considerando que una colisión con culpa llega fácilmente a cinco cifras con todos los costes.\n\n**3. Exposición en zonas escolares a la hora de entrada/salida.** 7 eventos de exceso de velocidad este mes en tramos con nivel de zona escolar, entre Marcus Bell, Devon Carter y Chloe Tran, todos durante el horario escolar. Pocos casos, consecuencias muy altas (también para la reputación).\n→ *Solución:* crear geocercas de zonas escolares con sus límites señalizados para que se marquen en vivo, y hacer coaching ya a los tres conductores mencionados.\n\nSi solo haces el #1 y el #2 esta semana, mueves al mismo tiempo la puntuación de la flota, la factura de combustible y tu mayor exposición a colisiones. ¿Empiezo? ¿La alerta de velocidad en vivo o las notas de coaching?" },
    ],
    choices: [
      { say: "Haz el #1: configura la alerta por exceder el límite señalizado en toda la flota y envíala a un responsable de flota." },
      { say: "Identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su responsable." },
      null,
      null,
      { say: "¿Quiénes son mis diez conductores con más riesgo esta semana y cuáles fueron sus principales eventos?" },
    ],
  },
  "ep-agentic-coaching": {
    h: "8ca14333",
    events: [
      null,
      null,
      null,
      { text: "Tres conductores, tres conversaciones distintas: redacto una nota con la que tu responsable directo pueda actuar de inmediato, un párrafo específico y justo para cada uno. La dejo en Borradores, sin enviarla." },
      null,
      { text: "El borrador está guardado, no enviado: abre la tarjeta de arriba para leerlo. Cada conductor recibe un párrafo específico, respaldado con evidencia y con un enfoque justo: los eventos de cinturón y de zona escolar de Marcus van primero porque no son negociables; la nota de Tina relaciona su hábito con el combustible para que no sea solo un regaño; y la de Sam señala explícitamente que su problema es en parte la ruta, no solo él.\n\nEsa es la diferencia entre una nota de coaching que un responsable puede usar mañana y una tabla de posiciones que solo señala y avergüenza. (Esta demo apunta a un buzón de prueba y los nombres de los conductores son ficticios: nunca un destinatario o registro real.)" },
    ],
    choices: [
      { label: "📤 Enviárselo ya al responsable" },
    ],
  },
  "ep-coaching-send": {
    h: "207561a7",
    events: [
      null,
      { text: "Enviado. El responsable ya tiene a Marcus, Tina y Sam, cada uno con un punto de conversación específico y justo, además del enfoque de que el exceso de velocidad generalizado se resuelve con una política, no con tres chivos expiatorios. Las conversaciones empiezan en el lugar correcto. La alerta de velocidad en vivo es el complemento natural de esto si todavía no la configuraste." },
      { lines: ["Conector MCP de Geotab", "De los datos de la flota a la bandeja de entrada de un responsable, en una sola petición."] },
    ],
    choices: [
      { say: "Ahora configura la alerta por exceder el límite señalizado en toda la flota y envíala a un responsable." },
    ],
  },
  "warehouse-intro": {
    h: "439e4fc5",
    events: [
      null,
      { text: "**¿Esto siquiera es buena idea? Sí, en cuanto tus preguntas se vuelven más grandes que una sola llamada a la API.**\n\nEl conector MCP en vivo es excelente para preguntas puntuales sobre el estado actual. Un almacén de datos es para las analíticas: **combinar viajes + averías + excepciones + GPS**, cruzar todo eso **con tus propios datos** (tarjetas de combustible, ERP de mantenimiento, nómina, meteorología), agregar **toda la flota a la vez**, segmentar por grupo o tipo de vehículo y, claro, también tendencias en el tiempo. Las haces **una y otra vez y a bajo coste** sin volver a extraer datos de la API en vivo, sobre datos que **son tuyos y controlas**, así que puedes colgar de ahí dashboards, resúmenes programados y skills de agentes. El conector es la capa de acceso; MotherDuck es la capa de memoria duradera. (Si prefieres la ruta probada y sin MCP, el **MyGeotab API Adapter** de código abierto de Geotab lleva años replicando datos de flota en Postgres/SQL Server; pregunta *“¿Esto es lo que recomienda Geotab?”* abajo.)\n\nEsta es la parte genuinamente interesante: **el asistente orquesta todo el pipeline con llamadas MCP**: sin servicio ETL, sin Airflow, sin código de pegamento. Le pide los datos a Geotab (MCP) y le dice a MotherDuck (MCP) que los cargue, transforme y programe. Extraer, cargar, transformar, refrescar: todo son simples llamadas a herramientas en este chat. Geotab Ace incluso devuelve una **URL de CSV firmada** que MotherDuck lee *directamente*, así que nunca se descarga nada.\n\nY elegimos **MotherDuck precisamente por su nivel gratuito**: una flota de 50 vehículos cuesta **$0** durante años, así que puedes montar todo esto sin una conversación de presupuesto.\n\nEste es el plan: primero un ciclo concreto: pedir filas GPS crudas, cargar el CSV firmado en `gps_points` y consultarlo. Una vez que eso funcione, la razón de bronze/silver/gold se vuelve obvia: cargas repetibles, filas tipadas, deduplicación, procedencia, controles de calidad y control de costes." },
    ],
  },
  "warehouse-geotab-recommendation": {
    h: "627fe88b",
    events: [
      { text: "No como recomendación oficial. Esta ruta de almacén de datos Geotab → MotherDuck orquestada por MCP es una **prueba de concepto**: nueva, interesante en este mundo MCP y todavía no probada a escala. El asistente puede coordinar ambos lados (pedirle filas a Geotab y luego pedirle a MotherDuck que las cargue y transforme) sin un servicio ETL aparte.\n\nEl patrón probado que los clientes de Geotab llevan años usando es el **[MyGeotab API Adapter](https://github.com/Geotab/mygeotab-api-adapter/blob/master/MyGeotabAPIAdapter/README.md)** de código abierto: un servicio .NET maduro (sin MCP de por medio) que replica los datos de tu flota en tu propia base de datos **PostgreSQL o SQL Server**. Extrae de forma incremental a través de los data feeds de MyGeotab (registros GPS, viajes, averías y más), mantiene en caché los datos de referencia de dispositivos/usuarios/zonas e incluye la plomería de producción: reintentos, transacciones, mantenimiento de particiones. Montarlo es un proyecto clásico y bien documentado de ingeniería de datos: ejecutas el servicio una vez y tu base de datos se llena sola.\n\nAsí que el planteamiento honesto es: **MyGeotab API Adapter** para una replicación probada en Postgres/SQL Server que tú operas; **esta ruta MCP + MotherDuck** para un almacén de datos ligero, impulsado por conversación, que puedes montar en un chat por $0. Seguiremos actualizando este nodo a medida que madure el enfoque MCP." },
    ],
    choices: [
      null,
      { label: "⏱ ¿Cómo de actualizada puede estar la ruta MCP?", say: "El adapter consulta cada pocos segundos. ¿Cómo de actualizado puede estar realmente este almacén MCP?" },
    ],
  },
  "warehouse-setup": {
    h: "7c3f7b4d",
    events: [
      null,
      { summary: "URL de CSV firmada devuelta · 157.419 filas GPS" },
      { text: "Listo: Ace devolvió **157.419 filas** como un CSV firmado (la URL vence en ~24 h). Todavía no se guarda nada. ¿Quieres que lo cargue directamente en una tabla de MotherDuck?" },
    ],
  },
  "warehouse-first-load": {
    h: "77e245bf",
    events: [
      null,
      null,
      null,
      { text: "Listo: `gps_points` contiene las 157.419 filas y la consulta de prueba las devuelve. Fíjate en que las columnas llegaron como cadenas de texto crudas; eso es lo primero que vamos a arreglar." },
    ],
  },
  "warehouse-layering": {
    h: "fe548b6f",
    events: [
      { text: "Sigo la [skill geotab-motherduck-warehouse](https://github.com/fhoffa/geotab-vibe-guide/blob/main/skills/geotab-motherduck-warehouse/SKILL.md) que me indicaste. La carga en una sola tabla funcionó, pero aparecen tres problemas en cuanto la vuelves a ejecutar mañana:\n\n- La URL de CSV firmada vence, así que necesitas una copia duradera de exactamente lo que devolvió Ace.\n- Ace puede solapar segundos en los límites y a veces cambia sus decisiones de SQL, así que las cargas repetidas necesitan deduplicación y procedencia.\n- Las columnas del CSV crudo son cadenas de texto; la analítica necesita timestamps tipados, números y claves estables.\n\nAsí que refactorizamos la tabla simple `gps_points` en capas: **bronze** guarda las filas crudas y reproducibles, **silver** está tipada y deduplicada, y **gold** es la tabla lista para el negocio." },
    ],
  },
  "warehouse-incremental": {
    h: "6776b756",
    events: [
      { text: "Ahora puedo ejecutar la versión diaria de forma segura: le pido a MotherDuck la marca de agua de silver, le paso ese timestamp a Ace, dejo el nuevo CSV en bronze y luego inserto en silver solo las filas más recientes que la marca de agua.\n\nEn este paso es donde rinden las capas anteriores: **Ace solo respeta los límites de subsegundo hasta el segundo**, así que el solapamiento es normal, y **lee el SQL devuelto cada vez** antes de cargar, porque Ace puede inyectar predicados." },
      null,
      null,
      null,
      null,
      { text: "Este es el ciclo de refresco duradero, no la meta: marca de agua → extraer → anexar a bronze → derivar silver → controles de calidad → refrescar gold.\n\nA partir de aquí puedes seguir construyendo: ¿quieres que añada el resto del almacén operativo (viajes, averías, estado, excepciones y las dimensiones que los decodifican)?" },
    ],
    choices: [
      { label: "🧩 Añadir viajes, averías, estado y dimensiones", say: "Esto es útil, pero los puntos GPS solos no son un almacén de datos. Añade viajes, averías, datos de estado, excepciones y las dimensiones que los hacen legibles." },
      { label: "⏱ ¿Cómo de actualizado está esto, en realidad?", say: "¿Cómo de actualizado está este almacén, en realidad? El propio adapter de Geotab consulta cada pocos segundos: ¿por qué no usamos su feed?" },
    ],
  },
  "warehouse-operational": {
    h: "b6cf89d8",
    events: [
      { text: "Exacto: el GPS demuestra que la tubería funciona, pero un almacén operativo también necesita las otras superficies de Geotab. La regla práctica de la skill es simple: **hechos con timestamp vía Ace hacia bronze**, y **listas de consulta vía Get hacia dimensiones**.\n\nAsí que añadimos viajes, asignaciones de conductores, datos de estado/motor, eventos de excepción de seguridad y averías como hechos. Luego añadimos usuarios/conductores, reglas, diagnósticos, grupos y zonas como dimensiones para que las filas de hechos sean legibles. El conductor es una trampa de Geotab: no existe el typeName `Driver`; los conductores son filas de `User` donde `isDriver=true`." },
      null,
      null,
      null,
      null,
      null,
      { stages: [null, { notes: [null, null, null, null, null, null, "el inventario completo de la flota (vía Get)", "los conductores son Users con isDriver=true", null, null, null, null] }, null] },
    ],
    choices: [
      null,
      { label: "📍 ¿Las averías no tienen ubicación?", say: "Un momento: ¿las filas de averías y de estado no incluyen coordenadas GPS? ¿Cómo pondría las averías en un mapa?" },
    ],
  },
  "warehouse-restated": {
    h: "2541c961",
    events: [
      { text: "Cuidado: acabamos de cargar los viajes y las asignaciones de conductores de la *misma* forma de solo anexar que el GPS, y eso es un bug esperando a ocurrir. Los pings GPS, el estado, las excepciones y las averías son **eventos inmutables**: una vez que se escribe `(device, timestamp)` nunca cambia, así que anexar + deduplicar es correcto.\n\n**Un `Trip` es distinto: es derivado, no registrado.** Geotab recalcula los límites de un viaje cuando llega nueva evidencia (una asignación `DriverChange`, o GPS tardío o fuera de orden). Un recálculo puede cambiar la hora de fin del viaje y darle un **`TripId` completamente nuevo, retirando el anterior**. Así que un viaje que ya cargaste puede desaparecer con su id viejo y reaparecer con uno nuevo: una *actualización* que anexar + deduplicar nunca ve.\n\n👉 Mantén abierto el panel **Almacén** (arriba del chat) para esta parte: vas a ver cómo se reemplaza una fila de viaje retirada." },
      null,
      null,
      { text: "Por qué una actualización normal hacia adelante no puede arreglarlo: el **inicio del viaje redividido no cambió (23:18) y queda *antes* de la marca de agua**, así que `WHERE start > watermark` nunca trae el id nuevo. Deduplicar por `TripId` no sirve (el id cambió), y deduplicar por `(DeviceId, start)` conservaría la fila *obsoleta*.\n\nLa solución es una **conciliación de redivisión de viajes**, que se ejecuta justo después de cada carga de viajes hacia adelante. Vuelve a extraer desde `watermark − L`, donde `L` ≥ tu viaje más largo esperado (unas horas para flotas urbanas, ≥24–36 h para larga distancia). La misma ventana de revisión también captura los viajes largos que *terminaron* después de que un viaje más corto adelantara la marca de agua." },
      null,
      null,
      null,
      { text: "Una última trampa: bronze guarda todas las versiones, así que es tentador simplemente reproducir bronze → silver, pero eso **resucitaría los ids retirados** (bronze todavía tiene el viejo `b10FEE52` junto al nuevo `b11011A1`). La skill se encarga de esto por ti: en lugar de usar el id del viaje como clave, su reconstrucción conserva **una fila por recorrido, tomando la versión cargada más recientemente**, así que un viaje retirado se colapsa en su reemplazo en lugar de duplicarse.\n\nY las asignaciones de conductores: los eventos `DriverChange` en sí *son* de solo anexar, pero `Trip.driver` se deriva de ellos: se resuelve en un conductor real o en el centinela `UnknownDriverId`, así que toda unión viajes→conductores debe tolerar ese centinela.\n\n**El modelo mental: tres formas, tres estrategias:**\n\n- **Eventos inmutables** (GPS, estado, excepciones, averías) → anexar + deduplicar por la clave natural.\n- **El Trip mutable** → derivar hacia adelante y luego conciliar (DELETE de retirados + anti-join), o reconstruir por clave de recorrido.\n- **Dimensiones** (Device, User/conductores, Zone, Rule, Diagnostic) → `Get`, sin bronze, `CREATE OR REPLACE`." },
    ],
    choices: [
      { label: "✅ Añadir controles de calidad y detección de huecos", say: "Ahora añade controles de calidad, controles de actualización y detección de huecos para que pueda confiar en este almacén." },
    ],
  },
  "warehouse-quality": {
    h: "19ff24b2",
    events: [
      { text: "Antes de programar esto, decide qué cuenta como confiable. Los controles no buscan que cada vehículo y cada conductor aparezca en cada tabla de hechos; buscan huecos que no podemos explicar.\n\nEjemplos: los vehículos aparcados pueden no tener GPS/viajes hoy aunque `dim_device` siga listando toda la flota. Los viajes sin conductor asignado deben quedar explícitos como `UnknownDriverId`, no desaparecer del informe. También conservamos dos advertencias **semánticas** que salen de leer el SQL que devolvió Ace (Ace añadió un filtro `Speed != 0` a un prompt de estado, y eligió una tabla de origen distinta para dos prompts de viajes equivalentes), porque esa deriva nunca aparece como una fila mala, solo como una forma equivocada." },
    ],
    choices: [
      { label: "💵 Estimar el coste de operación" },
      null,
      { label: "🩺 Añadir una vista de salud del almacén" },
    ],
  },
  "warehouse-costs": {
    h: "40028611",
    events: [
      { text: "Antes de elegir un calendario de refresco, revisa si esto cabe en el nivel gratuito de MotherDuck y qué haría que empezara a costar dinero.\n\nLa referencia de costes está aquí: [COST_AND_SIZING.md](https://github.com/fhoffa/geotab-vibe-guide/blob/main/skills/geotab-motherduck-warehouse/references/COST_AND_SIZING.md). Midió un almacén demo en **35,2 MiB** para 679.577 pings GPS más viajes/excepciones/dimensiones. El GPS de bronze+silver ocupa unos **54 bytes por ping**, así que el almacenamiento normalmente no es el factor limitante." },
      null,
      { text: "Estimación de costes de la skill:\n\n- **50 vehículos:** $0/mes en Lite en este modelo: 10 GB de almacenamiento gratis y 10 CU-horas/mes cubren años de historial bronze+silver y refrescos frecuentes.\n- **500 vehículos:** todavía puede costar $0 en Lite si conservas solo silver; Business sale en unos **$260/mes** si eliges el plan de plataforma de $250.\n- **5.000 vehículos:** aproximadamente **$270–300/mes** en Business.\n- **50.000 vehículos:** aproximadamente **$370–520/mes** por un año de historial bronze+silver.\n\nEn resumen: para una flota típica esto sigue siendo gratis; solo empiezas a pagar cuando conservas mucho historial o refrescas muy a menudo. Elige una ventana de retención y una cadencia de refresco que encajen con el plan que quieres." },
      { note: "El panel sigue mostrando todo el almacén que construiste: las cifras de coste de arriba se midieron exactamente contra estas tablas bronze/silver/gold. La confianza incluye controles de coste: recuentos de filas, bytes escaneados, segundos de ejecución y alertas cuando el uso se dispara." },
    ],
  },
  "warehouse-answers": {
    h: "64b7a24d",
    events: [
      { text: "Una vez que los viajes, las excepciones, las averías, los datos de estado y las dimensiones están en el mismo almacén, las preguntas se vuelven más grandes que cualquier llamada MCP individual. Ahora el asistente puede cruzar el historial:\n\n- **Utilización:** ¿Qué vehículos están subutilizados considerando viajes, GPS y grupos?\n- **Seguridad:** ¿Qué conductores son de riesgo por excepciones por milla, no solo por recuentos brutos de eventos?\n- **Mantenimiento:** ¿Qué grupos de averías se correlacionan con el tiempo de inactividad, las horas de motor y el tipo de vehículo?\n- **Coste:** ¿Dónde se acumulan el ralentí, las rutas y el exceso de velocidad en desperdicio de combustible?\n\nEsa es la verdadera historia: el conector MCP de Geotab es excelente para preguntas en vivo, y MotherDuck convierte esas extracciones MCP en memoria institucional duradera y consultable." },
      null,
      { text: "Ahí está: una **cola de coaching de 14 conductores** y una **lista de trabajo de taller de 9 vehículos**, ambas construidas con historial que ninguna llamada en vivo podría preparar sola. A partir de aquí convertirías esto en **dashboards internos** para tu equipo: MotherDuck tiene notebooks y dashboards integrados, así que puedes graficarlos y compartirlos justo donde viven los datos. Vale la pena explorar sus funciones en [motherduck.com](https://motherduck.com)." },
    ],
    choices: [
      { label: "📍 Poner las averías en el mapa", say: "¿Puedo poner las averías en un mapa? No recuerdo que las filas de averías tuvieran coordenadas." },
    ],
  },
  "warehouse-freshness": {
    h: "6e2f4f43",
    events: [
      { text: "Pregunta justa, y es la diferencia arquitectónica honesta entre esta ruta y el adapter propio de Geotab.\n\nEl MyGeotab API Adapter se sincroniza con **`GetFeed`**: una API oficial que devuelve un **cursor de versión** por tipo de entidad, así que el servicio puede consultar cada pocos segundos (configurable hasta 2 s) y nunca perder ni volver a traer una fila, incluso tras reinicios. **El conector MCP no expone `GetFeed`**: la skill auditó las 20 herramientas MCP y ninguna acepta un token de feed.\n\nAsí que este almacén usa el sustituto compatible con MCP: **marca de agua + deduplicación por clave natural**. Pide las filas más recientes que el último timestamp ya guardado y deja que la deduplicación absorba el solapamiento en los límites (recuerda: Ace solo respeta los límites hasta el segundo). Es la misma idea que un cursor de feed, reconstruida con lo que MCP sí ofrece.\n\nLo que gana y lo que cuesta ese intercambio:\n- **Cadencia:** este almacén se refresca cuando se ejecuta un agente, bajo demanda o con un calendario, normalmente de minutos a diario. El adapter es un servicio 24/7 que se refresca en segundos.\n- **Exactitud:** equivalente para eventos inmutables (la deduplicación gestiona el solapamiento); los viajes necesitan su paso de conciliación en cualquiera de las dos rutas.\n- **El límite que hay que respetar:** analítica, dashboards, resúmenes programados: esta ruta alcanza. Despacho en vivo o alertas sobre datos de hace segundos: eso le toca al conector en vivo, o al adapter.\n\nLa skill mantiene una comparación completa de las dos: **[MCP → MotherDuck vs GetFeed → API Adapter](https://github.com/fhoffa/geotab-vibe-guide/blob/main/guides/MCP_TO_MOTHERDUCK_VS_GETFEED_API_ADAPTER.md)**, incluida la ruta de graduación: haz el prototipo aquí sin infraestructura y pasa al adapter si alguna vez necesitas actualización de menos de un minuto. Los conceptos se transfieren directamente; ambos reflejan las mismas entidades." },
    ],
    choices: [
      { say: "Entonces, si los refrescos solo se ejecutan cuando se ejecuta un agente, ¿qué pasa cuando el almacén se queda atrás? ¿Cómo me daría cuenta siquiera?" },
    ],
  },
  "warehouse-backfill": {
    h: "736408fe",
    events: [
      null,
      null,
      { text: "Ahí está: **`status_data` va 3,2 horas atrasada** y nada dio error. La extracción de estado de ayer devolvió *exactamente* el límite de página, y el ciclo trató una página llena como 'terminado'. Esa es la trampa para la que existe la heurística de ritmo del adapter:\n\n**Si la extracción de una ventana devuelve filas hasta el límite superior, o llena el límite de página, sigues atrasado: vuelve a extraer de inmediato. Solo una ventana parcial significa que estás al día.** Sin adivinar, sin esperas fijas." },
      null,
      null,
      { note: "Ejecuta la vista de salud al inicio de cada refresco: es la diferencia entre encontrar un hueco ahora y encontrarlo en el informe del mes que viene." },
    ],
    choices: [
      { say: "Bien. Ahora añade los controles de calidad y la detección de huecos." },
    ],
  },
  "warehouse-enrichment": {
    h: "6e75b2a6",
    events: [
      { text: "Buena observación: **`FaultData` y `StatusData` no traen coordenadas**. En el modelo de Geotab, la ubicación vive en `LogRecord`; una avería solo conoce su dispositivo y su timestamp. El API Adapter dedica **dos servicios en segundo plano completos** a interpolar lat/lon/velocidad/rumbo desde los LogRecords cercanos hacia las filas de averías y de estado.\n\nEn un almacén columnar eso es una sola consulta. El **`ASOF JOIN`** de DuckDB toma, para cada avería, el ping GPS más cercano en o antes del timestamp de la avería, por dispositivo:" },
      { summary: "cada avería ubicada en una sola consulta" },
      { text: "Las **4.912 averías obtuvieron coordenadas**, y la distribución de la brecha dice que la coincidencia es honesta: mediana de 2 segundos al ping más cercano, p95 de 23 segundos. (La skill validó este mismo patrón en vivo con **822.203 eventos, 100% emparejados**: aguanta a escala.)\n\nUna trampa, y es la misma lección de datos tardíos que enseñaron los viajes: **el GPS también llega tarde**. Una avería registrada hace 30 segundos puede no tener todavía en silver los pings que la rodean, así que la unión tomaría un ping de hace minutos. O bien **solo enriqueces eventos más antiguos que un pequeño margen**, o simplemente **reconstruyes este mart en cada refresco**: a este tamaño la reconstrucción es barata, así que eso es lo que programamos." },
      { compactSubtitle: "Averías ubicadas" },
    ],
    choices: [
      null,
      { label: "✅ Añadir controles de calidad", say: "Ahora añade controles de calidad, controles de actualización y detección de huecos para que pueda confiar en este almacén." },
    ],
  },
  "warehouse-deletions": {
    h: "b2afc27a",
    events: [
      { text: "No por sí solo, y esta es una de las trampas más silenciosas de la replicación incremental. **Una eliminación nunca aparece en una extracción incremental.** Una zona eliminada no llega marcada como 'eliminada'; simplemente deja de aparecer. Los ciclos con marca de agua solo ven filas *nuevas*, así que `dim_zone` seguiría sirviendo tan tranquila una zona que ya no existe.\n\nLa respuesta del adapter, que este almacén ya sigue sin haber dicho por qué, es que **las dimensiones reciben una instantánea completa periódica, nunca una incremental**. Por eso cada dim aquí es `Get` → `CREATE OR REPLACE`: sin bronze, sin marca de agua. Cada refresco reemplaza el inventario completo, así que una desaparición *es* la señal. También es la razón por la que **las dimensiones se cargan antes que los hechos**: las filas de hechos nunca deberían llegar antes que las filas que las decodifican.\n\nDos refinamientos:\n- Geotab a menudo **retira en lugar de eliminar**: `activeFrom`/`activeTo` en Users y similares. Conserva las filas retiradas con sus fechas: el historial todavía se une a ellas.\n- El atajo del subconjunto hereda la regla: si conservas solo los ~56 diagnósticos que tus averías realmente referencian (de 65K), ese subconjunto también debe **derivarse completo de nuevo** en cada refresco, o un diagnóstico recién referenciado nunca aparece." },
      null,
      { text: "El hábito general que enseña el adapter: antes de cargar cualquier entidad nueva, pregúntate **\"¿esta fila cambia después de crearse?\"**\n\n- **Nunca** (GPS, estado, excepciones, averías, `DriverChange`) → anexar + deduplicar por la clave natural.\n- **Sí: se reemplaza** (`Trip`: se redivide con un id completamente nuevo) → el paso de conciliación que ya viste.\n- **Sí: se actualiza en el lugar** (`DVIRLog`: un defecto luego obtiene su estado de reparación) → vuelve a extraer una ventana reciente, gana la última versión.\n- **Dimensiones** (Device, User, Zone, Rule, Diagnostic) → instantánea completa; las eliminaciones se resuelven por construcción.\n\nUna fila de esa lista es engañosa: `DriverChange` es en sí de solo anexar, pero su *llegada* dispara redivisiones de viajes: un evento inmutable que modifica otra tabla." },
    ],
    choices: [
      null,
      { say: "Ahora añade controles de calidad, controles de actualización y detección de huecos para que pueda confiar en este almacén." },
    ],
  },
  "warehouse-downsample": {
    h: "8e5295d4",
    events: [
      { text: "Sí, pero *dónde* submuestreas decide si alguna vez puedes cambiar de opinión.\n\nEl API Adapter ofrece muestreo al momento de la ingesta: un intervalo mínimo de 1–3600 s por dispositivo para LogRecords y StatusData. Es efectivo, y su propia documentación trae la advertencia que importa: **lo que descartas en la ingesta nunca se puede recuperar con un backfill.** Eliges un piso de 60 s hoy, necesitas granularidad de 10 s el próximo trimestre: ese historial ya no existe.\n\nLa versión de almacén de esa misma palanca es más segura: **mantén bronze completo y submuestrea en la derivación de silver o en el mart gold.** El almacenamiento es la parte barata (~54 bytes por ping, recuerda); lo que realmente ajustas es el tamaño del mart y el coste de escaneo:" },
      null,
      { text: "Un mart 78% más pequeño para dashboards y preguntas diarias, mientras **cada fila original sigue a un `CREATE TABLE` de distancia**: cambia el piso a 10 s el próximo trimestre y reconstruye.\n\nUna advertencia honesta antes de apoyarte en esa reversibilidad: solo dura lo que dure bronze. Si más adelante añades una **ventana de depuración de bronze** (por ejemplo, una ventana móvil de 7–30 días) para limitar el almacenamiento, entonces para el historial depurado el submuestreo se vuelve tan permanente como el del adapter. Así que el orden de las decisiones importa: **elige tu piso de granularidad antes de que la depuración alcance** el historial que te importa.\n\nPara esta flota de 50 vehículos nada de esto es obligatorio: todo el almacén ocupa 35,2 MiB frente a 10 GB gratis. Esta palanca existe para el día en que la flota sea 10× y `status_data` sea la razón por la que se movió la línea de almacenamiento." },
    ],
    choices: [
      null,
      { label: "💵 Volver a la estimación de costes", say: "Muestra de nuevo la estimación de costes." },
    ],
  },
  "ep-roi": {
    h: "fc8e4fa5",
    events: [
      null,
      null,
      { summary: "≈ $75.500 / año capturables (~$1.510 por vehículo) en 4 palancas" },
      { text: "Aquí está el dinero, totalizado para la flota de Las Vegas: unos **$75.500 al año recuperables, aproximadamente $1.510 por vehículo**:\n\n- **Exceso de velocidad → combustible: ~$33.000.** Un 6–8% de una factura de combustible de ~$498k/año, cerrando la brecha entre tus 17,3 mpg y el rendimiento nominal. *Solución: la regla de límite señalizado en toda la flota + alerta.*\n- **Colisiones y seguro: ~$28.000** (ponderado por riesgo). Coaching a los tres conductores con múltiples factores, más el crédito de prima por telemática que dan las aseguradoras a un programa de scorecard. *Solución: coaching de conductores + scorecard.*\n- **Mantenimiento y tiempo fuera de servicio: ~$12.000.** Servicio preventivo en lugar de reactivo y menos días fuera de servicio no planificados. *Solución: recordatorios de mantenimiento + triaje por severidad.*\n- **Ralentí: ~$2.500.** Un recorte de 20–30% sobre los $10,9k/año que hoy quemas aparcado. *Solución: una regla de ralentí.*\n\nDos advertencias honestas para que esto aguante el escrutinio: la **línea de colisiones es un valor esperado, no un ahorro asegurado** (trátala como el premio, no como la factura), y **no conté doble** el solapamiento entre las líneas de combustible y ralentí (un pie derecho más tranquilo ayuda a ambas; la línea de exceso de velocidad ya absorbe la ganancia de combustible por estilo de conducción).\n\nEl patrón que vale la pena llevar arriba: las dos palancas más grandes, combustible y colisiones, son el *mismo comportamiento*: velocidad y agresividad. Así que no son cuatro proyectos compitiendo por presupuesto; es **un solo programa de seguridad** (política de velocidad + coaching) que cubre ~80% del total, y las piezas de mantenimiento y ralentí vienen detrás. ¿Quieres que lo ponga en una página que puedas reenviarle a tu jefe?" },
    ],
    choices: [
      null,
      null,
      null,
      { say: "Identifica a los conductores que necesitan coaching y redacta un resumen que pueda enviar a su responsable." },
    ],
  },
  "ep-roi-onepager": {
    h: "9f8cf5f1",
    choices: [
      null,
      { say: "Configura la alerta por exceder el límite señalizado en toda la flota y envíala a un responsable." },
    ],
  },
  "ep-roi-send": {
    h: "d503101a",
    events: [
      null,
      { text: "Enviado. Tu director ya tiene un caso de negocio con costes y advertencias, construido con datos de flota en vivo, no con una diapositiva de un proveedor, y con una sola petición clara. Cuando estés listo para actuar con la aprobación, puedo montar la regla de velocidad, la lista de coaching y los recordatorios de mantenimiento en unos minutos." },
    ],
    choices: [
      { say: "Ahora configura la alerta por exceder el límite señalizado en toda la flota y envíala a un responsable." },
    ],
  },
  "carto-fleet": {
    h: "6fa38ebf",
    events: [
      null,
      null,
      null,
      null,
      { summary: "50 posiciones · 22 en marcha · 28 aparcados · todos comunicando" },
      { summary: "22 en marcha (azul) · 28 aparcados (puntos rojos, más grande = más vehículos)" },
      { text: "**50 vehículos: 22 en marcha, 28 aparcados**, todos alrededor de Las Vegas. Los 50 enviaron datos en los últimos minutos, así que esto está actualizado a las 7:08 pm hora de Las Vegas (30 sep)." },
    ],
    choices: [
      { label: "📍 Agrupar los vehículos aparcados en hubs", say: "Agrupa los vehículos aparcados en hubs." },
    ],
  },
  "carto-what-is": {
    h: "f278b3d3",
    events: [
      { text: "CARTO es una plataforma de analítica de ubicación que ejecuta SQL espacial en tu almacén de datos. Aquí la uso para agrupar los vehículos aparcados, ver qué hay a su alrededor y calcular hasta dónde puedes llegar conduciendo en 15 minutos." },
    ],
    choices: [
      { label: "📍 Agrupar los vehículos aparcados en hubs", say: "Agrupa los vehículos aparcados en hubs." },
    ],
  },
  "carto-hubs": {
    h: "11900dcc",
    events: [
      { text: "Paso las 28 posiciones de aparcamiento directamente a una consulta en tu conexión de CARTO, agrupadas en hexágonos H3 de resolución 8 (unos 0,7 km² cada uno). Varios vehículos en un mismo hexágono suelen indicar una campa compartida." },
      { summary: "5 celdas con varios vehículos · 25 de 28 vehículos aparcados" },
      { title: "Cinco hubs · vehículos aparcados por celda H3", summary: "25 de 28 vehículos aparcados están en cinco celdas" },
      { text: "**Cinco hubs.** 25 de los 28 vehículos aparcados están en uno de cinco puntos; los otros 3 están aparcados solos. Nombré los hubs según dónde quedan en el mapa.\n\nPero esto es una sola instantánea a eso de las 7 pm, así que no puedo asegurar que sean campas. Algunos podrían ser el sitio de un cliente o un aparcamiento compartido. Unas semanas de datos de aparcamiento, o tu lista de bases, lo resolverían." },
    ],
  },
  "carto-context": {
    h: "c0dac835",
    events: [
      { text: "Voy a contar residentes (Kontur Population) más tiendas, restaurantes, turismo y luz nocturna (Spatial Features) dentro de 3 anillos de hexágonos alrededor de cada hub, unos 2,5 km a la redonda." },
      null,
      null,
      null,
      { text: "**Sur** es el núcleo comercial: la menor cantidad de residentes (~14k) pero la mayor de tiendas (2.140), lugares para comer (1.758), turismo y luz nocturna. **Norte** es lo opuesto, con ~55k residentes y solo 158 tiendas, la menor de todos los hubs. **Oeste** tiene la mayor cantidad de residentes (~70k) y unas cuatro veces el comercio de Norte. Centro (~58k residentes, 1.582 tiendas) está activo en ambos frentes, y Sureste queda en medio." },
    ],
    choices: [
      { say: "¿A cuántas personas puede llegar cada hub en 15 minutos en coche?" },
    ],
  },
  "carto-reach": {
    h: "a2bb9e7b",
    events: [
      { text: "Las calles deciden hasta dónde llegas en realidad, así que voy a obtener un área de 15 minutos en coche para cada hub y luego contar a las personas dentro." },
      { summary: "Oeste · área de 15 min en coche (GeoJSON)" },
      { summary: "Centro · área de 15 min en coche (GeoJSON)" },
      { summary: "Sureste · área de 15 min en coche (GeoJSON)" },
      { summary: "Sur · área de 15 min en coche (GeoJSON)" },
      { summary: "Norte · área de 15 min en coche (GeoJSON)" },
      null,
      { summary: "1,65M residentes a 15 min · 80% de 2,07M" },
      { title: "Áreas de 15 minutos en coche desde cada hub", summary: "1,65M residentes (80%) a 15 min de un hub", disclosure: "Dibujado por el asistente a partir de los resultados de consultas CARTO de esta sesión · residentes: Kontur Population (H3 res 8) · áreas de conducción simplificadas · instantánea del 1 oct 2026, ~02:08 UTC" },
      { title: "Residentes alcanzables en 15 min en coche (miles)" },
      { text: "**Unas 1,65M personas viven a menos de 15 minutos en coche de al menos un hub**, aproximadamente el 80% de los 2,07M del área que estoy contando: celdas pobladas dentro de 55 anillos H3 (unos 50 km) del centro de Las Vegas. Centro alcanza a más (680k) y Norte a menos (405k).\n\nLas cifras por hub suman más de 1,65M porque las áreas de conducción se solapan." },
    ],
    choices: [
      { say: "¿Dónde añadiría más alcance un sexto hub?" },
    ],
  },
  "carto-site": {
    h: "bd0d7b3f",
    events: [
      { text: "Revisar los tiempos de conducción de cada punto posible tomaría cientos de llamadas, así que lo hago en dos pasos. Primero, una preselección rápida por distancia en línea recta: considero sin cobertura un vecindario si está a más de 8 km del hub más cercano, y califico cada punto posible según cuántos residentes sin cobertura viven a menos de 8 km. Luego, una revisión real de tiempo de conducción para el ganador." },
      null,
      { text: "Para ver por qué ganan esas cinco, traigo cada celda con su distancia al hub más cercano y su puntuación:" },
      { summary: "2.090 celdas · distancia al hub más cercano + puntuación" },
      null,
      null,
      { title: "Puntuación de candidatos · residentes sin cobertura a menos de 8 km", layerLabel: "H3 res 8 · puntuación de candidato" },
      { text: "Los cinco mejores son celdas vecinas a unos 2 km entre sí, y sus puntuaciones difieren menos de 2%. Así que la respuesta es esta zona de la ciudad, no una celda exacta. Reviso la mejor por tiempo de conducción:" },
      { summary: "Mejor celda · área de 15 min en coche (GeoJSON)" },
      { summary: "+181k residentes con nueva cobertura · cobertura 80% → 88,5%" },
      { title: "Sexto hub propuesto · área de 15 minutos en coche", summary: "+181k residentes nuevos a 15 min · cobertura → 88,5%", disclosure: "Dibujado por el asistente a partir de los resultados de consultas CARTO de esta sesión · residentes: Kontur Population (H3 res 8) · áreas de conducción simplificadas · instantánea del 1 oct 2026, ~02:08 UTC" },
      { text: "**La mejor zona está justo al este de Centro, alrededor de 36,17°N, 115,06°O.** Un hub ahí pondría a **181k personas más** a menos de 15 minutos en coche, llevando la cobertura del 80% al 88,5%.\n\nLos 225k y los 181k miden cosas distintas. 225k son personas a más de 8 km en línea recta de cualquier hub que viven a menos de 8 km del sitio. 181k son personas dentro de la nueva área de 15 minutos en coche que no están ya dentro de una de las cinco existentes. (Las dos medidas tampoco coinciden hoy: 8 km en línea recta desde un hub cubren el 68%; las áreas de 15 minutos en coche, cerca del 80%.)" },
    ],
  },
  "carto-data": {
    h: "a93322ae",
    events: [
      null, null, null, null, null, null, null, null, null,
      { text: "Todas las celdas coinciden, ya que las tablas de 2019 usan los mismos límites de secciones que los de tu conexión. Los comercios y restaurantes ya están en la tabla pública Spatial Features de CARTO, así que los uno por celda.\n\nUn consejo para la próxima: busca en el catálogo por lo que quieres medir, revisa la licencia y comprueba la unión antes de depender de ella." },
    ],
  },
  "carto-objective": {
    h: "72da8369",
    events: [
      null,
      null,
      { summary: "Ganador de mayores ingresos · área de 15 min en coche (GeoJSON)" },
      null,
      { text: "**El objetivo cambia la respuesta.** Para residentes sigue siendo justo al este de Centro (36,17°N, 115,06°O). Para residentes de mayores ingresos se mueve al sureste del valle, hacia Henderson (36,02°N, 115,02°O), a unos 17 km, y los comercios y restaurantes caen a unos 3 km de ahí.\n\nElegir por residentes conservaría solo el 64% de la mejor puntuación de ingresos y el 60% de la de comercios, mientras que las opciones por ingresos y por comercios conservan cada una el 92% de la otra.\n\nLa brecha también cambia: el 35,9% de los residentes de mayores ingresos vive a más de 8 km de todos los hubs, frente al 32,6% de todos los residentes y el 19,4% de los comercios y restaurantes. Una nota: el ingreso es el promedio de cada sección censal, así que describe la zona y no a las personas que atenderán tus conductores, y he dejado fuera raza y etnia a propósito." },
    ],
  },
  "carto-explore": {
    h: "c4d8376c",
    events: [
      null,
      null,
      { summary: "áreas de conducción y rutas activas · quedan 14.991 de 15.000 llamadas del servicio de ubicación" },
      null,
      null,
      { text: "Tienes una conexión de CARTO que puede ejecutar SQL espacial, un servicio de tiempos de conducción con casi toda su cuota anual disponible y un catálogo público de unos 151 datasets demográficos (más los premium, si los compras).\n\nCombinado con Geotab, la gente suele empezar por una de tres cosas: dónde está la flota y dónde se agrupa, dónde ayudaría más un hub nuevo o si sus propios viajes pueden responderlo." },
    ],
  },
  "carto-customers": {
    h: "f6ec834e",
    events: [
      null, null, null, null, null, null,
      { summary: "distancia media 5,72 km → 3,16 km con el mejor hub nuevo" },
      null,
      { text: "**Un hub nuevo cerca de Green Valley, en Henderson (36,02°N, 115,08°O), reduce la distancia media que recorre un pedido de 5,72 km a 3,16 km, cerca de un 45% menos.** El mapa muestra por qué: tus cuentas de Henderson son el 37% de los pedidos y están a 6 a 10 km del hub más cercano, mientras que los clientes del centro y de Summerlin ya están a unos 2,5 km de uno.\n\nEsa es también la esquina del valle que señalaron los datos públicos, así que tres objetivos independientes coinciden. Pero aquí es donde ya vendes. Para ver dónde podrías vender más, añadiría los datos demográficos." },
    ],
  },
  "carto-potential": {
    h: "96985ad7",
    events: [
      null,
      { summary: "201.147 de 515.898 residentes de mayores ingresos (39%) están a más de 5 km de cualquier cliente" },
      null,
      null,
      { text: "**Dos hubs distintos, y ambos sirven.** Green Valley, en Henderson, atiende a los clientes que ya tienes y acorta un 45% el viaje medio de un pedido. El suroeste del valle (36,03°N, 115,22°O) tiene unas 4 veces más residentes de mayores ingresos sin ningún cliente cerca (43.538 vs 10.987), así que ahí es donde crecerías.\n\nEl 39% de los residentes de mayores ingresos del área vive a más de 5 km de cualquier cuenta, así que hay espacio. Muchas flotas usan el primer hub para atender ahora y el segundo como base para una campaña de ventas." },
    ],
  },
  "carto-map": {
    h: "97f4bae8",
    events: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      { text: "Lo guardé como un **mapa privado en Builder**: los vehículos (azul en marcha, rojo aparcados), los cinco hubs más el sexto sitio propuesto, y la distancia al hub más cercano. Si no apareció arriba, ábrelo desde el enlace: `https://<your-carto-workspace>/builder/<mapId>`. Compártelo desde ahí cuando estés listo.\n\nEl siguiente paso es añadir las áreas de tiempo de conducción: las guardaría en una tabla con `execute_query` y apuntaría el mapa a esa tabla." },
    ],
  },
  "carto-caveats": {
    h: "7e1f056e",
    events: [
      { text: "Algunas cosas, antes de que alguien actúe con esto:\n- **Los hubs son inferidos** a partir de una sola instantánea nocturna, no de tu lista de bases.\n- **El sexto hub es un candidato derivado del mapa, no una ubicación verificada.** La zonificación, las campas disponibles y el alquiler todavía hay que revisarlos.\n- **Solo la celda ganadora pasó por una revisión de tiempo de conducción.** Las otras cuatro son celdas vecinas con casi la misma puntuación, así que trátalo como una zona, no como una dirección.\n- **La cobertura cuenta residentes, no clientes.** Si tienes ubicaciones de pedidos o de clientes, usa esas.\n- **La cobertura se cuenta por el centro del hexágono.** Un hexágono cuenta como cubierto si su centro está dentro de un área de conducción, así que los bordes son aproximados.\n- **Los tiempos de conducción suponen un coche, 15 minutos y una sola hora del día.** El tráfico cambia según la hora, así que vuelve a ejecutarlo para tu hora de más actividad." },
    ],
  },
  },
};
