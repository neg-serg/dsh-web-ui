// dsh-terminal-ui client half — keeps the stock dsh dark theme (all tokens
// covered by the base theme, so no gray/black mismatches), Iosevka fonts
// everywhere, wider chat column, flat terminal message pass and strict
// (reduced) border radii. Injects one <style> element for the page lifetime;
// removed when the plugin unmounts.
window.__ModuleLoader__.load({
  id: "dsh-terminal-ui",
  factory: (require) => {
    const inject = [];

    // `.wSkVaW_root` is the conversation-root class from
    // @deepseek-ai/dsh-client-ui-conversation (CSS module hash) — stable for
    // a pinned dsh release; re-derive from the served client bundle if it
    // stops matching after an upgrade (grep for `--dsh-chat-content-width`).
    const CSS = `
/* ── fonts: Iosevka family everywhere, uniform width ── */
:root {
  --dsw-font-family: "Iosevka Proportional", "Iosevka", "Iosevka Medium", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  --ds-font-family-code: "Iosevka Proportional", "Iosevka", "Iosevka Medium", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}
body {
  --dsw-font-markdown-base: 400 14px/22px var(--dsw-font-family);
  --dsw-font-markdown-base-font-size: 14px;
  --dsw-font-markdown-base-line-height: 22px;
}
/* stray components that set their own font (inputs, buttons, textareas) */
input,
textarea,
button,
select {
  font-family: var(--dsw-font-family);
}

/* ── wider chat ── */
.wSkVaW_root {
  --dsh-chat-content-width: min(1200px, calc(100vw - 240px));
  --dsh-composer-card-max-width: calc(var(--dsh-chat-content-width) + 32px);
}

/* ── strict: significantly reduced radii ── */
.uV2eYG_card,
.bqrRRG_card {
  border-radius: 6px;
}
button,
input,
textarea,
select {
  border-radius: 4px;
}
[class$="_menu"],
[class$="_popover"],
[class$="_tooltip"],
[class$="_panel"] {
  border-radius: 6px;
}

/* ---- terminal pass: flat, dense, squared ---- */

/* message flow: denser, like terminal scrollback */
.Md3f7G_column {
  gap: 10px;
}

/* all message rows: full-width flat lines (no chat bubbles) */
.gdEzaW_userRow {
  align-items: stretch;
}
.gdEzaW_bubble {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 2px 0;
  max-width: 100%;
  font-size: 14px;
  line-height: 22px;
}
.gdEzaW_bubble::before {
  content: "❯ ";
  color: var(--dsw-alias-state-success-primary);
  font-weight: 600;
}

/* code blocks: terminal panes with a header strip */
.ydkMvW_code {
  position: relative;
  border-radius: 4px;
  border-left: 3px solid var(--dsw-alias-border-l2);
  padding: 30px 14px 12px;
  font-size: 12px;
  line-height: 19px;
}
.ydkMvW_code::before {
  content: "❯";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 22px;
  padding: 2px 10px;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.25);
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  color: var(--dsw-alias-state-success-primary);
  font-size: 12px;
  line-height: 18px;
}

/* tool call rows: flat */
.Md3f7G_callRow {
  border-radius: 2px;
}

/* composer seat: terminal input divider */
[data-composer-seat] {
  border-top: 1px solid var(--dsw-alias-border-l1);
}

/* terminal input: render text directly in the textarea instead of the
   base theme's transparent-text + backdrop layer trick (color:#0000 on the
   input, visible copy drawn by .uV2eYG_backdrop). That trick makes the
   selection highlight render on the invisible text while the visible copy
   sits on a second layer (double-shadow look) and the caret lags behind the
   backdrop repaint. Real text → normal selection and a synced caret. */
.uV2eYG_input {
  font-size: 14px;
  caret-color: var(--dsw-alias-label-primary);
  color: var(--dsw-alias-label-primary);
}
.uV2eYG_backdrop {
  display: none;
}
textarea,
input {
  caret-color: var(--dsw-alias-label-primary);
}
/* focused composer: accent frame */
.uV2eYG_card:focus-within {
  border-color: var(--dsw-alias-brand-primary);
}

/* terminal status readouts: turn status + dock band under the composer */
.Md3f7G_turnStatus {
  font-family: var(--ds-font-family-code);
  font-size: 12px;
  color: var(--dsw-alias-state-success-primary);
}
._7rgC5q_anchorDock {
  border-top: 1px solid var(--dsw-alias-border-l1);
  font-family: var(--ds-font-family-code);
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
  padding: 2px 12px;
}
`;

    function apply(ctx) {
      ctx.effect(() => {
        const style = document.createElement("style");
        style.setAttribute("data-dsh-terminal-ui", "");
        style.textContent = CSS;
        document.head.appendChild(style);
        return () => {
          style.remove();
        };
      });
    }

    return { apply, inject };
  },
});
