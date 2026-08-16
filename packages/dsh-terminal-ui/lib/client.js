// dsh-terminal-ui client half — Neg Dark theme (pure black + neutral gray
// borders + muted accents, from files/gui/vicinae-theme.toml), Iosevka fonts
// everywhere, wider chat column. Injects one <style> element for the page
// lifetime; removed when the plugin unmounts.
window.__ModuleLoader__.load({
  id: "dsh-terminal-ui",
  factory: (require) => {
    const inject = [];

    // Theme tokens are declared on `body` / `body[data-ds-dark-theme]`
    // (see dsh-client-ui-theme). Re-declaring them on the same selectors in
    // a later stylesheet wins the cascade. Both light and dark slots get the
    // Neg Dark palette, so the GUI keeps the neg look in either mode.
    // `.wSkVaW_root` is the conversation-root class from
    // @deepseek-ai/dsh-client-ui-conversation (CSS module hash) — stable for
    // a pinned dsh release; re-derive from the served client bundle if it
    // stops matching after an upgrade (grep for `--dsh-chat-content-width`).
    const CSS = `
/* ── base: pure black (Neg Dark) ── */
html {
  background: #000000;
}
body {
  background: #000000;
}

/* ── Neg Dark palette (files/gui/vicinae-theme.toml) ── */
body,
body[data-ds-dark-theme] {
  --dsw-alias-bg-base: #000000;
  --dsw-alias-bg-layer-1: #080808;
  --dsw-alias-bg-layer-2: #080808;
  --dsw-alias-bg-layer-3: #101010;
  --dsw-alias-bg-overlay: #080808;
  --dsw-alias-border-l1: #333333;
  --dsw-alias-border-l2: #262626;
  --dsw-alias-border-l3: #333333;
  --dsw-alias-label-primary: #9FABBA;
  --dsw-alias-label-secondary: #7a8796;
  --dsw-alias-label-tertiary: #6a7686;
  --dsw-alias-label-caption: #6a7686;
  --dsw-alias-brand-primary: #4a4a4a;
  --dsw-alias-brand-text: #b9c4d2;
  --dsw-alias-button-primary-fill: #2a2a2a;
  --dsw-alias-button-primary-hover: #3a3a3a;
  --dsw-alias-button-primary-dimmed: #101010;
  --dsw-alias-button-elevated-fill: #101010;
  --dsw-alias-button-floating-fill: #0a0a0a;
  --dsw-alias-button-floating-hover: #141414;
  --dsw-alias-button-info-fill: #2a2a2a;
  --dsw-alias-button-info-hover: #3a3a3a;
  --dsw-alias-state-success-primary: #3a6a51;
  --dsw-alias-state-error-primary: #5a2020;
  --dsw-alias-state-warn-primary: #8a7a50;
  --dsw-alias-state-business-primary: #4a5555;
  --dsw-alias-border-l2-darkmode-thin: #333333;
  --dsw-specific-sidebar-fill: #000000;
  --dsw-specific-sidebar-nav-item-active: #141414;
  --dsw-specific-sidebar-nav-item-hover: #1a1a1a;
  --dsw-specific-bubble: #080808;
  --dsw-specific-bubble-highlight: #101010;
  --dsw-specific-input-major: #080808;
  --dsw-specific-selector: #101010;
  --dsw-specific-menu: #080808;
  --dsw-alias-markdown-code-block: #000000;
  --dsw-alias-markdown-inline-code: #101010;
  --dsw-alias-scrollbar-bg-l1: #1a1a1a;
  --dsw-alias-scrollbar-bg-l2: #222222;
  --dsw-alias-scrollbar-hover-l1: #333333;
  --dsw-alias-scrollbar-hover-l2: #3a3a3a;
  --dsw-alias-interactive-bg-hover: rgba(255, 255, 255, 0.05);
  --dsw-alias-interactive-bg-active: rgba(255, 255, 255, 0.08);
}

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
  background: #000000;
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
  background: #000000;
  border-top: 1px solid var(--dsw-alias-border-l1);
  font-family: var(--ds-font-family-code);
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
  padding: 2px 12px;
}

/* terminal-style selection */
::selection {
  background: rgba(74, 85, 85, 0.5);
  color: #e8ecef;
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
