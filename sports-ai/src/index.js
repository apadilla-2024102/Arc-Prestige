import 'dotenv/config';
import { createSportsChat } from './config/ai.js';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const EXIT_COMMANDS = ['salir', 'exit', 'quit'];

/**
 * Imprime el mensaje de bienvenida al iniciar la aplicación.
 */
function printWelcome() {
  console.log('\n=======================================');
  console.log('🏆  SportsBot - Tu IA experta en deportes');
  console.log('=======================================');
  console.log('Pregúntame lo que quieras sobre fútbol, baloncesto, tenis, F1 y más.');
  console.log(`Escribe "salir" en cualquier momento para terminar.\n`);
}

/**
 * Función principal: inicializa el chat y el bucle de conversación en consola.
 */
async function main() {
  printWelcome();

  const rl = readline.createInterface({ input, output });
  const chat = createSportsChat();

  let seguir = true;

  while (seguir) {
    const pregunta = await rl.question('🧑 Tú: ');
    const textoNormalizado = pregunta.trim().toLowerCase();

    if (EXIT_COMMANDS.includes(textoNormalizado)) {
      seguir = false;
      console.log('\n🏁 SportsBot: ¡Nos vemos en la próxima jugada! Gracias por venir a charlar de deportes. 👋\n');
      break;
    }

    if (textoNormalizado === '') {
      console.log('⚠️  Escribe algo para que podamos hablar de deportes.\n');
      continue;
    }

    try {
      console.log('⏳ SportsBot está pensando su jugada...\n');
      const result = await chat.sendMessage(pregunta);
      const respuesta = result.response.text();
      console.log(`🏅 SportsBot: ${respuesta}\n`);
    } catch (error) {
      console.error('❌ Ocurrió un error al consultar a la IA:', error.message);
      console.log('Intenta de nuevo con otra pregunta deportiva.\n');
    }
  }

  rl.close();
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Error fatal en la aplicación:', error);
  process.exit(1);
});
