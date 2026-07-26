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
