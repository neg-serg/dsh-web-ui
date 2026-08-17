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
   The aria-labels come in two flavors: zh-CN strings of the pinned dsh
   release ("发送消息" / "停止生成") and the English UI this profile runs
   ("Send message" / "Stop generating"); both are listed so the hides hold
   whichever locale the browser negotiates. */
[data-composer-card] button[aria-label="发送消息"],
[data-composer-card] button[aria-label="Send message"],
[data-composer-card] button[aria-label="停止生成"],
[data-composer-card] button[aria-label="Stop generating"],
[data-composer-card] button[aria-haspopup="menu"] {
  display: none;
}

/* ── buttons-to-commands (step 4): hide message + queue action buttons ──
   Ctrl+Alt+C copies the last message, Ctrl+Alt+B branches it,
   Ctrl+Alt+E / Ctrl+Alt+Backspace edit/remove the last queued message
   (JS feature below). Scope [data-time-hover-root] × [class$="_actions"]
   keeps code-block copy buttons (deep inside the body) intact. Labels in
   both zh-CN ("复制"/"在新对话中分支"/…) and the live English UI
   ("Copy"/"Branch into a new conversation"/…) are listed. */
[data-time-hover-root] [class$="_actions"] [aria-label="复制"],
[data-time-hover-root] [class$="_actions"] [aria-label="复制成功"],
[data-time-hover-root] [class$="_actions"] [aria-label="Copy"],
[data-time-hover-root] [class$="_actions"] [aria-label="Copied"],
[data-time-hover-root] [class$="_actions"] [aria-label="在新对话中分支"],
[data-time-hover-root] [class$="_actions"] [aria-label="Branch into a new conversation"],
button[aria-label="编辑排队消息"],
button[aria-label="Edit queued message"],
button[aria-label="删除排队消息"],
button[aria-label="Remove queued message"],
button[aria-label="插话发送"],
button[aria-label="Steer queued message"] {
  display: none;
}

/* ── buttons-to-commands (step 5): hide sidebar new-session buttons ──
   Both the brand wordmark and the labeled New Chat button carry the same
   aria-label in each locale ("新建会话" zh / "New session" en) and both
   start a new session; Ctrl+Alt+N / the /new command replace them
   (JS feature below). */
button[aria-label="新建会话"],
button[aria-label="New session"] {
  display: none;
}

/* ── buttons-to-commands (step 5b): /new menu group title ──
   The client /new source renders as its own "/" menu group ("local");
   hide its title row so /new reads as part of the commands group. */
[data-source="local"] {
  display: none;
}

/* ── buttons-to-commands (step 6): header/sidebar leftovers → commands ──
   Session log header button → /export  (dsh-session-log-export)
   "⬇ md" header button       → /export-md (host command, step 7)
   SSH sidebar entry          → ssh / ssh-hosts / ssh-cluster / ssh-tunnel
   Sidebar rail toggle + wordmark → Ctrl+Alt+N / /new (both create sessions)
   Hashed classes of the pinned dsh release + the fork build; re-derive
   them from the served bundles if a rebuild changes the hashes. */
.nL4_yW_sessionLogButton,
.tui-export-btn,
.mL8Uca_entry,
.hHd-Xa_toggle,
.hHd-Xa_brand {
  display: none;
}

