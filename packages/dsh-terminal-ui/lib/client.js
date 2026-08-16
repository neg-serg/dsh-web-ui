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
.tui-sl-sep {
  color: var(--dsw-alias-button-info-fill); /* #005faf — the kitty/heirline separator blue */
}
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

/* ── dsh-cost-meter: session cost line + sidebar footer (console) ── */
.cm-root {
  text-align: left;
  font-family: var(--ds-font-family-code);
  font-size: 11px;
  line-height: 20px;
  color: var(--dsw-alias-label-secondary);
  border-top: 1px solid var(--dsw-alias-border-l1);
  padding: 4px 16px;
  overflow-x: auto;
  white-space: nowrap;
}
.cm-root::before {
  content: "cost:";
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
  margin-right: 8px;
}
.cm-root .cm-num {
  color: var(--dsw-alias-label-primary);
}
.cm-foot {
  font-family: var(--ds-font-family-code);
  font-size: 11px;
  border-radius: 3px;
  color: var(--dsw-alias-label-secondary);
}
.cm-foot .cm-num {
  color: var(--dsw-alias-label-primary);
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


/* ── feature: feat-6.json ── */
/* ── network activity indicator (tui) ── */
.tui-net-indicator {
  position: fixed;
  left: 16px;
  bottom: 40px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 3px;
  background: rgba(4, 15, 28, 0.85);
  font-family: var(--ds-font-family-code);
  font-size: 10px;
  line-height: 1;
  color: var(--dsw-alias-label-tertiary);
  z-index: 9999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 120ms ease, visibility 120ms ease;
  pointer-events: none;
}
.tui-net-indicator.tui-net-active {
  opacity: 1;
  visibility: visible;
}
.tui-net-dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: var(--dsw-alias-state-success-primary);
  flex: none;
}
.tui-net-indicator.tui-net-active .tui-net-dot {
  animation: tui-net-pulse 1s ease-in-out infinite;
}
@keyframes tui-net-pulse {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 2px var(--dsw-alias-state-success-primary);
  }
  50% {
    opacity: 0.35;
    box-shadow: 0 0 8px var(--dsw-alias-state-success-primary);
  }
}

