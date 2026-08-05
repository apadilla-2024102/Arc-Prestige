# SportsAI 🏆

IA especializada exclusivamente en deportes, construida con Node.js, ES Modules y la API de Gemini (`@google/generative-ai`).

## Estructura del proyecto

```
sports-ai/
├── src/
│   ├── config/
│   │   └── ai.js         # Configuración del modelo Gemini y system prompt
│   ├── services/
│   ├── models/
│   ├── utils/
│   ├── prompts/
│   └── index.js           # Punto de entrada (consola interactiva)
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Instalación

```bash
pnpm install
```

## Configuración

1. Renombra `.env.example` a `.env`.
2. Agrega tu API Key de Gemini (obtenla en https://aistudio.google.com/app/apikey):

```
GEMINI_API_KEY=tu_api_key_aqui
```

## Uso

```bash
pnpm start
```

Escribe tus preguntas sobre deportes en la consola. Escribe `salir`, `exit` o `quit` para terminar la conversación.

## Notas

- El modelo usado por defecto es `gemini-1.5-flash`. Verifica en la documentación oficial de Google AI si hay una versión más reciente disponible.
- La IA está diseñada para responder **únicamente** temas deportivos; cualquier otra pregunta será rechazada con humor y jerga deportiva.

## Configuración segura de la clave (Windows — PowerShell)

Recomendado: no pegues la clave en chats ni en repositorios públicos. Guarda la clave en un archivo local `.env` en la carpeta `sports-ai` o exporta la variable en tu sesión.

1) Usando un archivo local `.env` (método sencillo):

 - Copia `.env.example` a `.env` y reemplaza el valor `your_gemini_api_key_here` por tu clave privada.

2) Usando PowerShell (solo sesión actual; la clave no queda en disco):

```powershell
$env:GEMINI_API_KEY = "TU_CLAVE_AQUI"
$env:GEMINI_TEMPERATURE = "0.6"
cd sports-ai
pnpm install
pnpm start
```

Si prefieres que la variable persista entre sesiones, crea el archivo `.env` en la carpeta `sports-ai` con el contenido del `.env.example`.

Si quieres que yo prepare un archivo `.env` en tu repo, confírmalo explícitamente — ten en cuenta que los repositorios pueden subirse a la nube y ese archivo contendrá un secreto.
