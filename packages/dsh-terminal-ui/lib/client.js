// dsh-terminal-ui client half — neg glass theme: deep-navy translucent
// surfaces over the desktop wallpaper with backdrop blur, Iosevka fonts
// everywhere, wider chat column, flat terminal message pass and strict
// (reduced) radii. Injects one <style> element for the page lifetime;
// removed when the plugin unmounts.
window.__ModuleLoader__.load({
  id: "dsh-terminal-ui",
  factory: (require) => {
    const inject = [];

    // Theme tokens are declared on `body` / `body[data-ds-dark-theme]`
    // (see dsh-client-ui-theme). Re-declaring them on the same selectors in
    // a later stylesheet wins the cascade. EVERY --dsw-alias-*/--dsw-specific-*
    // dark token is overridden below (enumerated from design-platform.css) so
    // no element falls back to the stock gray palette. rgba values plus the
    // wallpaper layer give the translucent glass look; both light and dark
    // slots get the neg palette so the GUI keeps the neg look in either mode.
    // `.wSkVaW_root` is the conversation-root class from
    // @deepseek-ai/dsh-client-ui-conversation (CSS module hash) — stable for
    // a pinned dsh release; re-derive from the served client bundle if it
    // stops matching after an upgrade (grep for `--dsh-chat-content-width`).
    const CSS = `
/* ── wallpaper + base ── */
html {
  background: #040f1c;
}
body {
  background: transparent;
}
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  background: url("/terminal-ui/wallpaper") center / cover no-repeat;
}

/* ── neg palette (translucent navy glass) — full token coverage ── */
body,
body[data-ds-dark-theme] {
  /* surfaces */
  --dsw-alias-bg-base: rgba(4, 15, 28, 0.74);
  --dsw-alias-bg-layer-1: rgba(12, 28, 48, 0.68);
  --dsw-alias-bg-layer-2: rgba(16, 35, 58, 0.62);
  --dsw-alias-bg-layer-3: rgba(22, 45, 72, 0.56);
  --dsw-alias-bg-overlay: rgba(12, 28, 48, 0.88);
  --dsw-alias-bg-mask-1: rgba(0, 0, 0, 0.5);
  --dsw-alias-bg-mask-2: rgba(0, 0, 0, 0.2);
  --dsw-alias-bg-mask-3: rgba(0, 0, 0, 0.48);
  --dsw-alias-bg-mask-drop: rgba(12, 28, 48, 0.7);
  --dsw-alias-bg-mask-photo: rgba(0, 0, 0, 0.88);
  --dsw-alias-bg-module-platform: rgba(16, 35, 58, 0.7);
  --dsw-alias-bg-multi-select: rgba(16, 35, 58, 0.7);
  --dsw-alias-bg-skeleton: rgba(255, 255, 255, 0.08);

  /* borders */
  --dsw-alias-border-l1: rgba(43, 68, 98, 0.5);
  --dsw-alias-border-l2: rgba(28, 51, 78, 0.75);
  --dsw-alias-border-l2-darkmode-thin: rgba(43, 68, 98, 0.5);
  --dsw-alias-border-l3: rgba(43, 68, 98, 0.6);
  --dsw-alias-border-l4: rgba(43, 68, 98, 0.7);
  --dsw-alias-border-inverted: rgba(255, 255, 255, 0.06);
  --dsw-alias-border-inverted2: rgba(255, 255, 255, 0.08);

  /* text */
  --dsw-alias-label-primary: #a4b3c6;
  --dsw-alias-label-primary-bluish: #a4b3c6;
  --dsw-alias-label-primary-dimmed: #8fa3b8;
  --dsw-alias-label-primary-foreground: #d1e5ff;
  --dsw-alias-label-primary-inverted: #0c1c30;
  --dsw-alias-label-secondary: #6d839e;
  --dsw-alias-label-tertiary: #5c7391;
  --dsw-alias-label-caption: #4e6580;
  --dsw-alias-label-dimmed: #3a4f68;

  /* brand + buttons */
  --dsw-alias-brand-primary: #367bbf;
  --dsw-alias-brand-primary-invert: #367bbf;
  --dsw-alias-brand-primary-new-color-primary-new-color: #367bbf;
  --dsw-alias-brand-text: #d1e5ff;
  --dsw-alias-button-primary-fill: #005faf;
  --dsw-alias-button-primary-hover: #367cb0;
  --dsw-alias-button-primary-dimmed: rgba(16, 35, 58, 0.9);
  --dsw-alias-button-elevated-fill: rgba(12, 28, 48, 0.8);
  --dsw-alias-button-floating-fill: rgba(12, 28, 48, 0.8);
  --dsw-alias-button-floating-hover: rgba(16, 35, 58, 0.85);
  --dsw-alias-button-info-fill: #005faf;
  --dsw-alias-button-info-hover: #367cb0;
  --dsw-alias-button-contrast-fill: #d1e5ff;
  --dsw-alias-button-ghost-active-fill: rgba(28, 51, 78, 0.7);
  --dsw-alias-button-ghost-active-hover: rgba(43, 68, 98, 0.6);
  --dsw-alias-button-ghost-active-border: rgba(43, 68, 98, 0.8);
  --dsw-alias-button-tool-bar-fill: rgba(28, 51, 78, 0.5);
  --dsw-alias-button-tool-bar-fill-invisible: rgba(4, 15, 28, 0.4);
  --dsw-alias-button-tool-bar-hover: rgba(43, 68, 98, 0.6);

  /* states */
  --dsw-alias-state-success-primary: #37b393;
  --dsw-alias-state-success-secondary: #37b393;
  --dsw-alias-state-success-tertiary: #1c5c4c;
  --dsw-alias-state-error-primary: #d86f96;
  --dsw-alias-state-error-secondary: #d86f96;
  --dsw-alias-state-warn-primary: #c8a8ef;
  --dsw-alias-state-warn-secondary: #c8a8ef;
  --dsw-alias-state-warn-label: #c8a8ef;
  --dsw-alias-state-warn-tertiary: #5c4680;
  --dsw-alias-state-business-primary: #367bbf;
  --dsw-alias-state-business-tertiary: #16375c;

  /* interactive hovers */
  --dsw-alias-interactive-bg-hover: rgba(255, 255, 255, 0.06);
  --dsw-alias-interactive-bg-active: rgba(255, 255, 255, 0.1);
  --dsw-alias-interactive-bg-hover-accent: rgba(54, 123, 191, 0.3);
  --dsw-alias-interactive-bg-hover-danger: rgba(216, 111, 150, 0.15);
  --dsw-alias-interactive-bg-hover-solid: rgba(22, 45, 72, 0.8);

  /* markdown */
  --dsw-alias-markdown-citation: rgba(43, 68, 98, 0.6);
  --dsw-alias-markdown-code-block: rgba(0, 0, 0, 0.35);
  --dsw-alias-markdown-code-block-banner: rgba(10, 24, 42, 0.85);
  --dsw-alias-markdown-code-segment-selected: rgba(43, 68, 98, 0.6);
  --dsw-alias-markdown-code-segment-unselected: rgba(0, 0, 0, 0.35);
  --dsw-alias-markdown-inline-code: rgba(16, 35, 58, 0.7);
  --dsw-alias-markdown-placeholder: rgba(16, 35, 58, 0.7);
  --dsw-alias-markdown-tag: rgba(16, 35, 58, 0.7);

  /* scrollbars */
  --dsw-alias-scrollbar-bg-l1: rgba(12, 28, 48, 0.6);
  --dsw-alias-scrollbar-bg-l2: rgba(16, 35, 58, 0.6);
  --dsw-alias-scrollbar-hover-l1: rgba(28, 51, 78, 0.9);
  --dsw-alias-scrollbar-hover-l2: rgba(43, 68, 98, 0.9);

  /* toast / tooltip */
  --dsw-alias-toast-bg: rgba(12, 28, 48, 0.92);
  --dsw-alias-tooltip-bg: rgba(12, 28, 48, 0.92);

  /* specific surfaces */
  --dsw-specific-sidebar-fill: rgba(4, 15, 28, 0.55);
  --dsw-specific-sidebar-nav-item-active: rgba(16, 35, 58, 0.85);
  --dsw-specific-sidebar-nav-item-active-accent: rgba(22, 45, 72, 0.85);
  --dsw-specific-sidebar-nav-item-hover: rgba(28, 51, 78, 0.7);
  --dsw-specific-bubble: rgba(12, 28, 48, 0.6);
  --dsw-specific-bubble-highlight: rgba(16, 35, 58, 0.65);
  --dsw-specific-input-major: rgba(12, 28, 48, 0.7);
  --dsw-specific-login-input: rgba(4, 15, 28, 0.7);
  --dsw-specific-selector: rgba(16, 35, 58, 0.7);
  --dsw-specific-menu: rgba(12, 28, 48, 0.9);
  --dsw-specific-tip: rgba(22, 45, 72, 0.7);
}

/* ── stock statics → navy family: components that reference the base
   --dsw-static-* tokens directly (hover tooltips, trajectory accents, …)
   get the neg palette instead of the stock gray/white ── */
body,
body[data-ds-dark-theme] {
  --dsw-static-neutral-bluish-00: #eaf3ff;
  --dsw-static-neutral-bluish-50: #d1e5ff;
  --dsw-static-neutral-bluish-100: #b9c4d2;
  --dsw-static-neutral-bluish-200: #a4b3c6;
  --dsw-static-neutral-bluish-300: #8fa3b8;
  --dsw-static-neutral-bluish-400: #6d839e;
  --dsw-static-neutral-bluish-550: #36557a;
  --dsw-static-neutral-bluish-600: #2e4c6e;
  --dsw-static-neutral-bluish-700: #244060;
  --dsw-static-neutral-bluish-750: #1c3655;
  --dsw-static-neutral-bluish-800: #162d48;
  --dsw-static-neutral-bluish-850: #10233a;
  --dsw-static-neutral-bluish-875: #0c1c30;
  --dsw-static-neutral-bluish-900: #081826;
  --dsw-static-neutral-bluish-950: #040f1c;
  --dsw-static-deepseek-200: #6d9fd0;
  --dsw-static-deepseek-400: #367bbf;
  --dsw-static-deepseek-450: #367bbf;
  --dsw-static-deepseek-500: #2f6ca8;
  --dsw-static-deepseek-800: #16375c;
  --dsw-static-blue-450: #367bbf;
  --dsw-static-blue-500: #2f6ca8;
}

/* sidebar icons: force theme color — some render with a hardcoded white
   SVG fill/stroke that looks unpainted on the navy glass */
[data-pane="sidebar"] svg {
  fill: currentColor !important;
  stroke: currentColor !important;
}

/* workspace hover tooltip: theme text instead of hardcoded white */
.YDXeBa_hoverTitle {
  color: var(--dsw-alias-label-primary);
}
.YDXeBa_hoverPath,
.YDXeBa_hoverTime {
  color: var(--dsw-alias-label-secondary);
}
.YDXeBa_hoverStatus {
  color: var(--dsw-alias-label-tertiary);
}

/* ── glass blur on the columns (data-pane stamped by dsh-web-ui-all) ── */
[data-pane="conversation"],
[data-pane="sidebar"],
[class*="sidebarCol"],
[class*="centerCol"],
[class*="detailsCol"] {
  backdrop-filter: blur(14px) saturate(1.15);
  -webkit-backdrop-filter: blur(14px) saturate(1.15);
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

/* ── wider chat + strict alignment: messages, composer and dock share the
   exact chat-column width and are centered on the same axis, so left/right
   edges line up everywhere ── */
.wSkVaW_root {
  --dsh-chat-content-width: min(1184px, 100%);
  --dsh-composer-card-max-width: var(--dsh-chat-content-width);
  margin: 0 auto;
  width: 100%;
}
/* every message row (user, assistant, tool calls, compaction) in the column */
.Md3f7G_column {
  width: 100% !important;
  max-width: var(--dsh-chat-content-width) !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.Md3f7G_column > * {
  width: 100%;
  max-width: var(--dsh-chat-content-width);
  margin-left: auto;
  margin-right: auto;
}
/* composer card + its seat + dock: same column */
.pXSMma_stack,
[data-composer-seat] {
  width: 100%;
  max-width: var(--dsh-chat-content-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: 0;
  padding-right: 0;
}
._7yHdaG_dock {
  max-width: var(--dsh-chat-content-width);
}

/* ── strict: significantly reduced radii ── */
.uV2eYG_card,
.bqrRRG_card {
  border-radius: 4px;
}
button,
input,
textarea,
select {
  border-radius: 3px;
}
[class$="_menu"],
[class$="_popover"],
[class$="_tooltip"],
[class$="_panel"] {
  border-radius: 4px;
}
/* dock panel under the composer: console rows */
._7yHdaG_header,
._7yHdaG_row {
  border-radius: 3px;
  font-family: var(--ds-font-family-code);
  font-size: 12px;
  box-shadow: none;
}

/* ---- terminal pass: flat, dense, squared, 8px grid ---- */

/* message flow: denser, like terminal scrollback */
.Md3f7G_column {
  gap: 8px;
}

/* all message rows: full-width flat lines (no chat bubbles) */
.gdEzaW_userRow {
  align-items: stretch;
}
.gdEzaW_bubble {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 8px 0;
  max-width: 100%;
  font-size: 14px;
  line-height: 22px;
}

/* prompt markers by message type, in a fixed left gutter:
   ❯ user · assistant ⚠ error — like terminal prompts */
.Md3f7G_flowItem {
  position: relative;
  padding-left: 1.4em;
}
.Md3f7G_flowItem::before {
  position: absolute;
  left: 0;
  top: 4px;
  font-family: var(--ds-font-family-code);
  font-weight: 600;
}
.Md3f7G_flowItem:has(.gdEzaW_userRow)::before {
  content: "❯";
  color: var(--dsw-alias-state-success-primary);
}
.Md3f7G_flowItem:has(.Sxvs8a_root)::before {
  content: "·";
  color: var(--dsw-alias-label-tertiary);
  font-weight: 400;
}
.Md3f7G_flowItem:has(.gdEzaW_turnErrorRow)::before {
  content: "⚠";
  color: var(--dsw-alias-state-error-primary);
}

/* code blocks: terminal panes (tool panels have a real header with title) */
.ydkMvW_code {
  border-radius: 4px;
  border-left: 3px solid var(--dsw-alias-brand-primary);
  padding: 8px 16px;
  font-size: 12px;
  line-height: 19px;
}
.ydkMvW_header {
  font-family: var(--ds-font-family-code);
  font-size: 12px;
}
.ydkMvW_title::before {
  content: "❯ ";
  color: var(--dsw-alias-state-success-primary);
  font-weight: 600;
}
/* assistant-message code blocks (markdown) as terminal panes */
.Sxvs8a_root pre {
  background: rgba(0, 0, 0, 0.35);
  border-left: 3px solid var(--dsw-alias-border-l2);
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 12px;
  line-height: 19px;
}
.Sxvs8a_root code {
  font-family: var(--ds-font-family-code);
}

/* tool call rows: terminal command echo — $ cmd prefix, hairline frame */
.Md3f7G_callRow {
  border-radius: 2px;
  border-left: 2px solid var(--dsw-alias-state-business-primary);
  background: rgba(4, 15, 28, 0.45);
  padding-left: 8px;
  font-family: var(--ds-font-family-code);
  font-size: 12px;
}
.Md3f7G_callRow::before {
  content: "$ ";
  color: var(--dsw-alias-state-success-primary);
  font-weight: 600;
}

/* composer seat: terminal input divider */
[data-composer-seat] {
  border-top: 1px solid rgba(54, 123, 191, 0.4);
}

/* conversation header: minimal console title line */
.wSkVaW_header {
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  padding: 8px 32px 8px 24px;
}
.wSkVaW_header [class$="_title"],
.wSkVaW_header [class$="_subtitle"] {
  font-family: var(--ds-font-family-code);
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

/* terminal status readouts: turn status as a console status line
   (shimmer text + elapsed clock), dock band under the composer */
.Md3f7G_turnStatus {
  font-family: var(--ds-font-family-code);
  font-size: 12px;
  border-left: 2px solid var(--dsw-alias-state-success-primary);
  padding-left: 8px;
}
.Md3f7G_turnStatusClock {
  font-family: var(--ds-font-family-code);
  font-size: 11px;
}
.Md3f7G_turnStatusClock::before {
  content: "· ";
  color: var(--dsw-alias-label-tertiary);
}
._7rgC5q_anchorDock {
  background: rgba(4, 15, 28, 0.85);
  border-top: 1px solid var(--dsw-alias-border-l1);
  font-family: var(--ds-font-family-code);
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
  padding: 8px 16px;
}

/* ── strict: remaining round elements squared (avatars, pills, chips) ── */
[class*="avatar"],
[class$="_avatar"],
[class*="Pill"],
[class$="_pill"],
[class*="badge"],
[class$="_badge"],
[class*="chip"],
[class$="_chip"],
[class*="tag"],
[class$="_tag"] {
  border-radius: 4px;
}

/* terminal-style selection */
::selection {
  background: rgba(54, 123, 191, 0.45);
  color: #eaf3ff;
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
