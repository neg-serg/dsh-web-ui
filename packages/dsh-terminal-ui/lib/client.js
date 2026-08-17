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
/* sidebar icons: force theme color — but keep the brand logo's own
   (multicolor) fills intact */
[data-pane="sidebar"] svg:not(.hHd-Xa_brand svg, .hHd-Xa_logoRow svg) {
  fill: currentColor !important;
  stroke: currentColor !important;
}

/* session stats line: console status row with a stats prefix */
.FJxK0a_root {
  display: inline-block !important;
  text-align: left;
  font-family: var(--ds-font-family-code);
  font-size: 11px;
  line-height: 20px;
  color: var(--dsw-alias-label-secondary);
  background: rgba(4, 15, 28, 0.5);
  border-top: 1px solid var(--dsw-alias-border-l1);
  padding: 6px 16px;
  overflow-x: auto;
  white-space: nowrap;
}
.FJxK0a_root::before {
  content: "stats ";
  color: var(--dsw-alias-label-caption);
}
.FJxK0a_root > span:not(.FJxK0a_sep) {
  color: var(--dsw-alias-label-secondary);
}
.FJxK0a_sep {
  color: var(--dsw-alias-label-tertiary);
  margin: 0 8px;
}

/* ── neovim-style separators: blue "/" (heirline styles.separator) ── */
/* turn stats: the "|" separator spans become a blue "/" */
.FJxK0a_sep {
  font-size: 0;
  margin: 0 4px;
}
.FJxK0a_sep::before {
  content: "/";
  font-size: 11px;
  color: var(--dsw-alias-button-info-fill);
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

/* ── glass blur on the columns (data-pane stamped by dsh-web-ui-all) ──
   NOTE: the sidebar column must NOT get a backdrop-filter. Any non-none
   backdrop-filter on an ancestor creates a containing block for position:fixed
   descendants, which traps the settings modal (rendered inside the sidebar's
   settings slot) inside the 279px sidebar and clips it to a narrow strip.
   Keep the glass on the conversation/details columns only. */
[data-pane="conversation"],
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
  --dsh-chat-content-width: 100%;
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

/* ── strict: squared (zero radius) ── */
.uV2eYG_card,
.bqrRRG_card {
  border-radius: 0;
}
button,
input,
textarea,
select {
  border-radius: 0;
}
[class$="_menu"],
[class$="_popover"],
[class$="_tooltip"],
[class$="_panel"] {
  border-radius: 0;
}
/* dock panel under the composer: console rows */
._7yHdaG_header,
._7yHdaG_row {
  border-radius: 0;
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
/* user messages span the whole chat column (stock caps them at 525px) */
.gdEzaW_userStack {
  width: 100%;
  max-width: 100%;
  align-items: stretch;
}
/* user messages: near-black terminal block, bold Fira Code */
.gdEzaW_bubble {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.92), rgba(0, 0, 0, 0.84));
  border: 1px solid #0d2b40;
  border-left: 3px solid var(--dsw-alias-state-success-primary);
  border-radius: 0;
  padding: 10px 16px;
  max-width: 100%;
  color: #dce8f5;
  font-family: "FiraCode Nerd Font", "Fira Code", var(--ds-font-family-code);
  font-weight: 600;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0.02em;
}
.gdEzaW_bubble a {
  color: var(--dsw-alias-state-business-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
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
  border-top: 1px solid #002c52;
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
  font-size: 15px;
  font-weight: 500;
  background: transparent;
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
/* composer card: fully black input surface with a dark color25 frame */
.uV2eYG_card,
.bqrRRG_card {
  background: #000000;
  border: 1px solid #002c52;
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


/* ── feature: feat-9.json ── */
.tui-export-btn {
  margin-left: auto;
  font-family: var(--ds-font-family-code);
  font-size: 12px;
  line-height: 20px;
  color: var(--dsw-alias-label-secondary);
  background: transparent;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 3px;
  padding: 2px 8px;
  cursor: pointer;
  flex: none;
  white-space: nowrap;
}
.tui-export-btn:hover {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-state-success-primary);
  background: rgba(255, 255, 255, 0.06);
}
.tui-export-btn:active {
  transform: translateY(1px);
}
/* ── feature: feat-5.json ── */
/* tui-search: Ctrl+F terminal-style find */
.tui-search {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: none;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  width: min(520px, 70vw);
  padding: 6px 12px;
  background: var(--dsw-specific-menu);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 4px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5);
  font-family: var(--ds-font-family-code);
}
.tui-search-input {
  flex: 1;
  min-width: 0;
  background: rgba(4, 15, 28, 0.6);
  color: var(--dsw-alias-label-primary);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 3px;
  padding: 3px 8px;
  font-family: var(--ds-font-family-code);
  font-size: 12px;
  line-height: 18px;
}
.tui-search-input:focus {
  outline: none;
  border-color: var(--dsw-alias-state-business-primary);
}
.tui-search-counter {
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.tui-search-hint {
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  white-space: nowrap;
}
/* match highlights on message rows (no DOM text wrapping — React-safe) */
.Md3f7G_flowItem.tui-match {
  background: rgba(54, 123, 191, 0.20);
}
.Md3f7G_flowItem.tui-match-current {
  background: rgba(54, 123, 191, 0.40);
  box-shadow: inset 3px 0 0 var(--dsw-alias-state-business-primary);
}

/* ── buttons-to-commands (step 1): hide composer "+" ──
   The + button in the input bar only toggles the command menu; typing "/"
   in the input opens the same menu, so the button is redundant. CSS-only
   hide (DOM stays intact). Selector: the input card (stable data-* hook
   from @deepseek-ai/dsh-client-ui-conversation) × the only listbox button. */
[data-composer-card] button[aria-haspopup="listbox"] {
  display: none;
}

/* ── buttons-to-commands (step 2): hide send/stop + model seat ──
   Enter sends, Esc stops, Ctrl+M opens the model picker (JS feature below).
   The aria-labels are zh-CN strings of the pinned dsh release
   ("发送消息" / "停止生成"); update them if the GUI locale changes. */
[data-composer-card] button[aria-label="发送消息"],
[data-composer-card] button[aria-label="停止生成"],
[data-composer-card] button[aria-haspopup="menu"] {
  display: none;
}

/* ── buttons-to-commands (step 4): hide message + queue action buttons ──
   Ctrl+Alt+C copies the last message, Ctrl+Alt+B branches it,
   Ctrl+Alt+E / Ctrl+Alt+Backspace edit/remove the last queued message
   (JS feature below). Scope [data-time-hover-root] × [class$="_actions"]
   keeps code-block copy buttons (deep inside the body) intact. zh-CN
   labels again; update them if the GUI locale changes. */
[data-time-hover-root] [class$="_actions"] [aria-label="复制"],
[data-time-hover-root] [class$="_actions"] [aria-label="复制成功"],
[data-time-hover-root] [class$="_actions"] [aria-label="在新对话中分支"],
button[aria-label="编辑排队消息"],
button[aria-label="删除排队消息"],
button[aria-label="插话发送"] {
  display: none;
}

/* ── buttons-to-commands (step 5): hide sidebar new-session buttons ──
   Both the brand wordmark and the labeled New Chat button carry
   新建会话; Ctrl+Alt+N starts a new session (JS feature below). */
button[aria-label="新建会话"] {
  display: none;
}

/* ── buttons-to-commands (step 5b): /new menu group title ──
   The client /new source renders as its own "/" menu group ("local");
   hide its title row so /new reads as part of the commands group. */
[data-source="local"] {
  display: none;
}

`;

    function apply(ctx) {
      ctx.effect(() => {
        const style = document.createElement("style");
        style.setAttribute("data-dsh-terminal-ui", "");
        style.textContent = CSS;
        document.head.appendChild(style);
        // Feature cleanup registry — each injected feature registers its
        // teardown here (see the tui-* feature blocks below).

        const cleanups = [];
        // ── feature: feat-5.json ──
        {
{
  // tui-search: Ctrl+F terminal-style find over message rows
  const BAR_ID = 'tui-search-bar';
  if (!document.getElementById(BAR_ID)) {
    const bar = document.createElement('div');
    bar.id = BAR_ID;
    bar.className = 'tui-search';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'tui-search-input';
    input.setAttribute('placeholder', 'поиск в чате…');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('autocomplete', 'off');
    const counter = document.createElement('span');
    counter.className = 'tui-search-counter';
    const hint = document.createElement('span');
    hint.className = 'tui-search-hint';
    hint.textContent = 'Enter — дальше · Esc — закрыть';
    bar.appendChild(input);
    bar.appendChild(counter);
    bar.appendChild(hint);
    document.body.appendChild(bar);

    let matches = [];
    let current = -1;

    const flowItems = () => Array.from(document.querySelectorAll('.Md3f7G_flowItem'));

    const clearHighlights = () => {
      flowItems().forEach((el) => {
        el.classList.remove('tui-match', 'tui-match-current');
      });
    };

    const focusMatch = (idx, doScroll) => {
      current = idx;
      matches.forEach((el, i) => {
        el.classList.toggle('tui-match-current', i === current);
      });
      const m = matches[current];
      if (m) {
        if (doScroll) m.scrollIntoView({ block: 'center', behavior: 'smooth' });
        counter.textContent = (current + 1) + '/' + matches.length;
      }
    };

    const runSearch = () => {
      const q = input.value.trim().toLowerCase();
      clearHighlights();
      matches = [];
      current = -1;
      if (!q) {
        counter.textContent = '';
        return;
      }
      matches = flowItems().filter((el) => {
        const t = el.textContent;
        return t && t.toLowerCase().includes(q);
      });
      matches.forEach((el) => el.classList.add('tui-match'));
      if (matches.length) {
        counter.textContent = '1/' + matches.length;
        focusMatch(0, false);
      } else {
        counter.textContent = '0/0';
      }
    };

    const nextMatch = () => {
      if (!matches.length) return;
      const idx = current < 0 ? 0 : (current + 1) % matches.length;
      focusMatch(idx, true);
    };

    const close = () => {
      clearHighlights();
      bar.style.display = 'none';
      input.value = '';
      matches = [];
      current = -1;
      counter.textContent = '';
    };

    const open = () => {
      const seat = document.querySelector('[data-composer-seat]');
      if (seat) {
        const r = seat.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        bar.style.bottom = Math.max(8, vh - r.top + 12) + 'px';
      } else {
        bar.style.bottom = '200px';
      }
      bar.style.display = 'flex';
      input.focus();
      input.select();
      runSearch();
    };

    input.addEventListener('input', runSearch);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        nextMatch();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    });

    const onGlobalKey = (e) => {
      const t = e.target;
      if (t && t.classList && t.classList.contains('tui-search-input')) {
        e.preventDefault();
        input.focus();
        input.select();
        return;
      }
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k !== 'f' && k !== 'ф') return;
      const tag = t && (t.tagName || '');
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (t && t.isContentEditable)) return;
      e.preventDefault();
      open();
    };
    document.addEventListener('keydown', onGlobalKey, true);

    cleanups.push(() => {
      document.removeEventListener('keydown', onGlobalKey, true);
      bar.remove();
      clearHighlights();
    });
  }
}

        }
        // ── feature: feat-9.json ──
        {
{
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "tui-export-btn";
  btn.title = "Export conversation as Markdown";
  btn.textContent = "\u2b07 md";

  const mount = () => {
    const header = document.querySelector(".wSkVaW_header");
    if (!header || header.contains(btn)) return false;
    header.appendChild(btn);
    return true;
  };

  if (!mount()) {
    const mo = new MutationObserver(() => { if (mount()) mo.disconnect(); });
    mo.observe(document.body, { childList: true, subtree: true });
    cleanups.push(() => mo.disconnect());
  }

  btn.addEventListener("click", () => {
    try {
      const titleEl = document.querySelector('.wSkVaW_header [class$="_title"]');
      const title = titleEl ? titleEl.textContent.replace(/\s+/g, " ").trim() : "dsh conversation";
      const parts = [];
      const push = (t) => { const x = t.replace(/\s+/g, " ").trim(); if (x) parts.push(x); };

      document.querySelectorAll(".Md3f7G_flowItem").forEach((item) => {
        const userRow = item.querySelector(".gdEzaW_userRow");
        const asstRoot = item.querySelector(".Sxvs8a_root");
        if (userRow) push("\u276f " + userRow.textContent);
        else if (asstRoot) push(asstRoot.textContent);
        // tool rows inside the item that are NOT part of the assistant body
        item.querySelectorAll(".Md3f7G_callRow").forEach((row) => {
          if (row.closest(".Sxvs8a_root")) return;
          push("$ " + row.textContent);
        });
      });
      // standalone tool rows (direct children of the message column)
      document.querySelectorAll(".Md3f7G_column > .Md3f7G_callRow").forEach((row) => {
        push("$ " + row.textContent);
      });

      if (parts.length === 0) return;
      const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      const md = "# " + title + "\n\n" + parts.join("\n\n") + "\n";
      const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dsh-export-" + stamp + ".md";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      /* export failed silently — no messages or DOM changed mid-click */
    }
  });
}
        }
        {
{
  // tui-no-tps: the harness renders "tok/s" (tokens per second) in the
  // composer stats line and on each message's actions clock. Strip those
  // text nodes so no TPS output stays in the web UI.
  const strip = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const hits = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeType === 3 && /tok\/s/.test(node.textContent || "")) hits.push(node);
    }
    for (const node of hits) {
      if (!node.isConnected) continue;
      const parent = node.parentNode;
      if (!parent || parent.nodeType !== 1) continue;
      const text = node.textContent || "";
      const siblings = [...parent.childNodes];
      const hasOtherContent = siblings.some((c) => c !== node && !(c.nodeType === 3 && c.textContent.trim() === ""));
      const trailing = text.replace(/\s*·\s*[^·]*?tok\/s\s*$/, "");
      if (trailing !== text) {
        // StatsLine group like "TTFT 0.5s · 123 tok/s": drop the trailing segment.
        node.textContent = trailing;
        continue;
      }
      if (!hasOtherContent) {
        // The parent element is nothing but the TPS number: drop it and a
        // preceding "|" separator (StatsLine group).
        const prev = parent.previousElementSibling;
        if (prev && prev.getAttribute("aria-hidden") === "true" && prev.textContent.trim() === "|") prev.remove();
        parent.remove();
        continue;
      }
      // Per-message actions clock: drop the "· 123 tok/s" tail (dot + number).
      const prevSib = node.previousSibling;
      if (prevSib && prevSib.nodeType === 1 && prevSib.getAttribute("aria-hidden") === "true" && prevSib.textContent.trim() === "·") prevSib.remove();
      node.remove();
    }
  };
  strip();
  let timer = 0;
  const mo = new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(strip, 300);
  });
  mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  cleanups.push(() => {
    clearTimeout(timer);
    mo.disconnect();
  });
}
        }
        // ── feature: buttons-to-commands (steps 2-3) ──
        {
          // Keyboard replacements for the hidden composer buttons:
          //   Esc      → stop the run (stop button is rendered only while a
          //              run is in flight; "停止生成" is the zh-CN label)
          //   Ctrl+M   → open the model picker (the hidden [aria-haspopup="menu"]
          //              trigger; arrows/Enter work inside the picker)
          // Bubble-phase listener: React's own key handlers (popup dismissal,
          // etc.) run first, so Esc closes open menus before we stop.
          const STOP_LABEL = "\u505c\u6b62\u751f\u6210";
          const onKey = (e) => {
            if (e.repeat) return;
            if (e.key === "Escape") {
              // If any popup/menu/modal is still open, Esc belongs to it.
              if (document.querySelector('[role="listbox"][aria-expanded="true"], [role="menu"][aria-expanded="true"], [aria-modal="true"]')) return;
              // While editing a queued message, Esc cancels the edit, not the run.
              const ae = document.activeElement;
              if (ae && ae.tagName === "INPUT" && ae.getAttribute("aria-label") === "\u7f16\u8f91\u6392\u961f\u6d88\u606f") return;
              const composer = document.querySelector("[data-composer-card]");
              const stop = composer && composer.querySelector('button[aria-label="' + STOP_LABEL + '"]');
              if (stop && !stop.disabled) {
                e.preventDefault();
                stop.click();
              }
              return;
            }
            if ((e.ctrlKey || e.metaKey) && e.code === "KeyM") {
              const composer = document.querySelector("[data-composer-card]");
              const trigger = composer && composer.querySelector('button[aria-haspopup="menu"]');
              if (trigger && !trigger.disabled) {
                e.preventDefault();
                if (trigger.getAttribute("aria-expanded") !== "true") trigger.click();
              }
            }
          };
          document.addEventListener("keydown", onKey, false);
          cleanups.push(() => document.removeEventListener("keydown", onKey, false));
        }
        // ── feature: buttons-to-commands (step 4): last-message hotkeys ──
        {
          // Ctrl+Alt+C        → copy the last message's text
          // Ctrl+Alt+B        → branch the last message (assistant only)
          // Ctrl+Alt+E        → edit the last queued message
          // Ctrl+Alt+Backspace→ remove the last queued message
          // Modifier combos only — plain letters must keep typing in the
          // composer. The hidden buttons are dispatched via .click() so the
          // app's own handlers (clipboard write, fork, queue ops) run as usual.
          const BRANCH = "\u5728\u65b0\u5bf9\u8bdd\u4e2d\u5206\u652f"; // 在新对话中分支
          const EDIT = "\u7f16\u8f91\u6392\u961f\u6d88\u606f";       // 编辑排队消息
          const REMOVE = "\u5220\u9664\u6392\u961f\u6d88\u606f";     // 删除排队消息
          const lastOf = (sel) => {
            const all = document.querySelectorAll(sel);
            return all.length ? all[all.length - 1] : null;
          };
          const copyText = (text) => {
            const fallback = () => {
              const ta = document.createElement("textarea");
              ta.value = text;
              ta.style.position = "fixed";
              ta.style.opacity = "0";
              document.body.appendChild(ta);
              ta.select();
              try { document.execCommand("copy"); } catch (e) { /* ignore */ }
              ta.remove();
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(text).catch(fallback);
            } else fallback();
          };
          const onKey = (e) => {
            if (e.repeat) return;
            if (!(e.ctrlKey || e.metaKey) || !e.altKey) return;
            // e.code (physical key), not e.key: the user types on a RU layout,
            // where e.key would report Cyrillic letters for these positions.
            const code = e.code;
            if (code === "KeyC") {
              const item = lastOf(".Md3f7G_flowItem");
              if (!item) return;
              const userRow = item.querySelector(".gdEzaW_userRow");
              const asstRoot = item.querySelector(".Sxvs8a_root");
              const text = ((userRow || asstRoot || item).textContent || "").replace(/\s+/g, " ").trim();
              if (text) { e.preventDefault(); copyText(text); }
              return;
            }
            if (code === "KeyB") {
              const item = lastOf(".Md3f7G_flowItem");
              const btn = item && item.querySelector('button[aria-label="' + BRANCH + '"]');
              if (btn && !btn.disabled) { e.preventDefault(); btn.click(); }
              return;
            }
            if (code === "KeyE") {
              const btn = lastOf('button[aria-label="' + EDIT + '"]');
              if (btn && !btn.disabled) { e.preventDefault(); btn.click(); }
              return;
            }
            if (code === "Backspace") {
              const btn = lastOf('button[aria-label="' + REMOVE + '"]');
              if (btn && !btn.disabled) { e.preventDefault(); btn.click(); }
            }
          };
          document.addEventListener("keydown", onKey, false);
          cleanups.push(() => document.removeEventListener("keydown", onKey, false));
        }
        // ── feature: buttons-to-commands (step 5): sidebar hotkeys ──
        {
          // Ctrl+Alt+N → new session (both 新建会话 buttons are hidden by CSS)
          // Ctrl+Alt+J → next session in the sidebar list (treeitem w/ aria-selected)
          // Ctrl+Alt+K → previous session
          // Ctrl+Alt+W → open the workspace picker while the composer shows
          //              the "选择工作区" trigger (inert session, no workspace)
          // e.code again: RU layout must not break these.
          const NEW = "\u65b0\u5efa\u4f1a\u8bdd";            // 新建会话
          const WORKSPACE = "\u9009\u62e9\u5de5\u4f5c\u533a"; // 选择工作区
          const sessions = () => Array.from(document.querySelectorAll('[role="treeitem"][aria-selected]'));
          const onKey = (e) => {
            if (e.repeat) return;
            if (!(e.ctrlKey || e.metaKey) || !e.altKey) return;
            const code = e.code;
            if (code === "KeyN") {
              const btn = document.querySelector('button[aria-label="' + NEW + '"]');
              if (btn && !btn.disabled) { e.preventDefault(); btn.click(); }
              return;
            }
            if (code === "KeyW") {
              // While inert (no workspace), the composer is a 选择工作区 trigger:
              // the textarea click bubbles to the card's onClick → picker opens.
              const trigger = document.querySelector('textarea[aria-label="' + WORKSPACE + '"]');
              if (trigger) { e.preventDefault(); trigger.click(); }
              return;
            }
            if (code === "KeyJ" || code === "KeyK") {
              const items = sessions();
              if (items.length === 0) return;
              const cur = items.findIndex((el) => el.getAttribute("aria-selected") === "true");
              const dir = code === "KeyJ" ? 1 : -1;
              const idx = cur === -1 ? (dir === 1 ? 0 : items.length - 1) : (cur + dir + items.length) % items.length;
              const target = items[idx];
              if (target) { e.preventDefault(); target.click(); }
            }
          };
          document.addEventListener("keydown", onKey, false);
          cleanups.push(() => document.removeEventListener("keydown", onKey, false));
        }
        // ── feature: auto-expand disclosure rows (Think, commands, context) ──
        // ReasoningRow, GenericCommandCard and ContextInjectionRow all mount
        // collapsed (their bodies are NOT in the DOM until opened), so CSS
        // cannot reveal them. Rows get opened once (WeakSet memory: a row the
        // user collapses later stays collapsed; brand-new rows from new turns
        // get expanded again). Scoped to think / others / context-injection —
        // tool-call cards (search/read/edit/write variants) keep their
        // collapsed summaries so file contents don't flood the column.
        {
          const opened = new WeakSet();
          const isTarget = (row) => {
            const root = row.closest("[data-variant]");
            if (root !== null) {
              const variant = root.getAttribute("data-variant");
              return variant === "think" || variant === "others";
            }
            // context-injection rows carry no data-variant; they have an
            // injected-content marker inside the row itself
            return row.querySelector("[data-context-source]") !== null;
          };
          const expand = () => {
            const column = document.querySelector(".Md3f7G_column");
            if (!column) return;
            for (const row of column.querySelectorAll('[data-disclosure-row][role="button"][aria-expanded="false"]')) {
              if (opened.has(row) || !isTarget(row)) continue;
              opened.add(row);
              row.click();
            }
          };
          expand();
          const mo = new MutationObserver(expand);
          mo.observe(document.body, { childList: true, subtree: true });
          cleanups.push(() => mo.disconnect());
        }
        return () => {
          cleanups.forEach((fn) => fn());
          style.remove();
        };
      });

      // ── feature: buttons-to-commands (step 5b): /new slash command ──
      // A client-side "/" source: /new starts a new session. The host
      // `commands` service cannot click GUI buttons, but `inputTriggers`
      // accepts extra client sources for the "/" trigger — the candidate
      // joins the menu under its own group (title hidden by CSS above) and
      // matchEnter claims the bare "/new" line (the host "command" source
      // returns void for unknown names, so registration order doesn't matter).
      ctx.inject(["inputTriggers", "workspaces", "sessions"], (scope) => {
        const NEW_NAME = "new";
        const consume = (session, guard) => {
          const actx = scope.sessions.scope(session.sessionId);
          if (actx === void 0 || typeof actx.bail !== "function") return;
          actx.bail(actx, "slash/input-consume-token", { guard });
        };
        const disposer = scope.inputTriggers.registerSource({
          trigger: "/",
          name: "local",
          candidates: (session, req) => {
            const query = (req?.query ?? "").toLowerCase();
            if (query !== "" && !NEW_NAME.startsWith(query)) return Promise.resolve([]);
            return Promise.resolve([
              { name: NEW_NAME, description: "новый чат / новая сессия" },
            ]);
          },
          onPick: (pick) => {
            consume(pick.session, { kind: "span", span: pick.span });
            scope.workspaces.startSession();
            return "handled";
          },
          matchEnter: (session, line) => {
            const trimmed = line.trim();
            if (trimmed !== "/" + NEW_NAME && !trimmed.startsWith("/" + NEW_NAME + " ")) return void 0;
            consume(session, { kind: "bare-token", token: trimmed });
            scope.workspaces.startSession();
            return "handled";
          },
        });
        ctx.effect(() => disposer, "tui: /new source");
      });
    }

    return { apply, inject };
  },
});
