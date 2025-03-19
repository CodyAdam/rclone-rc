import { writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import commandsRaw from './api/commands.json';
import { rcloneContract } from './index';

const commandSchema = z.object({
  AuthRequired: z.boolean(),
  Help: z.string(),
  NeedsRequest: z.boolean(),
  NeedsResponse: z.boolean(),
  Path: z.string(),
  Title: z.string(),
});

type Command = z.infer<typeof commandSchema>;

const commands = z.object({ commands: z.array(commandSchema) }).parse(commandsRaw).commands;

function getIfImplemented(command: Command) {
  const entry = Object.entries(rcloneContract).find(
    ([_, endpoint]) => endpoint.path === `/${command.Path}`,
  );

  if (entry) {
    const [key, val] = entry;
    return {
      ...val,
      alias: key,
    };
  }

  return undefined;
}

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const done = Object.keys(rcloneContract).length;
const total = commands.length;

const document = `

# Current completed endpoints

Percentage complete: ${((done / total) * 100).toFixed(2)}% (${done}/${total})

| Endpoint | Implemented | Alias | Description |
|----------|-------------|-------|-------------|
${commands
  .map(command => {
    const endpoint = getIfImplemented(command);
    return `| ${command.Path} | ${endpoint ? '✅' : '❌'} | ${endpoint?.alias ? `\`api.${endpoint.alias}()\`` : ''} | ${command.Title} |`;
  })
  .join('\n')}
`;

// Save regular contract to file
const outputPath = resolve(__dirname, '../current-status.md');
await writeFile(outputPath, document);
console.log(`Current status saved to ${outputPath}`);
