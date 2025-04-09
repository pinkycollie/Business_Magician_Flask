interface BotCommand {
  command: string;
  description: string;
}

export const businessMagicianBotCommands: BotCommand[] = [
  { command: "start", description: "Begin your business journey" },
  { command: "idea", description: "Business idea generation and validation" },
  { command: "build", description: "Formation and startup resources" },
  { command: "grow", description: "Marketing and scaling strategies" },
  { command: "manage", description: "Business management tools" },
  { command: "asl", description: "Access ASL video resources" },
  { command: "vr", description: "Connect with vocational rehabilitation" },
  { command: "jobs", description: "Find qualified deaf candidates" },
  { command: "funding", description: "Discover grants and funding for deaf entrepreneurs" },
  { command: "help", description: "List all available commands" },
];

/**
 * Generates a formatted string of commands for configuring a Telegram bot via BotFather
 * @returns {string} Formatted command list
 */
export function generateBotCommandList(): string {
  return businessMagicianBotCommands
    .map(cmd => `${cmd.command} - ${cmd.description}`)
    .join('\n');
}

/**
 * Returns the BotFather configuration command to set up commands
 * @param {string} botUsername - The username of the bot to configure
 * @returns {string} Full configuration command
 */
export function getBotFatherSetCommandsInstruction(botUsername: string = 'businessmagicianbot'): string {
  const commandList = generateBotCommandList();
  return `/setcommands\n@${botUsername}\n${commandList}`;
}

/**
 * Utility function to copy the command list to clipboard
 * Note: This only works in browser environments
 */
export function copyCommandsToClipboard(): void {
  if (typeof navigator !== 'undefined') {
    const commandText = generateBotCommandList();
    navigator.clipboard.writeText(commandText)
      .then(() => {
        console.log('Bot commands copied to clipboard');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  }
}