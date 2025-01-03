---
title: Calva Command Reference
description: All Calva commands.
---

# Calva Command Reference

Calva's commands are part of the [Calva API](api.md).
They often accept arguments of some type.

## JackIn commands

| Command | Title |
| :------ | :---- |
| `calva.startJoyrideReplAndConnect` | Start Joyride REPL and Connect |
| `calva.copyJackInCommandToClipboard` | Copy Jack-In Command Line to Clipboard |
| `calva.jackIn` | Start a Project REPL and Connect (aka Jack-In) |
| `calva.jackOut` | Stop/Kill the Project REPL started by Calva (aka Jack-Out) |
| `calva.connect` | Connect to a Running REPL Server in the Project |
| `calva.connectNonProjectREPL` | Connect to a Running REPL Server, not in Project |
| `calva.disconnect` | Disconnect from the REPL Server |
| `calva.startStandaloneHelloRepl` | Create a Getting Started REPL project |
| `calva.revealJackInTerminal` | Reveal Jack-In Terminal |

## Evaluate commands

| Command | Title |
| :------ | :---- |
| `calva.togglePrettyPrint` | Toggle Pretty Printing for All Evaluations |
| `calva.clearInlineResults` | Clear Inline Evaluation Results |
| `calva.interruptAllEvaluations` | Interrupt Running Evaluations |
| `calva.evaluateSelection` | Evaluate Current Form  (or selection, if any) |
| `calva.evaluateEnclosingForm` | Evaluate Current Enclosing Form |
| `calva.evaluateToCursor` | Evaluate From Start of List to Cursor, Closing Brackets |
| `calva.evaluateSelectionToSelectionEnd` | Evaluate Selection, Closing Brackets |
| `calva.evaluateTopLevelFormToCursor` | Evaluate From Start of Top Level Form to Cursor, Closing Brackets |
| `calva.tapSelection` | Tap Current Form (or selection, if any) |
| `calva.evaluateCurrentTopLevelForm` | Evaluate Top Level Form (defun) |
| `calva.tapCurrentTopLevelForm` | Tap Current Top Level Form |
| `calva.evaluateSelectionAsComment` | Evaluate Current Form to Comment |
| `calva.evaluateTopLevelFormAsComment` | Evaluate Top Level Form (defun) to Comment |
| `calva.copyLastResults` | Copy Last Evaluation Result to Clipboard |
| `calva.loadFile` | Load/Evaluate Current File and its Requires/Dependencies |
| `calva.refresh` | Refresh Changed Namespaces |
| `calva.refreshAll` | Refresh All Namespaces |
| `calva.evaluateFiddleForSourceFile` | Evaluate Fiddle File for Current File |

## Test commands

| Command | Title |
| :------ | :---- |
| `calva.evaluateStartOfFileToCursor` | Evaluate From Start of File to Cursor, Closing Brackets |
| `calva.runNamespaceTests` | Run Tests for Current Namespace |
| `calva.loadTestFileForCurrentNamespace` | Load/Evaluate Test File (as saved on disk) for Current Namespace |
| `calva.runAllTests` | Run All Tests |
| `calva.rerunTests` | Run Failing Tests Again |
| `calva.runTestUnderCursor` | Run Current Test |
| `calva.toggleBetweenImplAndTest` | Toggle between implementation and test |

## Paredit commands

