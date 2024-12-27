---
title: Calva Flares Documentation
description: Learn how to use Calva Flares to enhance your development experience.
---

# Calva Flares

Flares are a mechanism in Calva that allow the REPL server (where your Clojure code runs) to send requests to the REPL client (your Calva IDE) to trigger specific behaviors.
They bridge the gap between user-space code and IDE features, enabling dynamic and interactive workflows.

Flares are special values that, when encountered by the IDE, prompt it to perform predefined actions such as rendering HTML, showing notifications, or visualizing data.

> **TIP:**
> Don't put flares in your project code.
> Flares are IDE specific, so they should be created by tooling code.
> Flares will be created when invoking a tool or custom action from your IDE.

## How to Create Flares

Flares take the form of a map with a single key-value pair.
The key specifies the flare is for Calva `:calva/flare`, while the value contains the details of the request.

```clojure
{:calva/flare {:type :info
               :message "Congratulations, you sent a flare!"}}
```

- **Key**: `:calva/flare` – Identifies this as a flare for Calva.
- **Value**: A map defining the specific request, such as showing a message, rendering HTML, or invoking an IDE command.

Here’s a flare to display a HTML greeting:

```clojure
{:calva/flare {:type :webview
               :html "<h1>Hello, Calva!</h1>",
               :title "Greeting"}}
```

## Typical Uses of Flares

Flares enhance your development experience by enabling IDE features directly from user-space code. Below are common use cases:

### 1. Data Visualization

Used with tools like Clay, you can render HTML, SVG, or other visual elements directly in the IDE:

```clojure
(calva.clay/webview $current-form $file)
```

Produces a flare:

```clojure
{:calva/flare {:type :webview
               :url "https://localhost:1971"}}}
```

Enabling you to create a custom action "Send to Clay" to visualize Kindly annotated visualizations.

### 2. Notifications

Test results or task completion:

```clojure
{:calva/flare {:type :info
               :message "Tests Passed 🎉"}}}
```

### 3. VSCode Commands

Developers can define custom workflows or integrate with external tools:

```clojure
{:calva/flare {:type :command
               :command "workbench.action.toggleLightDarkThemes" }}
```

### 4. Debugging and Status Updates

Send contextual data back to the IDE for live updates or inline annotations.

## Why Use Flares?

Flares enhance the feedback loop between your code and the IDE, reducing context switching and enabling a more interactive development experience.

### Key Benefits

- **Immediate Feedback**: See results, warnings, or visualizations inline as part of your workflow.
- **Custom Workflows**: Tailor IDE behavior to suit your needs using tools like Clay or by creating custom flares.
- **IDE-Specific Features**: Leverage the unique capabilities of Calva while maintaining the flexibility to extend or modify functionality.

## Allowed Commands

Calva supports a predefined set of flare actions and commands that are allowed.
If you want to access other commands, enable them in settings.

Be mindful that flares are values, and values may originate from sources outside of your code.
For example if you read a value out of a logfile into a map, it could be a flare!

If you want to experiment with new flare handlers, consider using Joyride to inject them.

## Flare Reference

All flares may have a `:then` in them which is a fully qualified symbol of a function to invoke with the result of the processed flare.

| type | keys |
|------|-----|
| `:info` | `:message`, `items` |
| `:warn` | `:message`, `items` |
| `:error` | `:message`, `items` |
| `:webview` | `:title`, `:html`, `:url`, `:key` |
| `:command` | `:command`, `:args` |

VSCode commands aren't comprehensively documented, you'll have to discover their ids and arguments with some guesswork and research.

## Recap of how to use Flares

To start using flares in your Calva environment, follow these steps:

1. Ensure you have the latest version of Calva installed.
2. Open your Clojure project in Calva.
3. Connect to your REPL.
4. Use the provided examples to experiment with flares from the REPL.
5. Create custom user actions that trigger flares.
6. Request toolmakers provide flare producing actions.

Flares enhance our development experience in Calva.
Whether you're visualizing data or creating custom workflows, they open up more possibilities for interactive development.
Let us know how you’re using flares, and share your feedback to make this feature even better.