`;

    function apply(ctx) {
      // ── feat-9: Markdown export, shared by the "⬇ md" header button and the
      // /export-md slash command (step 7). Defined at apply level so both the
      // button (inside ctx.effect) and the command listener can call it.
      const exportMarkdown = () => {
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
      };

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

  // The button stays mounted (hidden by CSS, step 6); both it and the
  // /export-md command (step 7) run the shared exportMarkdown() above.
  btn.addEventListener("click", exportMarkdown);
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
          //              run is in flight; both locale labels are matched)
          //   Ctrl+M   → open the model picker (the hidden [aria-haspopup="menu"]
          //              trigger; arrows/Enter work inside the picker)
          // Bubble-phase listener: React's own key handlers (popup dismissal,
          // etc.) run first, so Esc closes open menus before we stop.
          const STOP = 'button[aria-label="停止生成"], button[aria-label="Stop generating"]';
          const EDIT_LABELS = ["\u7f16\u8f91\u6392\u961f\u6d88\u606f", "Edit queued message"];
          const onKey = (e) => {
            if (e.repeat) return;
            if (e.key === "Escape") {
              // If any popup/menu/modal is still open, Esc belongs to it.
              if (document.querySelector('[role="listbox"][aria-expanded="true"], [role="menu"][aria-expanded="true"], [aria-modal="true"]')) return;
              // While editing a queued message, Esc cancels the edit, not the run.
              const ae = document.activeElement;
              const aeLabel = ae && ae.getAttribute("aria-label");
              if (ae && ae.tagName === "INPUT" && EDIT_LABELS.includes(aeLabel)) return;
              const composer = document.querySelector("[data-composer-card]");
              const stop = composer && composer.querySelector(STOP);
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
          // Labels matched in both zh-CN and the live English UI.
          const BRANCH = 'button[aria-label="在新对话中分支"], button[aria-label="Branch into a new conversation"]';
          const EDIT = 'button[aria-label="编辑排队消息"], button[aria-label="Edit queued message"]';
          const REMOVE = 'button[aria-label="删除排队消息"], button[aria-label="Remove queued message"]';
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
              const btn = item && item.querySelector(BRANCH);
              if (btn && !btn.disabled) { e.preventDefault(); btn.click(); }
              return;
            }
            if (code === "KeyE") {
              const btn = lastOf(EDIT);
              if (btn && !btn.disabled) { e.preventDefault(); btn.click(); }
              return;
            }
            if (code === "Backspace") {
              const btn = lastOf(REMOVE);
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
          // Labels matched in both zh-CN and the live English UI.
          const NEW = 'button[aria-label="新建会话"], button[aria-label="New session"]';
          const WORKSPACE = "\u9009\u62e9\u5de5\u4f5c\u533a"; // 选择工作区
          const sessions = () => Array.from(document.querySelectorAll('[role="treeitem"][aria-selected]'));
          const onKey = (e) => {
            if (e.repeat) return;
            if (!(e.ctrlKey || e.metaKey) || !e.altKey) return;
            const code = e.code;
            if (code === "KeyN") {
              const btn = document.querySelector(NEW);
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
        // get expanded again). Scoped to think / others / context-injection
        // plus code & file EDIT tool rows (edit/write/code) — the user wants
        // edits visible; read/search/bash rows keep their collapsed summaries
        // so file contents don't flood the column.
        {
          const opened = new WeakSet();
          const isTarget = (row) => {
            const root = row.closest("[data-variant]");
            if (root !== null) {
              const variant = root.getAttribute("data-variant");
              return variant === "think" || variant === "others" || variant === "edit" || variant === "write" || variant === "code";
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
        // ── feature: auto-reload on plugin/skin update ──
        // Prevents the stale-page trap: after a client.js edit the server
        // serves a new rev, but the open tab keeps the old bundle (and the
        // slash palette keeps the old command list) until a manual F5. This
        // polls the served boot page and reloads when any client-plugin rev
        // changes — or when the dsh service restarts (fetch fails and then
        // succeeds again, which also re-registers host commands like
        // /export-md). Fetching "/" is a few KB locally; 8s is fine.
        {
          const boot = window.__DSH_BOOT__;
          const currentRevs = new Map((boot?.entries || []).map((e) => [e.id, e.rev]));
          const BOOT_RE = /window\.__DSH_BOOT__ = (\{.*?\})<\/script>/s;
          let serverWasDown = false;
          let stopped = false;
          const check = async () => {
            if (stopped) return;
            try {
              const res = await fetch("/", { cache: "no-store" });
              if (!res.ok) throw new Error("http " + res.status);
              const html = await res.text();
              const wasDown = serverWasDown;
              serverWasDown = false;
              const m = html.match(BOOT_RE);
              if (m) {
                const fresh = JSON.parse(m[1]);
                const freshRevs = new Map((fresh.entries || []).map((e) => [e.id, e.rev]));
                const changed =
                  freshRevs.size !== currentRevs.size ||
                  [...currentRevs].some(([id, rev]) => freshRevs.get(id) !== rev);
                if (wasDown || changed) { location.reload(); return; }
              }
            } catch {
              serverWasDown = true; // server restarting — reload when it returns
            }
          };
          const timer = setInterval(check, 8000);
          check();
          cleanups.push(() => { stopped = true; clearInterval(timer); });
        }
        return () => {
          cleanups.forEach((fn) => fn());
          style.remove();
        };
      });

      // ── feature: buttons-to-commands (step 5b+): client slash commands ──
      // Client-side "/" source: /new starts a new session, /session <query>
      // switches to a session by title/query, /next and /prev cycle the
      // sidebar list. The host `commands` service cannot click GUI buttons or
      // open sessions, but `inputTriggers` accepts extra client sources for
      // the "/" trigger — candidates join the menu under their own group
      // (title hidden by CSS above) and matchEnter claims the bare lines
      // (the host "command" source returns void for unknown names, so
      // registration order doesn't matter).
      ctx.inject(["inputTriggers", "workspaces", "sessions"], (scope) => {
        const consume = (session, guard) => {
          const actx = scope.sessions.scope(session.sessionId);
          if (actx === void 0 || typeof actx.bail !== "function") return;
          actx.bail(actx, "slash/input-consume-token", { guard });
        };
        // Sidebar session rows (folders are treeitems with aria-expanded).
        const sessionRows = () => Array.from(document.querySelectorAll('[role="treeitem"][aria-selected]'));
        const cycle = (dir) => {
          const items = sessionRows();
          if (items.length === 0) return;
          const cur = items.findIndex((el) => el.getAttribute("aria-selected") === "true");
          const idx = cur === -1 ? (dir === 1 ? 0 : items.length - 1) : (cur + dir + items.length) % items.length;
          items[idx]?.click();
        };
        // Search the session catalog and open the best match: first by
        // display title (exact > prefix > substring), then by message
        // content (sessions.search returns {items:[{sessionId,snippet}]}).
        const openByQuery = async (rawQuery) => {
          const q = (rawQuery ?? "").trim();
          if (q === "") return;
          const lower = q.toLowerCase();
          const byId = scope.sessions.list.getSnapshot().byId ?? {};
          const entries = Object.values(byId);
          const byTitle = (kind, title) => entries.filter((s) => {
            const label = (s.displayTitle ?? s.title ?? "").toLowerCase();
            return kind === "exact" ? label === lower : kind === "prefix" ? label.startsWith(lower) : label.includes(lower);
          });
          const pick = byTitle("exact")[0] ?? byTitle("prefix")[0] ?? byTitle("includes")[0];
          if (pick !== void 0) {
            scope.sessions.open(pick.id);
            return;
          }
          const res = await scope.sessions.search(q);
          if (res.ok) {
            const first = (res.value?.items ?? [])[0];
            if (first !== void 0) scope.sessions.open(first.sessionId);
          }
        };
        const dispatchLine = (session, line) => {
          const trimmed = line.trim();
          if (trimmed === "/new" || trimmed.startsWith("/new ")) {
            consume(session, { kind: "bare-token", token: trimmed });
            scope.workspaces.startSession();
            return "handled";
          }
          if (trimmed === "/next") {
            consume(session, { kind: "bare-token", token: trimmed });
            cycle(1);
            return "handled";
          }
          if (trimmed === "/prev") {
            consume(session, { kind: "bare-token", token: trimmed });
            cycle(-1);
            return "handled";
          }
          if (trimmed === "/session" || trimmed.startsWith("/session ")) {
            // Bare "/session" is consumed but does nothing; with a query it
            // opens the best match. Consumed either way — the line is a
            // command, not a chat message.
            consume(session, { kind: "bare-token", token: trimmed });
            void openByQuery(trimmed.slice("/session".length));
            return "handled";
          }
          return void 0;
        };
        const COMMANDS = [
          { name: "new", description: "новый чат / новая сессия" },
          { name: "session", description: "перейти к сессии по имени: /session <имя>" },
          { name: "next", description: "следующая сессия" },
          { name: "prev", description: "предыдущая сессия" },
        ];
        const disposer = scope.inputTriggers.registerSource({
          trigger: "/",
          name: "local",
          candidates: (session, req) => {
            const query = (req?.query ?? "").toLowerCase();
            const list = query === "" ? COMMANDS : COMMANDS.filter((c) => c.name.startsWith(query));
            return Promise.resolve(list);
          },
          onPick: (pick) => {
            const name = pick.candidate.name;
            if (name === "session") {
              // Leave "/session" in the draft so the user types the query
              // (the command only fires on Enter with an argument).
              return "handled";
            }
            consume(pick.session, { kind: "span", span: pick.span });
            if (name === "new") scope.workspaces.startSession();
            else if (name === "next") cycle(1);
            else if (name === "prev") cycle(-1);
            return "handled";
          },
          matchEnter: (session, line) => dispatchLine(session, line),
        });
        ctx.effect(() => disposer, "tui: /new source");
      });

      // ── feature: buttons-to-commands (step 6): always land at the end ──
      // The chat restores each session's saved scroll position on open,
      // which leaves you mid-conversation. Whenever the active session id
      // changes — sidebar click, Ctrl+Alt+J/K, /session, /next, /prev, /new,
      // any method — jump the conversation scrollport to the end and keep it
      // pinned briefly while the new session streams its first content.
      // (The app's own scroll handler then sees "at bottom" and keeps
      // following while the session runs.)
      ctx.inject(["sessions"], (scope) => {
        const list = scope.sessions.list;
        let prev = list.getSnapshot().current;
        let settle = 0;
        const scrollEnd = () => {
          const host = document.querySelector("[data-conversation-scroll]");
          if (host instanceof HTMLElement) host.scrollTop = host.scrollHeight;
        };
        const unsub = list.subscribe(() => {
          const cur = list.getSnapshot().current;
          if (cur === prev) return;
          prev = cur;
          // After React renders the new session (double rAF), then once more
          // after a short settle window to catch async-loaded content.
          requestAnimationFrame(() => requestAnimationFrame(scrollEnd));
          clearTimeout(settle);
          settle = setTimeout(scrollEnd, 700);
        });
        ctx.effect(() => () => {
          clearTimeout(settle);
          unsub();
        }, "tui: session-end scroll");
      });

      // ── feature: buttons-to-commands (step 8): /session name autocomplete ──
      // The native "/" menu completes command NAMES but not their arguments.
      // While the composer line is "/session <partial>", show a small popup
      // above the input with matching session display titles; ArrowUp/Down
      // navigate, Enter/Tab opens the highlighted session (the line is
      // consumed like the bare /session command), Esc dismisses. Keys are
      // intercepted in the capture phase so React's Enter-submit never fires.
      ctx.inject(["sessions"], (scope) => {
        const popup = document.createElement("div");
        popup.style.cssText = [
          "position:fixed", "z-index:200", "display:none", "box-sizing:border-box",
          "min-width:280px", "max-width:520px", "max-height:280px", "overflow-y:auto",
          "background:var(--dsw-specific-menu)", "border:1px solid var(--dsw-alias-border-l1)",
          "border-radius:8px", "box-shadow:0 8px 28px rgba(0,0,0,.5)",
          "font-family:var(--ds-font-family-code)", "font-size:13px", "padding:4px",
        ].join(";");
        document.body.appendChild(popup);
        let rows = [];
        let active = 0;
        let blurTimer = 0;
        const composer = () => document.querySelector("[data-composer-card] textarea");
        const sessionLabels = () => {
          const byId = scope.sessions.list.getSnapshot().byId ?? {};
          const out = [];
          for (const s of Object.values(byId)) {
            const label = s.displayTitle ?? s.title;
            if (!label || label === s.id) continue; // id-fallback labels are noise
            out.push({ id: s.id, label });
          }
          return out;
        };
        const paint = () => {
          for (let i = 0; i < popup.children.length; i++) {
            popup.children[i].style.background = i === active ? "var(--dsw-alias-interactive-bg-hover)" : "";
          }
        };
        const dismiss = () => { popup.style.display = "none"; popup.textContent = ""; rows = []; };
        const open = (id) => {
          dismiss();
          const ta = composer();
          const line = ta !== null ? ta.value.trim() : "";
          const cur = scope.sessions.list.getSnapshot().current;
          const actx = cur !== void 0 ? scope.sessions.scope(cur) : void 0;
          if (actx !== void 0 && typeof actx.bail === "function" && line !== "") {
            actx.bail(actx, "slash/input-consume-token", { guard: { kind: "bare-token", token: line } });
          }
          scope.sessions.open(id);
        };
        const refresh = () => {
          const ta = composer();
          if (ta === null || document.activeElement !== ta) { dismiss(); return; }
          const text = ta.value;
          const m = /^\/session\s+(\S*)$/.exec(text);
          if (m === null || ta.selectionStart !== text.length) { dismiss(); return; }
          const q = m[1].toLowerCase();
          const all = sessionLabels();
          const items = q === "" ? all.slice(0, 8) : all.filter((s) => s.label.toLowerCase().includes(q)).slice(0, 8);
          rows = items;
          active = 0;
          if (items.length === 0) { dismiss(); return; }
          popup.textContent = "";
          items.forEach((item, i) => {
            const row = document.createElement("div");
            row.textContent = item.label;
            row.style.cssText = "padding:5px 10px;cursor:pointer;border-radius:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
            if (i === 0) row.style.background = "var(--dsw-alias-interactive-bg-hover)";
            row.addEventListener("mousedown", (e) => { e.preventDefault(); open(item.id); });
            popup.appendChild(row);
          });
          const r = ta.getBoundingClientRect();
          popup.style.left = Math.max(8, r.left) + "px";
          popup.style.width = Math.min(r.width, 520) + "px";
          popup.style.bottom = Math.max(8, window.innerHeight - r.top + 8) + "px";
          popup.style.display = "block";
        };
        const onInput = () => refresh();
        const onKey = (e) => {
          if (popup.style.display === "none" || rows.length === 0) return;
          const ta = composer();
          if (ta === null || e.target !== ta) return;
          switch (e.key) {
            case "ArrowDown": e.preventDefault(); e.stopPropagation(); active = (active + 1) % rows.length; paint(); break;
            case "ArrowUp": e.preventDefault(); e.stopPropagation(); active = (active - 1 + rows.length) % rows.length; paint(); break;
            case "Enter":
            case "Tab": e.preventDefault(); e.stopPropagation(); open(rows[active].id); break;
            case "Escape": e.preventDefault(); e.stopPropagation(); dismiss(); break;
          }
        };
        document.addEventListener("input", onInput, true);
        document.addEventListener("keydown", onKey, true);
        document.addEventListener("blur", () => { clearTimeout(blurTimer); blurTimer = setTimeout(dismiss, 150); }, true);
        ctx.effect(() => () => {
          document.removeEventListener("input", onInput, true);
          document.removeEventListener("keydown", onKey, true);
          clearTimeout(blurTimer);
          popup.remove();
        }, "tui: session autocomplete");
      });

      // ── buttons-to-commands (step 7): /export-md slash command ──
      // The hidden "⬇ md" header button (feat-9) stays mounted for the
      // toolbar-less fallback; both it and this command run the shared
      // exportMarkdown() above. The command itself is registered by the
      // host half (lib/index.js).
      ctx.on("command/executed", (_sessionId, commandName, result) => {
        if (commandName === "export-md" && result.kind === "success") {
          exportMarkdown();
        }
      });
    }

    return { apply, inject };
  },
});
