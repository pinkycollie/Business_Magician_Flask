interface BotCommand {
  command: string;
  description: string;
}

export const businessMagicianBotCommands: BotCommand[] = [
  { command: "start", description: "Begin your business journey" },
  { command: "idea", description: "Generate and refine business ideas" },
  { command: "management", description: "Organize and manage project tasks" },
  { command: "brand", description: "Develop and establish brand identity" },
  { command: "marketing", description: "Create marketing strategies and campaigns" },
  { command: "mvp", description: "Build minimum viable products (MVPs)" },
  { command: "feedback", description: "Provide feedback on the application or services" },
  { command: "completion", description: "Manage project completion and delivery" },
  { command: "expansion", description: "Plan and execute business expansion strategies" },
  { command: "partnership", description: "Establish equity partnership agreements" },
  { command: "help", description: "Get assistance and guidance" },
  { command: "support", description: "Reach out for technical support" },
  { command: "upload", description: "Upload documents and files securely" },
  { command: "search", description: "Search for specific information or resources" },
  { command: "contact", description: "Contact support or customer service" },
  { command: "about", description: "Learn more about the application or company" },
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