| Command | Title |
| :------ | :---- |
| `paredit.togglemode` | Toggle Paredit Mode |
| `paredit.forwardSexp` | Move Cursor Forward Sexp/Form |
| `paredit.backwardSexp` | Move Cursor Backward Sexp/Form |
| `paredit.forwardSexpOrUp` | Move Cursor Forward or Up Sexp/Form |
| `paredit.backwardSexpOrUp` | Move Cursor Backward or Up Sexp/Form |
| `paredit.forwardDownSexp` | Move Cursor Forward Down Sexp/Form |
| `paredit.backwardDownSexp` | Move Cursor Backward Down Sexp/Form |
| `paredit.backwardUpSexp` | Move Cursor Backward Up Sexp/Form |
| `paredit.forwardUpSexp` | Move Cursor Forward Up Sexp/Form |
| `paredit.closeList` | Move Cursor Forward to List End/Close |
| `paredit.selectForwardSexp` | Select Forward Sexp |
| `paredit.selectRight` | Select Right |
| `paredit.selectBackwardSexp` | Select Backward Sexp |
| `paredit.selectForwardDownSexp` | Select Forward Down Sexp |
| `paredit.selectBackwardDownSexp` | Select Backward Down Sexp |
| `paredit.selectBackwardUpSexp` | Select Backward Up Sexp |
| `paredit.selectForwardUpSexp` | Select Forward Up Sexp |
| `paredit.selectBackwardSexpOrUp` | Select Backward Or Up Sexp |
| `paredit.selectForwardSexpOrUp` | Select Forward Or Up Sexp |
| `paredit.selectCloseList` | Select Forward to List End/Close |
| `paredit.selectOpenList` | Select Backward to List Start/Open |
| `paredit.rangeForDefun` | Select Current Top Level (aka defun) Form |
| `paredit.sexpRangeExpansion` | Expand Selection |
| `paredit.sexpRangeContraction` | Shrink Selection |
| `paredit.slurpSexpForward` | Slurp Sexp Forward |
| `paredit.slurpSexpBackward` | Slurp Sexp Backward |
| `paredit.barfSexpForward` | Barf Sexp Forward |
| `paredit.barfSexpBackward` | Barf Sexp Backward |
| `paredit.spliceSexp` | Splice Sexp |
| `paredit.splitSexp` | Split Sexp |
| `paredit.joinSexp` | Join Sexp |
| `paredit.raiseSexp` | Raise Sexp |
| `paredit.transpose` | Transpose (Swap) the two Sexps Around the Cursor |
| `paredit.dragSexprBackward` | Drag Sexp Backward |
| `paredit.dragSexprForward` | Drag Sexp Forward |
| `paredit.dragSexprBackwardUp` | Drag Sexp Backward Up |
| `paredit.dragSexprForwardDown` | Drag Sexp Forward Down |
| `paredit.dragSexprForwardUp` | Drag Sexp Forward Up |
| `paredit.dragSexprBackwardDown` | Drag Sexp Backward Down |
| `paredit.convolute` | Convolute Sexp ¯\_(ツ)_/¯ |
| `paredit.killRight` | Kill/Delete Right |
| `paredit.killLeft` | Kill/Delete Left |
| `paredit.killSexpForward` | Kill/Delete Sexp Forward |
| `paredit.killSexpBackward` | Kill/Delete Sexp Backward |
| `paredit.killListForward` | Kill/Delete Forward to End of List |
| `paredit.killListBackward` | Kill/Delete Backward to Start of List |
| `paredit.spliceSexpKillForward` | Splice & Kill/Delete Forward |
| `paredit.spliceSexpKillBackward` | Splice & Kill/Delete Backward |
| `paredit.deleteForward` | Delete Forward |
| `paredit.deleteBackward` | Delete Backward |
| `paredit.forceDeleteForward` | Force Delete Forward |
| `paredit.forceDeleteBackward` | Force Delete Backward |
| `paredit.wrapAroundParens` | Wrap Around () |
| `paredit.wrapAroundSquare` | Wrap Around [] |
| `paredit.wrapAroundCurly` | Wrap Around {} |
| `paredit.wrapAroundQuote` | Wrap Around "" |
| `paredit.rewrapParens` | Rewrap () |
| `paredit.rewrapSquare` | Rewrap [] |
| `paredit.rewrapCurly` | Rewrap {} |
| `paredit.rewrapSet` | Rewrap #{} |
| `paredit.rewrapQuote` | Rewrap "" |
| `paredit.addRichComment` | Add Rich Comment |

## LSP commands

| Command | Title |
| :------ | :---- |
| `calva.clojureLsp.showClojureLspMenu` | Show clojure-lsp menu |
| `calva.clojureLsp.download` | Download the configured Clojure LSP Server version |
| `calva.clojureLsp.start` | Start the Clojure LSP Server |
| `calva.clojureLsp.stop` | Stop the Clojure LSP Server |
| `calva.clojureLsp.restart` | Restart the Clojure LSP Server |
| `calva.clojureLsp.manage` | Manage Clojure LSP Servers |
| `calva.diagnostics.openClojureLspLogFile` | Open Clojure LSP Log File |
| `calva.diagnostics.showLspTraceLevelSettings` | Show LSP Trace Level Settings |
| `clojureLsp.refactor.cleanNs` | Clean NS Form |
| `clojureLsp.refactor.addMissingLibspec` | Add Missing Require |
| `clojureLsp.dragBackward` | Drag Sexp Backward |
| `clojureLsp.dragForward` | Drag Sexp Forward |
| `clojureLsp.refactor.cyclePrivacy` | Cycle/Toggle Privacy |
| `clojureLsp.refactor.expandLet` | Expand Let |
| `clojureLsp.refactor.inlineSymbol` | Inline Symbol |
| `clojureLsp.refactor.threadFirst` | Thread First |
| `clojureLsp.refactor.threadFirstAll` | Thread First All |
| `clojureLsp.refactor.threadLast` | Thread Last |
| `clojureLsp.refactor.threadLastAll` | Thread Last All |
| `clojureLsp.refactor.unwindAll` | Unwind All |
| `clojureLsp.refactor.unwindThread` | Unwind Thread |
| `clojureLsp.refactor.introduceLet` | Introduce let |
| `clojureLsp.refactor.moveToLet` | Move to Previous let Box |
| `clojureLsp.refactor.extractFunction` | Extract to New Function |
| `calva.diagnostics.clojureLspServerInfo` | Clojure-lsp Server Info |

## Formatting commands