/* ── feature: feat-8.json ── */
/* chat column drag-resize handle (console style) */
.wSkVaW_root {
  position: relative;
}
.tui-resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 6px;
  cursor: col-resize;
  z-index: 1000;
  background: transparent;
}
.tui-resize-handle::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 2px;
  width: 2px;
  background: var(--dsw-alias-border-l1);
  transition: background 0.15s ease;
}
.tui-resize-handle:hover::after,
body.tui-resizing .tui-resize-handle::after {
  background: var(--dsw-alias-brand-primary);
}
body.tui-resizing {
  cursor: col-resize;
  user-select: none;
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
/* ── feature: feat-10.json ── */
/* ── vim-style status line above the composer (feature: active session) ── */
.tui-statusline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex: none;
  width: 100%;
  max-width: var(--dsh-chat-content-width, 1184px);
  margin: 0 auto;
  padding: 2px 8px 4px;
  box-sizing: border-box;
  font-family: var(--ds-font-family-code), monospace;
  font-size: 11px;
  line-height: 16px;
  color: var(--dsw-alias-label-tertiary);
  border-top: 1px solid var(--dsw-alias-border-l1);
  white-space: nowrap;
  overflow: hidden;
  user-select: none;
}
.tui-statusline .tui-sl-left {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tui-statusline .tui-sl-left::before {
  content: "session";
  color: var(--dsw-alias-label-caption);
  margin-right: 6px;
}
.tui-statusline .tui-sl-right {
  flex: none;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--dsw-alias-label-caption);
}
.tui-statusline .tui-sl-sep {
  color: var(--dsw-alias-border-l1);
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
        // ── feature: feat-6.json ──
        {
{
  // ── network activity indicator (tui) ──
  const indicator = document.createElement("div");
  indicator.className = "tui-net-indicator";
  indicator.innerHTML = '<span class="tui-net-dot"></span><span>net</span>';
  document.body.appendChild(indicator);

  let active = 0;
  let hideTimer = null;

  const show = () => {
    indicator.classList.add("tui-net-active");
  };
  const hide = () => {
    indicator.classList.remove("tui-net-active");
  };
  const track = () => {
    active += 1;
    clearTimeout(hideTimer);
    show();
  };
  const untrack = () => {
    active = Math.max(0, active - 1);
    if (active === 0) {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(hide, 150);
    }
  };

  if (!window.__tuiNetPatched) {
    window.__tuiNetPatched = true;
    window.__tuiNetOriginals = {};

    const origFetch = window.fetch;
    if (typeof origFetch === "function") {
      window.__tuiNetOriginals.fetch = origFetch;
      window.fetch = function (...args) {
        track();
        return origFetch.apply(this, args).then(
          (res) => {
            untrack();
            return res;
          },
          (err) => {
            untrack();
            throw err;
          }
        );
      };
    }

    const XHR = window.XMLHttpRequest;
    if (XHR && XHR.prototype) {
      window.__tuiNetOriginals.xhrOpen = XHR.prototype.open;
      window.__tuiNetOriginals.xhrSend = XHR.prototype.send;
      XHR.prototype.open = function (...args) {
        this.__tuiNetTracked = false;
        return window.__tuiNetOriginals.xhrOpen.apply(this, args);
      };
      XHR.prototype.send = function (...args) {
        if (!this.__tuiNetTracked) {
          this.__tuiNetTracked = true;
          track();
          this.addEventListener("loadend", untrack, { once: true });
        }
        return window.__tuiNetOriginals.xhrSend.apply(this, args);
      };
    }

    const WS = window.WebSocket;
    if (WS && WS.prototype) {
      window.__tuiNetOriginals.wsSend = WS.prototype.send;
      WS.prototype.send = function (...args) {
        track();
        setTimeout(untrack, 60);
        return window.__tuiNetOriginals.wsSend.apply(this, args);
      };
    }
  }

  cleanups.push(() => {
    clearTimeout(hideTimer);
    if (indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
    if (window.__tuiNetPatched && window.__tuiNetOriginals) {
      const o = window.__tuiNetOriginals;
      if (o.fetch) window.fetch = o.fetch;
      if (o.xhrOpen) window.XMLHttpRequest.prototype.open = o.xhrOpen;
      if (o.xhrSend) window.XMLHttpRequest.prototype.send = o.xhrSend;
      if (o.wsSend) window.WebSocket.prototype.send = o.wsSend;
      delete window.__tuiNetOriginals;
      delete window.__tuiNetPatched;
    }
  });
}

        }
        // ── feature: feat-8.json ──
        {
{
  const STORAGE_KEY = "tui-chat-width";
  const MIN = 520;
  const MAX = 1600;
  let root = document.querySelector(".wSkVaW_root");
  let handle = null;

  const clamp = (v) => Math.min(MAX, Math.max(MIN, v));

  const applyWidth = (w) => {
    if (!root) return;
    root.style.setProperty("--dsh-chat-content-width", clamp(w) + "px");
  };

  const column = () => root ? root.querySelector(".Md3f7G_column") : null;

  const currentWidth = () => {
    const col = column();
    if (col) return col.getBoundingClientRect().width;
    return root ? root.getBoundingClientRect().width : MIN;
  };

  // keep the handle glued to the column's right edge (column is centered)
  const positionHandle = () => {
    if (!root || !handle) return;
    const col = column();
    const ref = col || root;
    const rr = root.getBoundingClientRect();
    handle.style.left = Math.round(ref.getBoundingClientRect().right - rr.left - 3) + "px";
  };

  const ensureHandle = () => {
    if (!root || handle) return;
    handle = document.createElement("div");
    handle.className = "tui-resize-handle";
    root.appendChild(handle);

    const onDown = (e) => {
      e.preventDefault();
      document.body.classList.add("tui-resizing");
      const startX = e.clientX;
      const startW = currentWidth();
      const onMove = (ev) => {
        applyWidth(startW + (ev.clientX - startX));
        positionHandle();
      };
      const onUp = () => {
        document.body.classList.remove("tui-resizing");
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        const cur = root.style.getPropertyValue("--dsh-chat-content-width");
        if (cur) localStorage.setItem(STORAGE_KEY, cur.replace("px", ""));
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      cleanups.push(() => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      });
    };
    handle.addEventListener("mousedown", onDown);
    cleanups.push(() => handle.removeEventListener("mousedown", onDown));
  };

  const init = () => {
    root = document.querySelector(".wSkVaW_root");
    if (!root) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) applyWidth(parseInt(saved, 10));
    ensureHandle();
    positionHandle();
  };

  // the root mounts late (React); retry briefly, then keep watching
  let tries = 0;
  const attempt = () => {
    if (root || tries++ >= 40) return init();
    setTimeout(attempt, 500);
  };
  attempt();

  const mo = new MutationObserver(() => {
    if (!root) {
      root = document.querySelector(".wSkVaW_root");
      if (root) init();
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });
  cleanups.push(() => mo.disconnect());

  const onResize = () => positionHandle();
  window.addEventListener("resize", onResize);
  cleanups.push(() => window.removeEventListener("resize", onResize));
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
        // ── feature: feat-10.json ──
        {
{
  const mkStatus = () => {
    let el = document.querySelector('.tui-statusline');
    if (!el) {
      el = document.createElement('div');
      el.className = 'tui-statusline';
      const left = document.createElement('span');
      left.className = 'tui-sl-left';
      const right = document.createElement('span');
      right.className = 'tui-sl-right';
      el.append(left, right);
      document.body.appendChild(el);
    }
    return el;
  };
  const placeStatus = () => {
    const el = mkStatus();
    const seat = document.querySelector('[data-composer-seat]');
    const root = document.querySelector('.wSkVaW_root');
    if (seat) {
      if (el.previousElementSibling !== seat) seat.parentNode.insertBefore(el, seat);
    } else if (root && el.parentNode !== root) {
      root.appendChild(el);
    }
  };
  const pickText = (sel) => {
    const n = document.querySelector(sel);
    if (!n) return '';
    return (n.textContent || '').trim();
  };
  const sessionName = () =>
    pickText('.YDXeBa_sessionRow.YDXeBa_selected .YDXeBa_title')
    || pickText('.YDXeBa_sessionRow .YDXeBa_title')
    || pickText('.wSkVaW_header [class$="_title"]')
    || '—';
  const columnWidth = () => {
    // physical pixels: CSS width x devicePixelRatio (HiDPI: 4K at scale 2
    // doubles every on-screen pixel, so the "real" width is 2x the CSS px)
    const col = document.querySelector('.Md3f7G_column');
    const dpr = window.devicePixelRatio || 1;
    if (col) return Math.round(col.getBoundingClientRect().width * dpr) + 'px';
    const root = document.querySelector('.wSkVaW_root');
    const v = root ? getComputedStyle(root).getPropertyValue('--dsh-chat-content-width').trim() : '';
    const n = parseInt(v, 10);
    return (isNaN(n) ? v : (Math.round(n * dpr) + 'px')) || 'auto';
  };
  const update = () => {
    placeStatus();
    const el = mkStatus();
    const left = el.querySelector('.tui-sl-left');
    const right = el.querySelector('.tui-sl-right');
    if (!left || !right) return;
    left.textContent = sessionName();
    right.textContent = '';
    const parts = ['tui', 'neg-dark', columnWidth()];
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) {
        const sep = document.createElement('span');
        sep.className = 'tui-sl-sep';
        sep.textContent = '/';
        right.appendChild(sep);
      }
      const s = document.createElement('span');
      s.textContent = parts[i];
      right.appendChild(s);
    }
  };
  let debounce = 0;
  const schedule = () => { clearTimeout(debounce); debounce = setTimeout(update, 300); };
  placeStatus();
  update();
  const sideObs = new MutationObserver(schedule);
  const side = document.querySelector('[data-pane="sidebar"]');
  if (side) sideObs.observe(side, { childList: true, subtree: true });
  const bodyObs = new MutationObserver(schedule);
  bodyObs.observe(document.body, { childList: true, subtree: true });
  const iv = setInterval(update, 2000);
  cleanups.push(() => {
    clearTimeout(debounce);
    clearInterval(iv);
    sideObs.disconnect();
    bodyObs.disconnect();
  });
}
        }
        return () => {
          cleanups.forEach((fn) => fn());
          style.remove();
        };
      });
    }

    return { apply, inject };
  },
});
