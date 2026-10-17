**Terminal** — console block with prompt input (onCommand → output).

```jsx
<Terminal welcome="Type `help`." onCommand={(c)=>c==="help"?"wish · status · clear":"command not found: "+c}/>
```

Enter executes a nonblank trimmed command and does not submit an enclosing
form. IME composition/229 events do not execute commands. Numeric zero is valid
welcome/output content; null, undefined, booleans and empty strings add no output.

Keyboard: Enter executes a trimmed nonblank command through the synchronous caller callback, with IME composition guarded. It stores command/output history locally; welcome seeds the initial history and later welcome changes do not reset it.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Prompt, welcome, output and custom title are caller-owned. This is a command UI; any command execution is implemented by the caller.

Source evidence: `Terminal.jsx` and `Terminal.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