| Command | Title |
| :------ | :---- |
| `calva-fmt.formatCurrentForm` | Format Current Form |
| `calva-fmt.alignCurrentForm` | Format and Align Current Form (recursively, experimental) |
| `calva-fmt.trimCurrentFormWhiteSpace` | Format Current Form and trim space between forms |
| `calva-fmt.inferParens` | Infer Parens (from the indentation) |
| `calva-fmt.tabIndent` | Indent Line |
| `calva-fmt.tabDedent` | Dedent Line |

## Conversion commands

| Command | Title |
| :------ | :---- |
| `calva.convertJs2Cljs` | Convert JavaScript code to ClojureScript |
| `calva.convertDart2Clj` | Convert Dart code to Clojure/ClojureDart |
| `calva.convertHtml2Hiccup` | Convert HTML code to Hiccup |
| `calva.pasteHtmlAsHiccup` | Paste HTML code as Hiccup |
| `calva.copyHtmlAsHiccup` | Copy HTML code as Hiccup |

## Inspector commands

| Command | Title |
| :------ | :---- |
| `calva.clearInspector` | Clear All Inspector Items |
| `calva.clearInspectorItem` | Clear Inspector Item |
| `calva.copyInspectorItem` | Copy Inspector Item |
| `calva.inspectItem` | Inspect Item |
| `calva.pasteAsInspectorItem` | Paste as Inspector Item |
| `calva.addToInspector` | Add Selection or Current Form to Inspector |
| `calva.revealInspector` | Reveal Inspector |

## Show commands

| Command | Title |
| :------ | :---- |
| `calva.info` | Show Information Message |
| `calva.warn` | Show Warning Message |
| `calva.error` | Show Error Message |
| `calva.webview` | Show Webview |

## REPL commands

| Command | Title |
| :------ | :---- |
| `calva.prettyPrintReplaceCurrentForm` | Replace Current Form (or Selection) with Pretty Printed Form |
| `calva.openUserConfigEdn` | Open REPL snippets User config.edn |
| `calva.rereadUserConfigEdn` | Refresh REPL snippets from User config.edn |
| `calva.diagnostics.toggleNreplLoggingEnabled` | Toggle nREPL Logging Enabled |
| `calva.toggleEvaluationSendCodeToOutputWindow` | Toggle also sending evaluated code to the REPL Window |
| `calva.showReplMenu` | Open the REPL Menu (Start/Connect a REPL, etc.) |
| `calva.toggleCLJCSession` | Toggle the REPL Connection (clj or cljs) used for CLJC Files |
| `calva.evaluateSelectionReplace` | Evaluate Current Form and Replace it with the Result |
| `calva.printLastStacktrace` | Print Last Stacktrace to REPL Window |
| `calva.requireREPLUtilities` | Require (refer) REPL utilities, like (doc) etcetera, into Current Namespace |
| `calva.runCustomREPLCommand` | Run Custom REPL Command |
| `calva.showOutputChannel` | Show/Open the Calva says Output Channel |
| `calva.showOutputTerminal` | Show/Open the Calva Output Terminal |
| `calva.showResultOutputDestination` | Show/Open the result output destination |
| `calva.showReplWindow` | Show/Open REPL Window |
| `calva.showFileForOutputWindowNS` | Show File for the Current REPL Window Namespace |
| `calva.setOutputWindowNamespace` | Switch Namespace in REPL Window to Current Namespace |
| `calva.sendCurrentFormToOutputWindow` | Send Current Form to REPL Window |
| `calva.sendCurrentTopLevelFormToOutputWindow` | Send Current Top Level Form to REPL Window |
| `calva.showPreviousReplHistoryEntry` | Show Previous REPL History Entry |
| `calva.showNextReplHistoryEntry` | Show Next REPL History Entry |
| `calva.clearReplHistory` | Clear REPL History |

## Miscellaneous commands

| Command | Title |
| :------ | :---- |
| `calva.activateCalva` | Activate the Calva Extension |
| `calva.diagnostics.printTextNotationFromDocument` | Print TextNotation from the current document to Calva says |
| `calva.diagnostics.createDocumentFromTextNotation` | Create a new Clojure Document from TextNotation |
| `calva.linting.resolveMacroAs` | Resolve Macro As |
| `calva.openCalvaDocs` | Open Documentation (calva.io) |
| `calva.debug.instrument` | Instrument Top Level Form for Debugging |
| `calva.createMinimalProject` | Create a mini Clojure project |
| `calva.continueComment` | Continue Comment (add a commented line below). |
| `calva.switchCljsBuild` | Select CLJS Build Connection |
| `calva.toggleKeybindingsEnabled` | Toggle Keybindings Enabled |
| `calva.selectCurrentForm` | Select Current Form |
| `calva.openFiddleForSourceFile` | Open Fiddle File for Current File |
| `calva.openSourceFileForFiddle` | Open Source File for Current Fiddle File |
| `calva.printClojureDocsToOutputWindow` | Print clojuredocs.org examples to OutputWindow |
| `calva.printClojureDocsToRichComment` | Print clojuredocs.org examples to Rich Comment |
