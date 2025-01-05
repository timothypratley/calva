const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

const commands = packageJson.contributes.commands;

const sections = {
  Miscellaneous: [],
  REPL: [],
  Paredit: [],
  LSP: [],
  Formatting: [],
  Test: [],
  Evaluate: [],
  JackIn: [],
  Inspector: [],
  Conversion: [],
  Show: [],
};

commands.forEach((c) => {
  if (c.command.startsWith('paredit.')) {
    sections.Paredit.push(c);
  } else if (c.command.includes('Lsp')) {
    sections.LSP.push(c);
  } else if (c.command.startsWith('calva-fmt')) {
    sections.Formatting.push(c);
  } else if (
    c.command.toLowerCase().includes('jack') ||
    c.command.includes('.connect') ||
    c.command.includes('.start') ||
    c.command.includes('.disconnect')
  ) {
    sections.JackIn.push(c);
  } else if (
    c.command.toLowerCase().includes('repl') ||
    c.title.toLowerCase().includes('repl') ||
    c.command.includes('.show')
  ) {
    sections.REPL.push(c);
  } else if (c.command.toLowerCase().includes('test') || c.title.toLowerCase().includes('test')) {
    sections.Test.push(c);
  } else if (
    c.command.toLowerCase().includes('evalu') ||
    c.title.toLowerCase().includes('evalu') ||
    c.command.includes('refresh') ||
    c.command.includes('.interrupt') ||
    c.command.includes('.tap')
  ) {
    sections.Evaluate.push(c);
  } else if (c.command.toLowerCase().includes('inspect')) {
    sections.Inspector.push(c);
  } else if (c.command.includes('HtmlAsHiccup') || c.command.includes('convert')) {
    sections.Conversion.push(c);
  } else if (c.title.startsWith('Show')) {
    sections.Show.push(c);
  } else {
    sections.Miscellaneous.push(c);
  }
});

const generateSection = (title, commands) => {
  return `## ${title}

| Command | Title |
| :------ | :---- |
${commands.map((cmd) => `| \`${cmd.command}\` | ${cmd.title} |`).join('\n')}
`;
};

const content = `---
title: Calva Command Reference
description: All Calva commands.
---

# Calva Command Reference

Calva's commands are part of the [Calva API](api.md).
They often accept arguments of some type.

${generateSection('JackIn', sections.JackIn)}
${generateSection('Evaluate', sections.Evaluate)}
${generateSection('Test', sections.Test)}
${generateSection('Paredit', sections.Paredit)}
${generateSection('LSP', sections.LSP)}
${generateSection('Formatting', sections.Formatting)}
${generateSection('Conversion', sections.Conversion)}
${generateSection('Inspector', sections.Inspector)}
${generateSection('Show', sections.Show)}
${generateSection('REPL', sections.REPL)}
${generateSection('Miscellaneous', sections.Miscellaneous)}`;

const filename = '../docs/site/commands-reference.md';
fs.writeFileSync(path.join(__dirname, filename), content);
console.log(filename + ' has been generated.');
