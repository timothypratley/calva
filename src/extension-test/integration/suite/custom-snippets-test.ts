import * as assert from 'assert';
import * as customSnippets from '../../../custom-snippets';

suite('Custom Snippets Tests', () => {
  test('evaluateCustomCodeSnippetCommand with resultIsCommand', () => {
    const snippet: customSnippets.SnippetDefinition = {
      snippet: '(+ 1 2)',
      ns: 'user',
      repl: 'clj',
      resultIsCommand: true,
      commandThen: 'identity',
    };

    const result = customSnippets.evaluateCustomCodeSnippetCommand(snippet);

    assert.strictEqual(result, '3');
  });

  test('evaluateCustomCodeSnippetCommand without resultIsCommand', () => {
    const snippet: customSnippets.SnippetDefinition = {
      snippet: '(+ 1 2)',
      ns: 'user',
      repl: 'clj',
      resultIsCommand: false,
    };

    const result = customSnippets.evaluateCustomCodeSnippetCommand(snippet);

    assert.strictEqual(result, '3');
  });
});
