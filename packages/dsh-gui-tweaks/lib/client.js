// dsh-gui-tweaks client half — browser GUI behavior tweaks for the dsh web
// profile. Pure DOM behavior on top of the stock UI; no upstream bundles are
// touched (the @deepseek-ai store is immutable, so this lives in a plain
// profile plugin, same as dsh-terminal-ui).
//
//   1) Question dialogs with numbered options answer on the digit keys, from
//      anywhere in the page — no focus inside the dialog needed. The dialog
//      shows numbers 1..N next to single-select options; pressing the digit
//      activates that option immediately (the flow auto-advances/submits).
//      Enter confirms the current selection the same way: it clicks the
//      primary footer action (Next/Submit), which stays disabled until a
//      question is answered, so Enter without a selection does nothing.
//   2) Bash tool rows expand by default: each bash call renders as a
//      collapsed one-line row and opens on click; every expandable bash row
//      is clicked once when it first appears. Rows the user later collapses
//      by hand stay collapsed (same element is remembered, only fresh mounts
//      are re-expanded).
//   3) The bash terminal output height cap (224px, internal scroll) is
//      removed, so the whole command output is visible in the card.
//   4) The composer input is focused by default: on tab/window focus
//      (returning to the app), when a fresh editable composer mounts
//      (initial load, workspace selection, session switch), and when its
//      readonly/disabled state clears. Focus is never yanked away from an
//      open modal dialog or from another field the user is typing in.
//   5) todo_write calls render as a todo list card: status glyphs per item
//      (done / in progress / pending), counts, a thin progress bar and the
//      tool's result line once the call settles — instead of the stock
//      one-line "Completed 3/8" summary row with raw JSON below. Registered
//      into the Tool-owned keyed `tool.call.toolview` slot at a lower
//      priority than the built-in todo row, so this card wins the keyed hit.
//   6) ask_user_question calls render as a question card: every question
//      with its header, text and options; once the call settles, the chosen
//      options are highlighted (✓) and unanswered questions are marked —
//      instead of the stock one-line row whose body is the raw JSON result.
//      Same keyed-slot shadowing as the todo card (priority -10).
//
// All selectors use stable data attributes stamped by the upstream
// components, so they survive bundle upgrades (unlike CSS-module hashes).
window.__ModuleLoader__.load({
  id: "dsh-gui-tweaks",
  factory: (require) => {
    // The todo-list card registers into the Tool-owned keyed toolview slot,
    // so the slots service is required at apply time.
    const inject = ["slots"];

    // ---- 1) digit keys answer numbered question dialogs ----
    // Ask-user questions render one option button per entry, numbered 1..N.
    // The dialog frame is stamped `data-question-key`; multi-select questions
    // show checkboxes without numbers and are intentionally not bound.
    const DIGIT_OPTION_INDEX = Object.freeze({
      1: 0,
      2: 1,
      3: 2,
      4: 3,
      5: 4,
      6: 5,
      7: 6,
      8: 7,
      9: 8,
    });

    function onQuestionKeyDown(event) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return;
      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName;
        // Never hijack digits while the user is typing (composer, custom input).
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return;
      }
      const frame = document.querySelector("[data-question-key]");
      if (frame === null) return;

      // Enter confirms the current selection by clicking the primary footer
      // action (Next/Submit). It is disabled until the question is answered,
      // so Enter without a selection is a no-op. stopPropagation keeps the
      // event from also reaching an option button (whose own Enter handler
      // would submit again) when focus happens to sit on one.
      if (event.key === "Enter") {
        // Primary footer action (Next/Submit): structurally the last button
        // of the footer actions row; fall back to the last button in the
        // dialog DOM, which is the same Submit in the stock layout.
        const submit = frame.querySelector(
          "footer > div:last-child > button:last-child"
        ) ?? Array.from(frame.querySelectorAll("button")).at(-1);
        if (submit === null || submit.disabled) return;
        event.preventDefault();
        event.stopPropagation();
        submit.click();
        return;
      }

      const index = DIGIT_OPTION_INDEX[event.key];
      if (index === undefined) return;
      const option = frame.querySelectorAll('button[role="radio"]')[index];
      if (option === undefined || option.disabled) return;
      event.preventDefault();
      option.click();
    }

    // ---- 2) bash tool rows expand by default ----
    const BASH_ROW_SELECTOR = '[data-sample="bash"][data-expandable][aria-expanded="false"]';
    const handledRows = new WeakSet();

    function expandBashRows() {
      for (const row of document.querySelectorAll(BASH_ROW_SELECTOR)) {
        if (handledRows.has(row)) continue;
        handledRows.add(row);
        row.click();
      }
    }

    // ---- 3) bash terminal output uncapped ----
    // The bash sample stylesheet caps the terminal output at 224px via
    // --dsl-terminal-output-max-height on the terminal block. Drop the cap
    // for terminals inside a bash card so the full output is visible.
    const BASH_OUTPUT_CAP_CSS = `
      div:has(> [data-sample="bash"]) [data-terminal] {
        --dsl-terminal-output-max-height: none !important;
      }
    `;

    // ---- 4) composer input focused by default ----
    // The stock app focuses the composer on session switch, but focus is lost
    // when the browser tab/window is left and returned to, and can be missed
    // while a session is busy. Re-assert focus on the editable composer
    // textarea (never the read-only workspace-picker hero) when the tab
    // becomes visible, the window regains focus, or a fresh editable composer
    // mounts / becomes editable.
    const COMPOSER_SELECTOR = '[data-composer-card] textarea[data-phase]';

    function composerTextarea() {
      for (const el of document.querySelectorAll(COMPOSER_SELECTOR)) {
        if (el instanceof HTMLTextAreaElement && !el.disabled && !el.readOnly) return el;
      }
      return null;
    }

    function focusComposer() {
      const composer = composerTextarea();
      if (composer === null) return;
      // An open modal (question dialog, settings, ...) owns the focus.
      if (document.querySelector('[role="dialog"][aria-modal="true"], [data-question-key]') !== null) return;
      const active = document.activeElement;
      if (active instanceof HTMLElement && active !== composer) {
        const tag = active.tagName;
        // Never yank focus out of another field the user is typing in.
        if (tag === "INPUT" || tag === "TEXTAREA" || active.isContentEditable) return;
      }
      composer.focus({ preventScroll: true });
    }

    const seenComposers = new WeakSet();
    function focusFreshComposer() {
      const composer = composerTextarea();
      if (composer === null || seenComposers.has(composer)) return;
      seenComposers.add(composer);
      focusComposer();
    }

    // ---- 5) todo_write calls render as a todo list card ----
    // The stock UI shows todo_write as a one-line row ("Completed 3/8 · …")
    // whose expanded body is raw JSON. This registers a keyed
    // `tool.call.toolview` entry at a lower priority than the built-in todo
    // row (priority 0), so the keyed slot elects this card instead. The card
    // shows the whole plan at a glance: a status glyph per item, done/total
    // counts, a thin progress bar, a running pulse while the call is in
    // flight, and the tool's result line once it settles.
    const React = require("react");
    const h = React.createElement;

    const TODO_STATUS_META = Object.freeze({
      completed: { label: "Готово", cls: "gt-todo-done" },
      in_progress: { label: "В работе", cls: "gt-todo-active" },
      pending: { label: "Ожидает", cls: "gt-todo-pending" },
    });

    function todoStatus(item) {
      return typeof item?.status === "string" && TODO_STATUS_META[item.status] !== undefined
        ? item.status
        : "pending";
    }

    function parseTodoArgs(argsRaw) {
      if (typeof argsRaw !== "string" || argsRaw === "") return null;
      try {
        const parsed = JSON.parse(argsRaw);
        if (parsed === null || typeof parsed !== "object" || !Array.isArray(parsed.todos)) return null;
        return parsed.todos.filter(
          (item) => item !== null && typeof item === "object" && typeof item.content === "string"
        );
      } catch {
        return null;
      }
    }

    function todoResultText(block) {
      if (!("kind" in block) || !Array.isArray(block.content)) return null;
      const text = block.content
        .filter(
          (b) => b !== null && typeof b === "object" && b.type === "text" && typeof b.text === "string"
        )
        .map((b) => b.text)
        .join("\n")
        .trim();
      return text === "" ? null : text;
    }

    function TodoListCard({ block, inspect }) {
      const done = "kind" in block;
      const argsRaw = (done ? block.call?.argsRaw : block.argsRaw) ?? "";
      const items = parseTodoArgs(argsRaw);

      if (items === null) {
        // Malformed/absent args: compact fallback so the row never goes blank.
        return h(
          "div",
          { className: "gt-todo gt-todo-fallback", "data-state": done ? "ok" : "running" },
          h("span", { className: "gt-todo-heading" }, "Список задач"),
          argsRaw !== ""
            ? h("code", null, argsRaw.slice(0, 80))
            : h("span", { className: "gt-todo-empty" }, "Задач пока нет")
        );
      }

      let doneCount = 0;
      let activeCount = 0;
      for (const item of items) {
        const status = todoStatus(item);
        if (status === "completed") doneCount += 1;
        else if (status === "in_progress") activeCount += 1;
      }
      const total = items.length;
      const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);
      const result = todoResultText(block);

      const rows = items.map((item, index) => {
        const meta = TODO_STATUS_META[todoStatus(item)];
        return h(
          "div",
          { key: index, className: `gt-todo-item ${meta.cls}`, title: meta.label },
          h("span", { className: "gt-todo-glyph", "aria-hidden": "true" }),
          h("span", { className: "gt-todo-text" }, item.content)
        );
      });

      return h(
        "div",
        { className: "gt-todo", "data-state": done ? "ok" : "running" },
        h(
          "div",
          { className: "gt-todo-header" },
          h("span", { className: "gt-todo-heading" }, "Список задач"),
          h("span", { className: "gt-todo-counts" }, `${doneCount}/${total}`),
          h(
            "span",
            { className: "gt-todo-track" },
            h("span", { className: "gt-todo-fill", style: { width: `${pct}%` } })
          ),
          !done ? h("span", { className: "gt-todo-running", title: "Выполняется…" }) : null,
          activeCount > 0
            ? h("span", { className: "gt-todo-active-hint", title: "В работе" })
            : null,
          typeof inspect === "function"
            ? h("button", { className: "gt-todo-inspect", onClick: inspect, title: "Подробности" }, "ⓘ")
            : null
        ),
        total === 0
          ? h("div", { className: "gt-todo-empty" }, "Задач пока нет")
          : h("div", { className: "gt-todo-items" }, rows),
        result !== null ? h("div", { className: "gt-todo-result" }, result) : null
      );
    }

    const TODO_CARD_CSS = `
      .gt-todo {
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 12px;
        background: var(--dsw-alias-bg-layer-2);
        margin: 4px 0;
        overflow: hidden;
        font: var(--dsw-font-xs-13);
        color: var(--dsw-alias-label-primary);
      }
      .gt-todo-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        border-bottom: 1px solid var(--dsw-alias-border-l1);
      }
      .gt-todo-heading { font-weight: 600; white-space: nowrap; }
      .gt-todo-counts {
        color: var(--dsw-alias-label-secondary);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
      .gt-todo-track {
        flex: 1;
        min-width: 40px;
        height: 4px;
        border-radius: 999px;
        background: var(--dsw-alias-bg-layer-3);
        overflow: hidden;
      }
      .gt-todo-fill {
        display: block;
        height: 100%;
        border-radius: 999px;
        background: var(--dsw-alias-state-success-primary);
        transition: width 0.3s ease;
      }
      .gt-todo-running {
        flex: none;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--dsw-alias-state-warn-primary);
        animation: gt-todo-pulse 1.2s ease-in-out infinite;
      }
      .gt-todo-active-hint {
        flex: none;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--dsw-alias-state-warn-primary);
        opacity: 0.7;
      }
      @keyframes gt-todo-pulse {
        0%, 100% { opacity: 0.35; }
        50% { opacity: 1; }
      }
      .gt-todo-inspect {
        flex: none;
        border: 0;
        background: transparent;
        cursor: pointer;
        color: var(--dsw-alias-label-tertiary);
        font-size: 13px;
        line-height: 1;
        padding: 2px 4px;
        border-radius: 6px;
      }
      .gt-todo-inspect:hover { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-3); }
      .gt-todo-items {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 8px 12px 10px;
      }
      .gt-todo-item { display: flex; align-items: baseline; gap: 8px; line-height: 1.45; }
      .gt-todo-text { overflow-wrap: anywhere; }
      .gt-todo-glyph {
        flex: none;
        width: 14px;
        height: 14px;
        align-self: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .gt-todo-done .gt-todo-text {
        color: var(--dsw-alias-label-tertiary);
        text-decoration: line-through;
      }
      .gt-todo-done .gt-todo-glyph {
        border-radius: 50%;
        background: var(--dsw-alias-state-success-primary);
      }
      .gt-todo-done .gt-todo-glyph::after {
        content: "";
        width: 4px;
        height: 7px;
        border: solid var(--dsw-alias-bg-base);
        border-width: 0 2px 2px 0;
        transform: rotate(45deg) translate(-1px, -1px);
      }
      .gt-todo-active .gt-todo-text { font-weight: 500; }
      .gt-todo-active .gt-todo-glyph {
        border-radius: 50%;
        background: var(--dsw-alias-state-warn-primary);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-warn-primary) 22%, transparent);
        animation: gt-todo-pulse 1.2s ease-in-out infinite;
      }
      .gt-todo-pending .gt-todo-glyph {
        border: 1.5px solid var(--dsw-alias-label-tertiary);
        border-radius: 50%;
      }
      .gt-todo-empty {
        padding: 10px 12px;
        color: var(--dsw-alias-label-tertiary);
      }
      .gt-todo-result {
        padding: 7px 12px 9px;
        color: var(--dsw-alias-label-secondary);
        border-top: 1px solid var(--dsw-alias-border-l1);
        overflow-wrap: anywhere;
      }
      .gt-todo-fallback { display: flex; align-items: center; gap: 8px; padding: 8px 12px; }
      .gt-todo-fallback code {
        font-family: var(--ds-font-family-code);
        color: var(--dsw-alias-label-tertiary);
        overflow-wrap: anywhere;
      }
    `;

    // ---- 6) ask_user_question calls render as a question card ----
    // Same idea as the todo card: the stock UI shows ask_user_question as a
    // one-line row ("Question · Waiting for answer…") whose expanded body is
    // the raw JSON result. This card shows every question with its options;
    // once the call settles, the chosen options are highlighted, custom
    // answers are shown, and unanswered questions are marked "Без ответа".
    // The tool's result text is JSON.stringify({answers: [...]}), so answers
    // are recovered by parsing it back.
    function parseAskArgs(argsRaw) {
      if (typeof argsRaw !== "string" || argsRaw === "") return null;
      try {
        const parsed = JSON.parse(argsRaw);
        if (parsed === null || typeof parsed !== "object" || !Array.isArray(parsed.questions)) return null;
        return parsed.questions.filter(
          (q) => q !== null && typeof q === "object" && typeof q.question === "string"
        );
      } catch {
        return null;
      }
    }

    function parseAskAnswers(block) {
      if (!("kind" in block) || !Array.isArray(block.content)) return null;
      const text = block.content
        .filter(
          (b) => b !== null && typeof b === "object" && b.type === "text" && typeof b.text === "string"
        )
        .map((b) => b.text)
        .join("\n")
        .trim();
      if (text === "") return null;
      try {
        const parsed = JSON.parse(text);
        if (parsed !== null && typeof parsed === "object" && Array.isArray(parsed.answers)) {
          return parsed.answers.filter(
            (a) => a !== null && typeof a === "object" && typeof a.id === "string"
          );
        }
      } catch {
        /* malformed result — fall through */
      }
      return null;
    }

    function AskQuestionCard({ block, inspect }) {
      const done = "kind" in block;
      const argsRaw = (done ? block.call?.argsRaw : block.argsRaw) ?? "";
      const questions = parseAskArgs(argsRaw);

      if (questions === null) {
        // Malformed/absent args: compact fallback so the row never goes blank.
        return h(
          "div",
          { className: "gt-ask gt-ask-fallback", "data-state": done ? "ok" : "running" },
          h("span", { className: "gt-ask-heading" }, "Вопрос"),
          argsRaw !== ""
            ? h("code", null, argsRaw.slice(0, 80))
            : h("span", { className: "gt-ask-empty" }, "Вопросов нет")
        );
      }

      const answers = done ? parseAskAnswers(block) : null;
      const answerMap = new Map();
      if (answers !== null) for (const answer of answers) answerMap.set(answer.id, answer);
      let answeredCount = 0;
      for (const q of questions) if (answerMap.has(q.id)) answeredCount += 1;
      const total = questions.length;
      const pct = total === 0 ? 0 : Math.round((answeredCount / total) * 100);

      const blocks = questions.map((q, qi) => {
        const answer = answerMap.get(q.id);
        const opts = Array.isArray(q.options)
          ? q.options.filter((o) => o !== null && typeof o === "object" && typeof o.label === "string")
          : [];
        const selected = answer !== undefined && Array.isArray(answer.selected) ? answer.selected : [];
        const custom = answer !== undefined && typeof answer.custom === "string" ? answer.custom : null;
        const multi = q.multi_select === true;

        const optionRows = opts.map((o, oi) => {
          const chosen = selected.includes(o.label);
          return h(
            "div",
            { key: oi, className: `gt-ask-option${chosen ? " gt-ask-chosen" : ""}` },
            h("span", { className: `gt-ask-glyph${multi ? " gt-ask-multi" : ""}`, "aria-hidden": "true" }),
            h("span", { className: "gt-ask-opt-label" }, o.label),
            typeof o.description === "string" && o.description !== ""
              ? h("span", { className: "gt-ask-opt-desc" }, o.description)
              : null
          );
        });

        return h(
          "div",
          { key: q.id ?? qi, className: "gt-ask-question" },
          typeof q.header === "string" && q.header !== ""
            ? h("div", { className: "gt-ask-qheader" }, q.header)
            : null,
          h("div", { className: "gt-ask-qtext" }, q.question),
          optionRows.length > 0
            ? h("div", { className: "gt-ask-options" }, optionRows)
            : h("div", { className: "gt-ask-qanswer" }, custom !== null ? custom : (done ? "—" : null)),
          done && custom !== null && opts.length > 0
            ? h("div", { className: "gt-ask-custom" }, `Свой ответ: ${custom}`)
            : null,
          done && answer === undefined
            ? h("div", { className: "gt-ask-unanswered" }, "Без ответа")
            : null
        );
      });

      return h(
        "div",
        { className: "gt-ask", "data-state": done ? "ok" : "running" },
        h(
          "div",
          { className: "gt-ask-header" },
          h("span", { className: "gt-ask-heading" }, "Вопрос"),
          h("span", { className: "gt-ask-counts" }, `${answeredCount}/${total}`),
          h(
            "span",
            { className: "gt-ask-track" },
            h("span", { className: "gt-ask-fill", style: { width: `${pct}%` } })
          ),
          !done ? h("span", { className: "gt-ask-waiting" }, "Ожидает ответа…") : null,
          typeof inspect === "function"
            ? h("button", { className: "gt-ask-inspect", onClick: inspect, title: "Подробности" }, "ⓘ")
            : null
        ),
        h("div", { className: "gt-ask-body" }, blocks)
      );
    }

    const ASK_CARD_CSS = `
      .gt-ask {
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 12px;
        background: var(--dsw-alias-bg-layer-2);
        margin: 4px 0;
        overflow: hidden;
        font: var(--dsw-font-xs-13);
        color: var(--dsw-alias-label-primary);
      }
      .gt-ask-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        border-bottom: 1px solid var(--dsw-alias-border-l1);
      }
      .gt-ask-heading { font-weight: 600; white-space: nowrap; }
      .gt-ask-counts {
        color: var(--dsw-alias-label-secondary);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
      .gt-ask-track {
        flex: 1;
        min-width: 40px;
        height: 4px;
        border-radius: 999px;
        background: var(--dsw-alias-bg-layer-3);
        overflow: hidden;
      }
      .gt-ask-fill {
        display: block;
        height: 100%;
        border-radius: 999px;
        background: var(--dsw-alias-state-success-primary);
        transition: width 0.3s ease;
      }
      .gt-ask-waiting {
        color: var(--dsw-alias-state-warn-primary);
        white-space: nowrap;
        animation: gt-ask-pulse 1.2s ease-in-out infinite;
      }
      @keyframes gt-ask-pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }
      .gt-ask-inspect {
        flex: none;
        border: 0;
        background: transparent;
        cursor: pointer;
        color: var(--dsw-alias-label-tertiary);
        font-size: 13px;
        line-height: 1;
        padding: 2px 4px;
        border-radius: 6px;
      }
      .gt-ask-inspect:hover { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-3); }
      .gt-ask-body {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 8px 12px 10px;
      }
      .gt-ask-qheader {
        color: var(--dsw-alias-label-caption);
        font-size: 11px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        margin-bottom: 2px;
      }
      .gt-ask-qtext { font-weight: 500; line-height: 1.45; margin-bottom: 6px; overflow-wrap: anywhere; }
      .gt-ask-options { display: flex; flex-direction: column; gap: 4px; }
      .gt-ask-option {
        display: flex;
        align-items: baseline;
        gap: 8px;
        padding: 3px 6px;
        border-radius: 6px;
        line-height: 1.4;
      }
      .gt-ask-option.gt-ask-chosen {
        background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 12%, transparent);
      }
      .gt-ask-glyph {
        flex: none;
        width: 13px;
        height: 13px;
        align-self: center;
        border: 1.5px solid var(--dsw-alias-label-tertiary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .gt-ask-glyph.gt-ask-multi { border-radius: 4px; }
      .gt-ask-chosen .gt-ask-glyph {
        border-color: var(--dsw-alias-state-success-primary);
        background: var(--dsw-alias-state-success-primary);
      }
      .gt-ask-chosen .gt-ask-glyph::after {
        content: "";
        width: 4px;
        height: 7px;
        border: solid var(--dsw-alias-bg-base);
        border-width: 0 2px 2px 0;
        transform: rotate(45deg) translate(-1px, -1px);
      }
      .gt-ask-opt-label { overflow-wrap: anywhere; }
      .gt-ask-opt-desc { color: var(--dsw-alias-label-secondary); overflow-wrap: anywhere; }
      .gt-ask-qanswer, .gt-ask-custom, .gt-ask-unanswered {
        color: var(--dsw-alias-label-secondary);
        overflow-wrap: anywhere;
      }
      .gt-ask-unanswered { color: var(--dsw-alias-label-tertiary); }
      .gt-ask-empty {
        padding: 8px 12px;
        color: var(--dsw-alias-label-tertiary);
      }
      .gt-ask-fallback { display: flex; align-items: center; gap: 8px; padding: 8px 12px; }
      .gt-ask-fallback code {
        font-family: var(--ds-font-family-code);
        color: var(--dsw-alias-label-tertiary);
        overflow-wrap: anywhere;
      }
    `;

    function apply(ctx) {
      // Register the todo-list and question cards into the Tool-owned keyed
      // toolview slot. Lower priority than the built-in rows (0) wins each
      // keyed hit; the declaration callback defers until the slot exists, and
      // slots.register rides ctx.effect for disposal on unmount/reload.
      ctx.slots.inject("tool.call.toolview", function* () {
        yield ctx.slots.register(
          { name: "tool.call.toolview", key: "todo_write", priority: -10 },
          TodoListCard
        );
        yield ctx.slots.register(
          { name: "tool.call.toolview", key: "ask_user_question", priority: -10 },
          AskQuestionCard
        );
      });

      ctx.effect(() => {
        window.addEventListener("keydown", onQuestionKeyDown, true);

        const observer = new MutationObserver(() => {
          expandBashRows();
          focusFreshComposer();
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["readonly", "disabled"],
        });
        expandBashRows(); // catch rows already mounted before the observer
        focusFreshComposer(); // focus a composer mounted before the observer

        const onVisibilityChange = () => {
          if (!document.hidden) focusComposer();
        };
        const onWindowFocus = () => focusComposer();
        document.addEventListener("visibilitychange", onVisibilityChange);
        window.addEventListener("focus", onWindowFocus);

        const style = document.createElement("style");
        style.setAttribute("data-plugin", "dsh-gui-tweaks");
        style.textContent = BASH_OUTPUT_CAP_CSS + TODO_CARD_CSS + ASK_CARD_CSS;
        document.head.appendChild(style);

        return () => {
          window.removeEventListener("keydown", onQuestionKeyDown, true);
          observer.disconnect();
          document.removeEventListener("visibilitychange", onVisibilityChange);
          window.removeEventListener("focus", onWindowFocus);
          style.remove();
        };
      });
    }

    return { apply, inject };
  },
});
