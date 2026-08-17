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
  /* 4K 32" desktop: scale the whole UI up. The theme is px-based (fonts,
     spacing, icons are all hardcoded px), so a root zoom scales everything
     uniformly — the easy knob vs. converting the theme to rem. Tune to taste
     (1.2 = +20 %). Supported by Chromium/Vivaldi, Firefox 126+, Safari. */
  zoom: 1.2;
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
  --dsw-alias-bg-base: rgb(4, 15, 28);
  --dsw-alias-bg-layer-1: rgba(12, 28, 48, 0.86);
  --dsw-alias-bg-layer-2: rgba(16, 35, 58, 0.82);
  --dsw-alias-bg-layer-3: rgba(22, 45, 72, 0.78);
  --dsw-alias-bg-overlay: rgba(12, 28, 48, 0.92);
  --dsw-alias-bg-mask-1: rgba(0, 0, 0, 0.5);
  --dsw-alias-bg-mask-2: rgba(0, 0, 0, 0.2);
  --dsw-alias-bg-mask-3: rgba(0, 0, 0, 0.48);
  --dsw-alias-bg-mask-drop: rgba(12, 28, 48, 0.85);
  --dsw-alias-bg-mask-photo: rgba(0, 0, 0, 0.88);
  --dsw-alias-bg-module-platform: rgba(16, 35, 58, 0.86);
  --dsw-alias-bg-multi-select: rgba(16, 35, 58, 0.86);
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
  --dsw-alias-markdown-code-block: rgba(0, 0, 0, 0.5);
  --dsw-alias-markdown-code-block-banner: rgba(10, 24, 42, 0.85);
  --dsw-alias-markdown-code-segment-selected: rgba(43, 68, 98, 0.6);
  --dsw-alias-markdown-code-segment-unselected: rgba(0, 0, 0, 0.5);
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
  --dsw-specific-sidebar-fill: rgb(4, 15, 28);
  --dsw-specific-sidebar-nav-item-active: rgba(16, 35, 58, 0.85);
  --dsw-specific-sidebar-nav-item-active-accent: rgba(22, 45, 72, 0.85);
  --dsw-specific-sidebar-nav-item-hover: rgba(28, 51, 78, 0.7);
  --dsw-specific-bubble: rgba(12, 28, 48, 0.8);
  --dsw-specific-bubble-highlight: rgba(16, 35, 58, 0.83);
  --dsw-specific-input-major: rgba(12, 28, 48, 0.88);
  --dsw-specific-login-input: rgba(4, 15, 28, 0.88);
  --dsw-specific-selector: rgba(16, 35, 58, 0.85);
  --dsw-specific-menu: rgba(12, 28, 48, 0.9);
  --dsw-specific-tip: rgba(22, 45, 72, 0.85);
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

/* ── thinking block: wrap reasoning text in a card for readability ── */
[data-variant="think"] .QWLzlG_thinkBody {
  margin: 6px 0 10px;
  padding: 12px 14px;
  background: rgba(2, 8, 15, 0.92);
  border: 1px solid var(--dsw-alias-border-l1);
  border-left: 3px solid var(--dsw-alias-state-business-primary);
  border-radius: 0;
  color: var(--dsw-alias-label-primary-dimmed);
  font-size: 14px;
  line-height: 23px;
}
[data-variant="think"] .QWLzlG_row {
  margin: 0;
}

/* sidebar icons: force theme color — some render with a hardcoded white
   SVG fill/stroke that looks unpainted on the navy glass */
/* sidebar icons: force theme color — but keep the brand logo's own
   (multicolor) fills intact */
[data-pane="sidebar"] svg:not(.hHd-Xa_brand svg, .hHd-Xa_logoRow svg) {
  fill: currentColor !important;
  stroke: currentColor !important;
}

/* ── session stats: ONE composed status line ──
   The stock stats bar (React-owned — it rewrites its spans on every
   re-render) is hidden outright; its text is folded into a single
   plain-text line docked at the left of the composer row. No span
   reordering, no injected separators, no label rewriting in the stock
   DOM — compose one string, set textContent on our own element, and
   there is nothing React can fight. */
.FJxK0a_root {
  display: none !important;
}
.tui-statusline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  min-height: 28px;
  padding: 0 10px;
  font-family: var(--ds-font-family-code);
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: var(--dsw-alias-label-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tui-statusline.tui-empty {
  display: none;
}
/* separators in kitty color25 (#005faf): "|" between groups, "·" inside a
   group (e.g. "LLM 2m8s · Tool 0.3s"); the outer bars are bolder and get
   breathing room, the inner dots stay tight */
.tui-statusline .tui-sep,
.tui-statusline .tui-sep-dot {
  color: #005faf;
}
.tui-statusline .tui-sep {
  margin: 0 8px;
  font-weight: 700;
}
.tui-statusline .tui-sep-dot {
  margin: 0 5px;
}
/* prompt glyph: Material folder in kitty color25 (#005faf) */
.tui-statusline::before {
  content: "";
  flex: none;
  width: 16px;
  height: 16px;
  background: center / contain no-repeat url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23005faf'%3E%3Cpath d='M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z'/%3E%3C/svg%3E");
}

/* ── context meter: same borderless segment as the stats cluster ──
   The round context-load ball (JObwrW_trigger) keeps its progress ring and
   percent readout (data-pct set by the dock feature), but loses its own
   chip frame — it sits flush next to the stats cluster in the same 28px
   status row, separated by the same gap the stats groups use. */
.JObwrW_root .JObwrW_trigger {
  box-sizing: border-box;
  width: auto;
  height: 28px;
  border-radius: 0;
  background: transparent;
  border: none;
  padding: 0 4px 0 10px;
  gap: 6px;
  display: inline-flex;
  align-items: center;
  font-family: var(--ds-font-family-code);
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: var(--dsw-alias-label-secondary);
}
.JObwrW_root .JObwrW_trigger svg {
  width: 14px;
  height: 14px;
}
.JObwrW_root .JObwrW_trigger[data-pct]::after {
  content: attr(data-pct) "%";
  font-family: var(--ds-font-family-code);
  font-size: 14px;
}
.JObwrW_root .JObwrW_fill {
  stroke: var(--dsw-alias-state-business-primary);
}

/* ── "Full access" badge: third segment of the same borderless status row ──
   The permission preset trigger keeps its icon + label + chevron but drops
   its rounded-pill look: same 28px height, same squared corners, same
   Iosevka typography as the stats cluster and the context meter, so all
   three read as one status row. */
.Sh0Q9G_trigger {
  height: 28px;
  border-radius: 0;
  background: transparent;
  border: none;
  padding: 0 2px 0 10px;
  font-family: var(--ds-font-family-code);
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: var(--dsw-alias-label-secondary);
}
.Sh0Q9G_trigger:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
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
/* composer seat: edge-to-edge terminal input bar — span the whole center
   column (flush with the sidebar on the left, the viewport edge on the
   right). The seat sits in the conversation scrollport whose
   scrollbar-gutter reserves 8px on the right, so widen by that gutter and
   pull the extra width back with a negative margin (the scrollport's
   overflow-x:hidden would otherwise clip it). Zeroing
   --dsh-composer-side-clearance drops the base theme's 16px side padding
   on .uV2eYG_root/.uV2eYG_hero so the black card touches both edges. */
[data-composer-seat] {
  --dsh-composer-side-clearance: 0px;
  width: calc(100% + var(--dsh-scrollbar-width, 8px));
  max-width: none;
  margin-left: 0;
  margin-right: calc(-1 * var(--dsh-scrollbar-width, 8px));
}
/* composer: pin the input bar flush to the very bottom of the viewport —
   the hero state centers the stack (justify-content:center on the
   scrollport), so margin-top:auto eats the free space and wins over the
   centering; the stock 32px bottom padding goes away. In a long
   conversation nothing changes: the stack scrolls with the messages. */
.wSkVaW_composerStack {
  margin-top: auto;
  padding-bottom: 0;
}
/* the composer root carries an extra 8px bottom padding — drop it so the
   input card itself touches the viewport edge */
.uV2eYG_root {
  padding-bottom: 0;
}
/* composer bottom row: a small left indent so the status readout breathes
   off the card edge — the docked stats, context meter and Full access badge
   read as one row of text, not glued to the edge */
.uV2eYG_row {
  padding-left: 14px;
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
/* user messages: near-black terminal block, Iosevka Medium — one step
   bolder than the GUI's regular Iosevka (400), same 14px size, text lighter
   than the previous Fira Code (#dce8f5). The black block + green left rail
   still make it the loudest element in the column. */
.gdEzaW_bubble {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.82), rgba(0, 0, 0, 0.72));
  border: 1px solid #0d2b40;
  border-left: 3px solid var(--dsw-alias-state-success-primary);
  border-radius: 0;
  padding: 6px 14px;
  max-width: 100%;
  color: #f0f6ff;
  font-family: "Iosevka", "Iosevka Medium", var(--ds-font-family-code);
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0.01em;
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
  background: rgba(4, 15, 28, 0.6);
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
/* composer card: fully black input surface with a dark color25 frame;
   the frame stays the same when the input is focused (no accent recolor) */
.uV2eYG_card,
.bqrRRG_card {
  background: #000000;
  border: 1px solid #002c52;
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
   The GUI runs the English locale, so the aria-labels are the en strings
   ("Send message" / "Stop generating"). */
[data-composer-card] button[aria-label="Send message"],
[data-composer-card] button[aria-label="Stop generating"],
[data-composer-card] button[aria-haspopup="menu"] {
  display: none;
}

/* ── buttons-to-commands (step 4): hide message + queue action buttons ──
   Ctrl+Alt+C copies the last message, Ctrl+Alt+B branches it,
   Ctrl+Alt+E / Ctrl+Alt+Backspace edit/remove the last queued message
   (JS feature below). Scope [data-time-hover-root] × [class$="_actions"]
   keeps code-block copy buttons (deep inside the body) intact. */
[data-time-hover-root] [class$="_actions"] [aria-label="Copy"],
[data-time-hover-root] [class$="_actions"] [aria-label="Copied"],
[data-time-hover-root] [class$="_actions"] [aria-label="Branch into a new conversation"],
button[aria-label="Edit queued message"],
button[aria-label="Remove queued message"],
button[aria-label="Steer queued message"] {
  display: none;
}

/* ── buttons-to-commands (step 5): hide sidebar new-session buttons ──
   Both the brand wordmark and the labeled New Chat button carry the same
   "New session" aria-label and both start a new session; Ctrl+Alt+N / the
   /new command replace them (JS feature below). */
button[aria-label="New session"] {
  display: none;
}

/* ── buttons-to-commands (step 5b): /new menu group title ──
   The client /new source renders as its own "/" menu group ("local");
   hide its title row so /new reads as part of the commands group. */
[data-source="local"] {
  display: none;
}

/* ── autocomplete: neg.nvim Pmenu style ──
   Mirrors the popup menu of the neg.nvim theme (lua/neg/groups/editor.lua
   + palette.lua): pure black Pmenu on a #121212 frame, text #6c7e96,
   selected row #131e30 with deep blue #005faf text (PmenuSel), scrollbar
   with #131e30 track / #005faf thumb. Applies to the native "/" menu
   (listbox) and to the custom /session & /workspace autocomplete popups
   (rows carry the .tui-ac-* classes below). */
[data-composer-card] [role="listbox"],
[data-tui-autocomplete] {
  background: #000000;
  border: 1px solid #121212;
  border-radius: 0;
  color: #6c7e96;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.55);
  padding: 2px;
  font-family: var(--ds-font-family-code);
}
[data-composer-card] [role="listbox"] [class$="_item"] {
  border-radius: 0;
  min-height: 30px;
  padding: 5px 10px;
  font-family: var(--ds-font-family-code);
  font-size: 13px;
  line-height: 20px;
  color: #6c7e96;
  font-style: italic;
}
[data-composer-card] [role="listbox"] [class$="_item"]:hover,
[data-composer-card] [role="listbox"] [class$="_item"][class$="_active"] {
  background: #131e30;
  color: #005faf;
  box-shadow: none;
}
[data-composer-card] [role="listbox"] [class$="_itemName"] {
  color: inherit;
}
[data-composer-card] [role="listbox"] [class$="_itemDescription"] {
  color: #3c4754;
  font-style: normal;
}
[data-composer-card] [role="listbox"] [class$="_groupTitle"] {
  font-family: var(--ds-font-family-code);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3c4754;
}
/* custom popup rows (Pmenu items) */
[data-tui-autocomplete] .tui-ac-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 4px 10px;
  cursor: pointer;
  border-radius: 0;
  white-space: nowrap;
  overflow: hidden;
  color: #6c7e96;
}
[data-tui-autocomplete] .tui-ac-row.tui-ac-active {
  background: #131e30;
  color: #005faf;
}
[data-tui-autocomplete] .tui-ac-mark {
  flex: none;
  width: 1em;
  color: #3c4754;
}
[data-tui-autocomplete] .tui-ac-row.tui-ac-active .tui-ac-mark {
  color: #005faf;
}
[data-tui-autocomplete] .tui-ac-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-style: italic;
}
[data-tui-autocomplete] .tui-ac-name.tui-ac-archived {
  color: #3c4754;
}
[data-tui-autocomplete] .tui-ac-row.tui-ac-active .tui-ac-name {
  color: #005faf;
}
[data-tui-autocomplete] .tui-ac-sub {
  flex: none;
  max-width: 45%;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #3c4754;
  font-size: 11px;
  font-style: normal;
}
/* Pmenu scrollbar: #131e30 track, #005faf thumb */
[data-tui-autocomplete]::-webkit-scrollbar,
[data-composer-card] [role="listbox"] ::-webkit-scrollbar {
  width: 8px;
}
[data-tui-autocomplete]::-webkit-scrollbar-track,
[data-composer-card] [role="listbox"] ::-webkit-scrollbar-track {
  background: #131e30;
}
[data-tui-autocomplete]::-webkit-scrollbar-thumb,
[data-composer-card] [role="listbox"] ::-webkit-scrollbar-thumb {
  background: #005faf;
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

/* ── buttons-to-commands (step 9): trajectory, settings, panels → commands ──
   Chat/Trajectory view tabs → /trajectory (clicks the matching tab)
   Sidebar settings trigger  → /settings (clicks the hidden button)
   Panel show/hide           → /sidebar /details /panels (layout service)
   The closed sidebar keeps a 56px icon rail (the resolved width when the
   sidebar preference is 0); killing it is handled in JS (feature below)
   because the details track width is dynamic and cannot be recreated in
   pure CSS without breaking the grid item order. */
.wSkVaW_tabs {
  display: none;
}
button[aria-label="Settings"],
.VOzbGW_trigger {
  display: none;
}

/* ── buttons-to-commands (step 10): workspace row buttons → commands ──
   Sidebar workspace rows carry three buttons: the ellipsis menu (Rename /
   Delete workspace), "+" (New session in this workspace) and the header
   "Add workspace". /workspace <name> switches to a workspace, /workspace
   rename|delete|add do the menu actions (client command source below), /new
   starts sessions in the current workspace. CSS hides the buttons; the DOM
   stays intact. */
button[aria-label^="Workspace actions for"],
button[aria-label^="New session in "],
button[aria-label="Add workspace"] {
  display: none;
}

/* ── buttons-to-commands (step 10): remote-control footer buttons → commands ──
   The @linxin666/dsh-remote-web-ui plugin renders two sidebar footer
   triggers: the phone icon ("Mobile remote control", pairing QR panel) and
   the download icon ("Check for updates", self-update panel). /phone and
   /update click the hidden buttons (same dispatch as /settings). */
button[aria-label="Mobile remote control"],
button[aria-label="Check for updates"] {
  display: none;
}

/* ── buttons-to-commands (step 12): memory panel button → command ──
   dsh-memento mounts a floating "#mem-open" button (bottom-right) that
   toggles the memory observer drawer. /memory clicks the hidden button
   (same dispatch as /settings); CSS hides it. The panel itself (#mem-drawer)
   is untouched — it opens on command and closes via its own ✕/Refresh. */
#mem-open {
  display: none;
}

/* workspace command feedback: transient status line above the composer
   (success green / error red border), same family as tui-search */
.tui-ws-status {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 110;
  display: none;
  box-sizing: border-box;
  max-width: min(720px, 80vw);
  padding: 6px 12px;
  background: var(--dsw-specific-menu);
  border: 1px solid var(--dsw-alias-state-success-primary);
  border-radius: 4px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5);
  font-family: var(--ds-font-family-code);
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── tui-jsonfmt: syntax-highlighted JSON in tool-call IN/OUT cards ──
   The JS feature rewrites .o3BgMG_ioText / .CY-8Ka_ioText nodes whose text
   is valid JSON into a highlighted form: colored tokens (keys / strings /
   numbers / booleans / null), one line for short payloads (<= 160 chars),
   two-space indent otherwise, and a collapse marker on long payloads (click
   to expand, Nerd Font chevron). The block keeps the base pre-wrap layout;
   only token colors are added. */
.o3BgMG_ioText.tui-json,
.CY-8Ka_ioText.tui-json {
  font-variant-ligatures: none;
}
.tui-json .tui-json-punct {
  color: var(--dsw-alias-label-tertiary);
}
.tui-json .tui-json-key {
  color: #7fb3e0; /* key names — light steel blue */
}
.tui-json .tui-json-str {
  color: var(--dsw-alias-state-success-primary); /* strings — green */
}
.tui-json .tui-json-num {
  color: #e6c07b; /* numbers — warm gold */
}
.tui-json .tui-json-bool {
  color: var(--dsw-alias-state-warn-primary); /* true/false — lilac */
}
.tui-json .tui-json-null {
  color: var(--dsw-alias-state-warn-primary);
  font-style: italic;
}
/* collapsed long payloads: click to expand */
.o3BgMG_ioText.tui-json.tui-json-collapsed,
.CY-8Ka_ioText.tui-json.tui-json-collapsed {
  cursor: pointer;
  max-height: 9em;
  overflow: hidden;
  position: relative;
}
.o3BgMG_ioText.tui-json.tui-json-collapsed::after,
.CY-8Ka_ioText.tui-json.tui-json-collapsed::after {
  content: "󰅂  … развернуть";
  position: sticky;
  bottom: 0;
  left: 0;
  display: block;
  padding: 1px 6px;
  background: rgba(4, 15, 28, 0.9);
  border-top: 1px solid var(--dsw-alias-border-l1);
  color: var(--dsw-alias-state-business-primary);
  font-family: "FiraCode Nerd Font", var(--ds-font-family-code);
  font-size: 11px;
  line-height: 16px;
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

      // ── feature: current-directory readout for the docked stats row ──
      // The active session's cwd (its workspace directory) is mirrored at the
      // left edge of the status row like a shell prompt. The sessions store
      // carries `cwd` per record; the stats dock (above) reads this variable
      // on every pass, and the inject keeps it in sync across session
      // switches. Client lives for the page lifetime — no teardown needed.
      let tuiCwd = "";
      ctx.inject(["sessions"], (scope) => {
        const syncCwd = () => {
          const snap = scope.sessions.list.getSnapshot();
          const rec = snap.current !== void 0 ? snap.byId?.[snap.current] : void 0;
          tuiCwd = rec?.cwd ?? "";
        };
        syncCwd();
        scope.sessions.list.subscribe(syncCwd);
      });

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
        {
{
  // tui-no-zh: the shell bundle (dsh-web-app) hardcodes Chinese labels for a
  // few components instead of going through the locale service, so they stay
  // Chinese no matter which locale the app resolves — the diff-expand button
  // ("… 其余 N 行"), its aria-labels ("展开其余 N 行…"/"收起…"), code-block
  // copy buttons ("复制"/"复制成功"), terminal pills ("已完成"/"无输出") and
  // the reconnect toast ("连接已断开，正在重连…"). Rewrite those exact
  // strings to English on every mutation (same observer pattern as
  // tui-no-tps). Only exact/structural zh phrases are matched, so message
  // content is never touched.
  const ZH_RULES = [
    [/^… 其余 (\d+) 行输出$/, (n) => `… ${n} more output lines`],
    [/^… 其余 (\d+) 行差异$/, (n) => `… ${n} more diff lines`],
    [/^… 其余 (\d+) 行结果$/, (n) => `… ${n} more result lines`],
    [/^… 其余 (\d+) 行$/, (n) => `… ${n} more lines`],
    [/^展开其余 (\d+) 行输出$/, (n) => `Expand the remaining ${n} output lines`],
    [/^展开其余 (\d+) 行差异$/, (n) => `Expand the remaining ${n} diff lines`],
    [/^展开其余 (\d+) 行结果$/, (n) => `Expand the remaining ${n} result lines`],
    [/^展开其余 (\d+) 行$/, (n) => `Expand the remaining ${n} lines`],
    [/^收起输出$/, "Collapse output"],
    [/^收起内容$/, "Collapse"],
    [/^收起差异$/, "Collapse diff"],
    [/^收起$/, "Collapse"],
    [/^复制成功$/, "Copied"],
    [/^复制$/, "Copy"],
    [/^已完成$/, "Done"],
    [/^无输出$/, "No output"],
    [/^连接已断开，正在重连…$/, "Connection lost, reconnecting…"],
  ];
  const applyRules = (text) => {
    const t = text.trim();
    for (const [re, to] of ZH_RULES) {
      const m = re.exec(t);
      if (m === null) continue;
      return typeof to === "function" ? to(...m.slice(1)) : to;
    }
    return text;
  };
  const rewrite = () => {
    // text nodes
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const hits = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeType !== 3 || !/[\u4e00-\u9fff]/.test(node.textContent || "")) continue;
      const replaced = applyRules(node.textContent || "");
      if (replaced !== node.textContent) hits.push([node, replaced]);
    }
    for (const [node, replaced] of hits) if (node.isConnected) node.textContent = replaced;
    // aria-labels on buttons (expand/collapse + copy)
    for (const el of document.querySelectorAll("[aria-label]")) {
      const label = el.getAttribute("aria-label");
      if (label === null || !/[\u4e00-\u9fff]/.test(label)) continue;
      const replaced = applyRules(label);
      if (replaced !== label) el.setAttribute("aria-label", replaced);
    }
  };
  rewrite();
  let timer = 0;
  const mo = new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(rewrite, 300);
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
          //              run is in flight)
          //   Ctrl+C   → terminal-style interrupt: stop the run; copy keeps
          //              priority (selection in the composer/page, or focus
          //              in another field — the browser owns Ctrl+C there)
          //   Ctrl+M   → open the model picker (the hidden [aria-haspopup="menu"]
          //              trigger; arrows/Enter work inside the picker)
          // Bubble-phase listener: React's own key handlers (popup dismissal,
          // etc.) run first, so Esc closes open menus before we stop.
          const STOP = 'button[aria-label="Stop generating"]';
          const EDIT_LABELS = ["Edit queued message"];
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
            if ((e.ctrlKey || e.metaKey) && e.code === "KeyC") {
              const ta = document.querySelector("[data-composer-card] textarea");
              const ae = document.activeElement;
              const composerSel = ta !== null && ta.selectionStart !== ta.selectionEnd;
              const pageSel = window.getSelection() && window.getSelection().toString() !== "";
              const otherField = ae !== null && ae !== document.body && ae !== ta;
              if (composerSel || pageSel || otherField) return;
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
          // aria-labels are the English strings of the running UI.
          const BRANCH = 'button[aria-label="Branch into a new conversation"]';
          const EDIT = 'button[aria-label="Edit queued message"]';
          const REMOVE = 'button[aria-label="Remove queued message"]';
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
          // Ctrl+Alt+N → new session (the "New session" buttons are hidden by CSS)
          // Ctrl+Alt+J → next session in the sidebar list (treeitem w/ aria-selected)
          // Ctrl+Alt+K → previous session
          // Ctrl+Alt+W → open the workspace picker while the composer shows
          //              the "Choose workspace" trigger (inert session, no workspace)
          // e.code again: RU layout must not break these.
          const NEW = 'button[aria-label="New session"]';
          const WORKSPACE = "Choose workspace";
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
              // While inert (no workspace), the composer is a "Choose workspace"
              // trigger: the textarea click bubbles to the card's onClick → picker opens.
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
          let expandTimer = null;
          const expand = () => {
            const column = document.querySelector(".Md3f7G_column");
            if (!column) return;
            for (const row of column.querySelectorAll('[data-disclosure-row][role="button"][aria-expanded="false"]')) {
              if (opened.has(row) || !isTarget(row)) continue;
              opened.add(row);
              row.click();
            }
          };
          // Debounce through a macrotask: the observer fires once per mutation
          // batch, and row.click() re-renders the list (new DOM nodes, new
          // childList mutations). Running expand() synchronously from the
          // callback turns that into an infinite microtask loop that starves
          // the event loop (100% CPU, unbounded memory). A 120ms timeout
          // collapses the storm: React settles aria-expanded between runs, so
          // the backlog drains and the loop converges.
          const scheduleExpand = () => {
            if (expandTimer !== null) return;
            expandTimer = setTimeout(() => { expandTimer = null; expand(); }, 120);
          };
          expand();
          const mo = new MutationObserver(scheduleExpand);
          mo.observe(document.body, { childList: true, subtree: true });
          cleanups.push(() => { if (expandTimer !== null) clearTimeout(expandTimer); mo.disconnect(); });
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
        // ── feature: session stats as ONE composed status line ──
        // The stock stats bar (React-owned, rewrites its spans on every
        // re-render) is hidden via CSS; its text is folded into a single
        // plain-text line docked at the left of the composer row. No span
        // reordering, no injected separators, no label rewriting in the
        // stock DOM — compose one string and set textContent on our own
        // element, so there is nothing React can fight.
        {
          const LINE_CLASS = "tui-statusline";
          const ensureLine = () => {
            let line = document.querySelector("." + LINE_CLASS);
            if (line !== null) return line;
            const row = document.querySelector(".uV2eYG_row");
            if (row === null) return null;
            line = document.createElement("div");
            line.className = LINE_CLASS;
            const tools = row.querySelector(".uV2eYG_tools");
            (tools || row).insertBefore(line, (tools || row).firstChild);
            return line;
          };
          // Normalize one stock group: collapse whitespace, shorten "Tool
          // call" to "Tool" (the stock label for tool wall time).
          const norm = (t) =>
            t.split("·").map((p) => p.replace(/\s+/g, " ").trim().replace(/\bTool call\b/i, "Tool")).join(" · ");
          // Compose the status line: cwd, then the model, then the stock
          // groups in stock order, joined with plain " | " separators.
          const compose = (stats) => {
            const out = [];
            if (tuiCwd !== "") out.push(tuiCwd.replace(/^\/home\/[^/]+/, "~"));
            const seat = document.querySelector('.uV2eYG_trailing button[aria-haspopup="menu"]');
            const model = (seat?.getAttribute("title") || seat?.getAttribute("aria-label") || "").trim();
            if (model !== "") out.push(model);
            for (const span of stats.querySelectorAll(":scope > span")) {
              const t = (span.textContent ?? "").replace(/\s+/g, " ").trim();
              if (t === "" || /^[|·•/]+$/.test(t)) continue;
              const cache = /Cache hit\s+([0-9]+%)/i.exec(t);
              if (cache !== null) { out.push("Hit " + cache[1]); continue; }
              if (/TTFT/i.test(t)) {
                // drop the TTFT latency figure — keep the throughput part
                const segs = t.split("·");
                const last = segs.length > 1 ? segs[segs.length - 1] : "";
                if (last.trim() !== "") out.push(norm(last));
                continue;
              }
              const tin = /Input\s+([0-9.]+[KM]?)\s*tok/i.exec(t);
              const tout = /Output\s+([0-9.]+[KM]?)\s*tok/i.exec(t);
              if (tin !== null || tout !== null) {
                out.push("IN " + (tin?.[1] ?? "?") + " / OUT " + (tout?.[1] ?? "?"));
                continue;
              }
              out.push(norm(t));
            }
            return out;
          };
          const render = () => {
            const stats = document.querySelector(".FJxK0a_root");
            const line = ensureLine();
            if (stats === null || line === null) return;
            const parts = compose(stats);
            const joined = parts.join("|");
            if (line.dataset.last !== joined) {
              line.dataset.last = joined;
              // One group can carry an inner "·" (e.g. "LLM 2m8s · Tool
              // 0.3s"); split it so the dot gets its own colored span too.
              const appendGroup = (frag, group) => {
                const segs = group.split("·");
                segs.forEach((seg, j) => {
                  if (j > 0) {
                    const dot = document.createElement("span");
                    dot.className = "tui-sep-dot";
                    dot.setAttribute("aria-hidden", "true");
                    dot.textContent = "·";
                    frag.appendChild(dot);
                  }
                  const t = seg.trim();
                  if (t !== "") frag.appendChild(document.createTextNode(t));
                });
              };
              const frag = document.createDocumentFragment();
              parts.forEach((p, i) => {
                if (i > 0) {
                  const sep = document.createElement("span");
                  sep.className = "tui-sep";
                  sep.setAttribute("aria-hidden", "true");
                  sep.textContent = "|";
                  frag.appendChild(sep);
                }
                appendGroup(frag, p);
              });
              line.replaceChildren(frag);
              line.classList.toggle("tui-empty", parts.length === 0);
            }
          };
          let dockTimer = null;
          const scheduleDock = () => {
            if (dockTimer !== null) return;
            dockTimer = setTimeout(() => { dockTimer = null; render(); }, 120);
          };
          render();
          const mo = new MutationObserver(scheduleDock);
          mo.observe(document.body, { childList: true, subtree: true, characterData: true });
          cleanups.push(() => { if (dockTimer !== null) clearTimeout(dockTimer); mo.disconnect(); });
        }

        // ── feature: kill the 56px sidebar rail on collapse ──
        // The layout service resolves a closed sidebar preference to the
        // compact icon rail (56px) and the AppFrame bakes it into the
        // frame's inline grid-template-columns ("56px minmax(0,1fr) …").
        // display:none on the column would renumber the grid items and drop
        // the chat into the rail track, so instead rewrite the inline
        // template's first track to 0 and leave the rest (the details track
        // is dynamic) untouched. React re-renders the inline style on every
        // layout change (drag, /details, /panels), so re-apply on
        // mutations plus a slow interval as belt-and-suspenders.
        {
          const fixRail = () => {
            const frame = document.querySelector(".pI_x6G_frame");
            if (!(frame instanceof HTMLElement)) return;
            if (!frame.hasAttribute("data-sidebar-collapsed")) return;
            const tpl = frame.style.gridTemplateColumns || "";
            const fixed = tpl.replace(/^\s*\d+(?:\.\d+)?px/, "0px");
            if (fixed !== tpl) frame.style.gridTemplateColumns = fixed;
          };
          fixRail();
          const railTimer = setInterval(fixRail, 600);
          const railMo = new MutationObserver(fixRail);
          const watch = () => {
            const frame = document.querySelector(".pI_x6G_frame");
            if (frame instanceof HTMLElement) {
              railMo.observe(frame, { attributes: true, attributeFilter: ["style", "data-sidebar-collapsed", "class"] });
              return true;
            }
            return false;
          };
          if (!watch()) {
            const bootTimer = setInterval(() => { if (watch()) clearInterval(bootTimer); }, 500);
            cleanups.push(() => clearInterval(bootTimer));
          }
          cleanups.push(() => {
            clearInterval(railTimer);
            railMo.disconnect();
          });
        }
        // ── feature: tui-jsonfmt — highlight JSON tool output, one line when short ──
        // Tool-call cards render IN/OUT payloads as a single pre-wrap text
        // node (.o3BgMG_ioText / .CY-8Ka_ioText inside their ioCards). When
        // that text parses as JSON, rewrite it into a highlighted form:
        //   - short payloads (<= 160 chars) stay on one line — small tool
        //     args like {"job_id": "bash-9", ...} must not sprawl across the
        //     chat (user preference);
        //   - longer payloads get two-space indent (JSON.stringify(…, null, 2));
        //   - colored tokens: keys / strings / numbers / booleans / null
        //     (CSS classes tui-json-*);
        //   - long payloads (> 4000 chars) collapse to 9em, click to expand
        //     (expanded state remembered per node in a WeakSet).
        // React rewrites the text node on re-render, so a MutationObserver
        // re-applies on every change (same pattern as tui-no-tps). Nodes we
        // already converted carry a data-tui-json marker to skip rework.
        {
          const converted = new WeakSet(); // nodes the user expanded
          const escHtml = (s) =>
            String(s).replace(/[&<>"']/g, (c) =>
              ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

          // Tokenize a JSON string into highlighted spans. Keys are strings
          // immediately followed (after whitespace) by ":", so scan tokens
          // left-to-right and lookahead after each string literal.
          const highlight = (json) => {
            const esc = escHtml;
            const out = [];
            let i = 0;
            const n = json.length;
            const push = (text, cls) => {
              if (text === "") return;
              out.push(cls ? `<span class="${cls}">${esc(text)}</span>` : esc(text));
            };
            const skipWs = (from) => { let j = from; while (j < n && /\s/.test(json[j])) j++; return j; };
            const readString = (start) => {
              // json[start] === '"' — return [literal, nextIndex]
              let j = start + 1;
              let lit = '"';
              while (j < n) {
                const c = json[j];
                lit += c;
                j++;
                if (c === "\\" && j < n) { lit += json[j]; j++; continue; }
                if (c === '"') break;
              }
              return [lit, j];
            };
            while (i < n) {
              const ch = json[i];
              if (/\s/.test(ch)) { push(ch); i++; continue; }
              if (ch === '"') {
                const [lit, next] = readString(i);
                // key if followed (after ws) by ":"
                const after = skipWs(next);
                const isKey = after < n && json[after] === ":";
                push(lit, isKey ? "tui-json-key" : "tui-json-str");
                i = next;
                continue;
              }
              if (/[0-9-]/.test(ch)) {
                let j = i;
                let num = "";
                while (j < n && /[0-9eE+\-.]/.test(json[j])) { num += json[j]; j++; }
                push(num, "tui-json-num");
                i = j;
                continue;
              }
              if (json.startsWith("true", i) || json.startsWith("false", i)) {
                push(json.slice(i, i + 5), "tui-json-bool");
                i += 5;
                continue;
              }
              if (json.startsWith("null", i)) {
                push("null", "tui-json-null");
                i += 4;
                continue;
              }
              if (ch === ":" || ch === "," || ch === "{" || ch === "}" || ch === "[" || ch === "]") {
                push(ch, "tui-json-punct");
                i++;
                continue;
              }
              push(ch);
              i++;
            }
            return out.join("");
          };

          // Rebuild: strip previous spans (use the saved raw text) and produce
          // the highlighted HTML. Idempotent: if the node already carries our
          // highlight spans (React did not rewrite it since), skip. React
          // re-renders replace the spans with a plain text node — the scan
          // then re-applies from the fresh text.
          const apply = (node) => {
            if (!(node instanceof HTMLElement)) return;
            if (node.classList.contains("tui-json") && node.querySelector(".tui-json-key, .tui-json-str, .tui-json-num") !== null) {
              return; // already highlighted and untouched by React
            }
            const raw = (node.textContent || "").trim();
            if (raw === "") return;
            if (raw.length < 2 || !/^[\[{]/.test(raw)) return;
            // cap: skip enormous payloads (JSON.parse on MBs of tool output
            // would jank the UI on every re-render)
            if (raw.length > 200000) return;
            let parsed;
            try {
              parsed = JSON.parse(raw);
            } catch {
              return; // not JSON — leave untouched
            }
            const oneLine = JSON.stringify(parsed);
            const pretty =
              oneLine !== undefined && oneLine.length <= 160
                ? oneLine
                : JSON.stringify(parsed, null, 2);
            if (pretty === undefined || pretty === "") return;
            const long = pretty.length > 4000;
            const body = highlight(pretty);
            node.innerHTML = body;
            node.classList.add("tui-json");
            node.setAttribute("data-tui-json", "1");
            if (long && !converted.has(node)) {
              node.classList.add("tui-json-collapsed");
              node.title = "клик — развернуть";
            }
          };

          // Toggle collapse on click for collapsed JSON blocks.
          const onDocClick = (e) => {
            const t = e.target;
            const node = t instanceof Element ? t.closest(".tui-json-collapsed") : null;
            if (node === null) return;
            e.preventDefault();
            e.stopPropagation();
            converted.add(node);
            node.classList.remove("tui-json-collapsed");
            node.title = "";
          };
          document.addEventListener("click", onDocClick, true);

          const scan = () => {
            document.querySelectorAll(".o3BgMG_ioText, .CY-8Ka_ioText").forEach(apply);
          };
          scan();
          const mo = new MutationObserver(() => {
            // debounce: React rewrites text nodes in bursts
            clearTimeout(scanTimer);
            scanTimer = setTimeout(scan, 200);
          });
          mo.observe(document.body, { childList: true, subtree: true, characterData: true });
          let scanTimer = 0;
          cleanups.push(() => {
            clearTimeout(scanTimer);
            mo.disconnect();
            document.removeEventListener("click", onDocClick, true);
          });
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
      ctx.inject(["inputTriggers", "workspaces", "sessions", "layout"], (scope) => {
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
        // Archive the current session durably, then land on the first
        // remaining session (the archived row disappears from the list) or
        // start a fresh one when nothing is left. Archiving the current
        // session clears `current` in the sessions store, so we must switch
        // explicitly (the sidebar archive flow relies on the same store).
        const archiveCurrent = async () => {
          const cur = scope.sessions.list.getSnapshot().current;
          if (cur === void 0) return;
          try {
            await scope.workspaces.archiveSession(cur);
          } catch {
            return; // unknown session or persistence failure — leave as is
          }
          requestAnimationFrame(() => {
            const items = sessionRows();
            if (items.length > 0) items[0].click();
            else scope.workspaces.startSession();
          });
        };
        // ── step 10 helpers: workspace commands ──
        // /workspace <name> switches to a workspace (opens its most recent
        // real session, or starts a blank one); rename/delete/add act on the
        // registry directly — the same services the sidebar menus drive.
        // Feedback goes to a transient status line above the composer.
        const wsList = () => scope.workspaces.list.getSnapshot().items;
        const resolveWorkspace = (q) => {
          const lower = q.toLowerCase();
          const all = wsList();
          const exactTitle = all.find((w) => (w.title ?? "").toLowerCase() === lower);
          if (exactTitle !== void 0) return exactTitle;
          const exactPath = all.find((w) => w.path.toLowerCase() === lower);
          if (exactPath !== void 0) return exactPath;
          const prefix = all.find((w) => (w.title ?? "").toLowerCase().startsWith(lower));
          if (prefix !== void 0) return prefix;
          return all.find((w) => (w.title ?? "").toLowerCase().includes(lower));
        };
        const switchWorkspace = (ws) => {
          const byId = scope.sessions.list.getSnapshot().byId ?? {};
          const sessions = (ws.sessionIds ?? []).map((id) => byId[id]).filter(Boolean);
          const target = sessions.find((s) => !s.blank) ?? sessions[0];
          if (target !== void 0) scope.sessions.open(target.id);
          else scope.workspaces.startSession(ws.workspaceId);
        };
        let statusEl = null;
        let statusTimer = 0;
        const wsStatus = (text, isError = false) => {
          if (statusEl === null) {
            statusEl = document.createElement("div");
            statusEl.className = "tui-ws-status";
            document.body.appendChild(statusEl);
          }
          statusEl.textContent = text;
          statusEl.style.borderColor = isError
            ? "var(--dsw-alias-state-error-primary)"
            : "var(--dsw-alias-state-success-primary)";
          const seat = document.querySelector("[data-composer-seat]");
          if (seat) {
            const r = seat.getBoundingClientRect();
            statusEl.style.bottom = Math.max(8, window.innerHeight - r.top + 12) + "px";
          } else {
            statusEl.style.bottom = "200px";
          }
          statusEl.style.display = "block";
          clearTimeout(statusTimer);
          statusTimer = setTimeout(() => { statusEl.style.display = "none"; }, 3200);
        };
        const wsAdd = async (path) => {
          const p = path.replace(/^["']|["']$/g, "").trim();
          if (p === "") { wsStatus("укажите путь: /workspace add <путь>", true); return; }
          try {
            const ws = await scope.workspaces.create({ path: p });
            wsStatus(`воркспейс «${ws.title}» добавлен: ${ws.path}`);
            switchWorkspace(ws);
          } catch (e) {
            wsStatus("не удалось добавить воркспейс: " + (e instanceof Error ? e.message : String(e)), true);
          }
        };
        const wsRename = async (rest) => {
          const all = [...wsList()].sort((a, b) => b.title.length - a.title.length);
          const old = all.find((w) => rest.startsWith(w.title));
          if (old === void 0) { wsStatus("не найден воркспейс: /workspace rename <имя> <новое>", true); return; }
          const title = rest.slice(old.title.length).trim();
          if (title === "") { wsStatus("укажите новое имя: /workspace rename <имя> <новое>", true); return; }
          try {
            const ws = await scope.workspaces.rename(old.workspaceId, title);
            wsStatus(`воркспейс переименован: «${ws.title}»`);
          } catch (e) {
            wsStatus("не удалось переименовать: " + (e instanceof Error ? e.message : String(e)), true);
          }
        };
        const wsDelete = async (q) => {
          const ws = resolveWorkspace(q);
          if (ws === void 0) { wsStatus(`воркспейс не найден: ${q}`, true); return; }
          try {
            await scope.workspaces.delete(ws.workspaceId);
            wsStatus(`воркспейс «${ws.title}» удалён из списка (папка и логи сохранены)`);
          } catch (e) {
            wsStatus("не удалось удалить: " + (e instanceof Error ? e.message : String(e)), true);
          }
        };
        const runWorkspaceLine = (args) => {
          if (args === "") return;
          if (args === "add") { wsStatus("укажите путь: /workspace add <путь>", true); return; }
          if (args === "rename") { wsStatus("укажите имя и новое имя: /workspace rename <имя> <новое>", true); return; }
          if (args === "delete") { wsStatus("укажите имя: /workspace delete <имя>", true); return; }
          if (args.startsWith("add ")) void wsAdd(args.slice(4));
          else if (args.startsWith("rename ")) void wsRename(args.slice(7).trim());
          else if (args.startsWith("delete ")) void wsDelete(args.slice(7).trim());
          else {
            const ws = resolveWorkspace(args);
            if (ws === void 0) wsStatus(`воркспейс не найден: ${args}`, true);
            else switchWorkspace(ws);
          }
        };
        // ── step 9 helpers: trajectory view, panels, settings ──
        // Chat/Trajectory are plain [role="tab"] buttons (their row is CSS-
        // hidden); /trajectory clicks the matching tab, toggling back to Chat
        // when the target is already the active view. The panel state is read
        // from the AppFrame's data-* attributes (set by dsh-client-ui-layout)
        // and driven through the layout service, whose toggleSidebar closes
        // the sidebar preference to 0 (the CSS above hides the 56px rail that
        // would otherwise remain), openDetails/closeDetails move the right
        // panel. The settings modal is component-local state, so /settings
        // clicks its (CSS-hidden) trigger button.
        const viewTab = (id) => Array.from(document.querySelectorAll('[role="tab"]')).find(
          (t) => (t.getAttribute("aria-label") || t.textContent || "").trim().toLowerCase() === id,
        );
        const toggleView = (id) => {
          const target = viewTab(id);
          if (target === void 0) return;
          if (target.getAttribute("aria-selected") === "true") {
            const chat = viewTab("chat");
            if (chat !== void 0) chat.click();
          } else {
            target.click();
          }
        };
        const frameEl = () => document.querySelector(".pI_x6G_frame");
        const sidebarCollapsed = () => frameEl()?.hasAttribute("data-sidebar-collapsed") ?? false;
        const detailsCollapsed = () => frameEl()?.hasAttribute("data-details-collapsed") ?? true;
        const layout = scope.layout;
        const toggleSidebar = () => { if (layout !== void 0 && typeof layout.toggleSidebar === "function") layout.toggleSidebar(); };
        const toggleDetails = () => {
          if (layout === void 0) return;
          if (detailsCollapsed()) layout.openDetails();
          else layout.closeDetails();
        };
        const togglePanels = () => {
          if (layout === void 0) return;
          if (sidebarCollapsed() && detailsCollapsed()) {
            // everything hidden → restore both panels
            layout.toggleSidebar();
            layout.openDetails();
          } else {
            if (!sidebarCollapsed()) layout.toggleSidebar();
            if (!detailsCollapsed()) layout.closeDetails();
          }
        };
        const openSettings = () => {
          // The trigger renders in two shapes on the pinned release: an
          // aria-label or a bare text label — match either.
          const btn = document.querySelector('button[aria-label="Settings"]')
            ?? Array.from(document.querySelectorAll("button")).find((b) => (b.textContent || "").trim() === "Settings");
          if (btn !== null && btn !== void 0 && !btn.disabled) btn.click();
        };
        // Generic click-by-aria-label for command replacements: /phone and
        // /update dispatch the remote-control/update triggers of
        // @linxin666/dsh-remote-web-ui (hidden by CSS below).
        const clickByLabel = (label) => {
          const btn = document.querySelector('button[aria-label="' + label + '"]');
          if (btn !== null && btn !== void 0 && !btn.disabled) btn.click();
        };
        // /mem: toggle the dsh-memento observer panel. dsh-memento mounts
        // a floating "#mem-open" button (bottom-right) that toggles the
        // drawer; its header comment mentions an F9 shortcut, but the shipped
        // client only wires click listeners — so the button is the sole real
        // trigger. We click the (CSS-hidden) button, same as /settings.
        // Named /mem, not /memory: dsh-memento already registers a host
        // /memory command (list/add/remove/budgets/audit/…), which loads
        // before the skin and wins the Enter adjudication — /memory would
        // collide with it in the "/" menu.
        const toggleMemory = () => {
          const btn = document.getElementById("mem-open");
          if (btn !== null && btn !== void 0 && !btn.disabled) btn.click();
        };
        // Search the session catalog and open the best match: first by
        // display title (exact > prefix > substring), then by message
        // content (sessions.search returns {items:[{sessionId,snippet}]}).
        // `all` (the /session find path) also matches the session's cwd path,
        // so untitled/ungrouped sessions stay reachable by directory.
        const openByQuery = async (rawQuery, opts = {}) => {
          const q = (rawQuery ?? "").trim();
          if (q === "") return;
          const lower = q.toLowerCase();
          const byId = scope.sessions.list.getSnapshot().byId ?? {};
          const entries = Object.values(byId);
          const hay = (s) => {
            const label = (s.displayTitle ?? s.title ?? "").toLowerCase();
            if (!opts.all) return label;
            return `${label} ${(s.cwd ?? "").toLowerCase()}`;
          };
          const byTitle = (kind) => entries.filter((s) => {
            const label = hay(s);
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
          if (trimmed === "/archive") {
            consume(session, { kind: "bare-token", token: trimmed });
            void archiveCurrent();
            return "handled";
          }
          if (trimmed === "/session" || trimmed.startsWith("/session ")) {
            // Bare "/session" is consumed but does nothing; "/session <query>"
            // opens the best match among the clean list (grouped + titled);
            // "/session find <query>" searches the FULL catalog — untitled,
            // ungrouped and archived sessions included — by title, path and
            // message content. Consumed either way — the line is a command,
            // not a chat message.
            consume(session, { kind: "bare-token", token: trimmed });
            const rest = trimmed.slice("/session".length).trim();
            if (rest === "find" || rest.startsWith("find ")) {
              void openByQuery(rest.slice("find".length), { all: true });
            } else {
              void openByQuery(rest);
            }
            return "handled";
          }
          if (trimmed === "/trajectory") {
            consume(session, { kind: "bare-token", token: trimmed });
            toggleView("trajectory");
            return "handled";
          }
          if (trimmed === "/sidebar") {
            consume(session, { kind: "bare-token", token: trimmed });
            toggleSidebar();
            return "handled";
          }
          if (trimmed === "/details") {
            consume(session, { kind: "bare-token", token: trimmed });
            toggleDetails();
            return "handled";
          }
          if (trimmed === "/panels") {
            consume(session, { kind: "bare-token", token: trimmed });
            togglePanels();
            return "handled";
          }
          if (trimmed === "/settings") {
            consume(session, { kind: "bare-token", token: trimmed });
            openSettings();
            return "handled";
          }
          if (trimmed === "/workspace" || trimmed.startsWith("/workspace ")) {
            // Bare "/workspace" is consumed but does nothing; with an argument
            // it switches to a workspace or runs add/rename/delete. Consumed
            // either way — the line is a command, not a chat message.
            consume(session, { kind: "bare-token", token: trimmed });
            runWorkspaceLine(trimmed.slice("/workspace".length).trim());
            return "handled";
          }
          if (trimmed === "/phone") {
            consume(session, { kind: "bare-token", token: trimmed });
            clickByLabel("Mobile remote control");
            return "handled";
          }
          if (trimmed === "/update") {
            consume(session, { kind: "bare-token", token: trimmed });
            clickByLabel("Check for updates");
            return "handled";
          }
          if (trimmed === "/mem") {
            consume(session, { kind: "bare-token", token: trimmed });
            toggleMemory();
            return "handled";
          }
          return void 0;
        };
        const COMMANDS = [
          { name: "new", description: "новый чат / новая сессия" },
          { name: "session", description: "перейти к сессии: /session <имя>; найти любую: /session find <текст>" },
          { name: "next", description: "следующая сессия" },
          { name: "prev", description: "предыдущая сессия" },
          { name: "archive", description: "архивировать текущую сессию" },
          { name: "workspace", description: "переключить воркспейс: /workspace <имя>; add/rename/delete" },
          { name: "trajectory", description: "переключить вид: траектория/чат" },
          { name: "sidebar", description: "показать/скрыть левую панель" },
          { name: "details", description: "показать/скрыть правую панель" },
          { name: "panels", description: "скрыть/показать все панели" },
          { name: "settings", description: "открыть настройки" },
          { name: "phone", description: "открыть панель мобильного управления (QR)" },
          { name: "update", description: "проверить обновления" },
          { name: "mem", description: "открыть/закрыть панель памяти (dsh-memento)" },
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
            if (name === "workspace") {
              // Leave "/workspace" in the draft so the user types the name or
              // a subcommand (add/rename/delete); Enter then dispatches.
              return "handled";
            }
            consume(pick.session, { kind: "span", span: pick.span });
            if (name === "new") scope.workspaces.startSession();
            else if (name === "next") cycle(1);
            else if (name === "prev") cycle(-1);
            else if (name === "archive") void archiveCurrent();
            else if (name === "trajectory") toggleView("trajectory");
            else if (name === "sidebar") toggleSidebar();
            else if (name === "details") toggleDetails();
            else if (name === "panels") togglePanels();
            else if (name === "settings") openSettings();
            else if (name === "phone") clickByLabel("Mobile remote control");
            else if (name === "update") clickByLabel("Check for updates");
            else if (name === "mem") toggleMemory();
            return "handled";
          },
          matchEnter: (session, line) => dispatchLine(session, line),
        });
        ctx.effect(() => disposer, "tui: /new source");

        // ── step 10: /workspace name autocomplete ──
        // While the composer line is "/workspace <partial>", show workspace
        // titles above the input; ArrowUp/Down navigate, Enter/Tab switches,
        // Esc dismisses (same capture-phase pattern as /session autocomplete).
        // Subcommand words (add/rename/delete) suppress the listing.
        const wsPopup = document.createElement("div");
        wsPopup.setAttribute("data-tui-autocomplete", "workspace");
        // visual styling (black Pmenu + #131e30 selection) lives in the CSS
        wsPopup.style.cssText = [
          "position:fixed", "z-index:200", "display:none", "box-sizing:border-box",
          "min-width:280px", "max-width:520px", "max-height:280px", "overflow-y:auto",
        ].join(";");
        document.body.appendChild(wsPopup);
        // key-hint footer — persistent child; dismiss removes only the rows
        const wsHint = document.createElement("div");
        wsHint.textContent = "↑↓ choose · Tab/Enter switch · Esc dismiss";
        wsHint.style.cssText = "padding:3px 10px 4px;color:#3c4754;font-size:11px;border-top:1px solid rgba(108,126,150,0.25);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
        let wsRows = [];
        let wsActive = 0;
        let wsBlurTimer = 0;
        const wsComposer = () => document.querySelector("[data-composer-card] textarea");
        const wsLabels = () => wsList().map((w) => ({ id: w.workspaceId, label: w.title ?? "", path: w.path }));
        const wsPaint = () => {
          const rows = Array.from(wsPopup.children).filter((el) => el !== wsHint);
          rows.forEach((el, i) => {
            el.classList.toggle("tui-ac-active", i === wsActive);
          });
        };
        const wsDismiss = () => {
          wsPopup.style.display = "none";
          for (const el of Array.from(wsPopup.children)) {
            if (el !== wsHint) el.remove();
          }
          wsRows = [];
        };
        const wsOpen = (id) => {
          wsDismiss();
          const ta = wsComposer();
          const line = ta !== null ? ta.value.trim() : "";
          const cur = scope.sessions.list.getSnapshot().current;
          const actx = cur !== void 0 ? scope.sessions.scope(cur) : void 0;
          if (actx !== void 0 && typeof actx.bail === "function" && line !== "") {
            actx.bail(actx, "slash/input-consume-token", { guard: { kind: "bare-token", token: line } });
          }
          const ws = wsList().find((w) => w.workspaceId === id);
          if (ws !== void 0) switchWorkspace(ws);
        };
        const wsRefresh = () => {
          const ta = wsComposer();
          if (ta === null || document.activeElement !== ta) { wsDismiss(); return; }
          const text = ta.value;
          const m = /^\/workspace\s+(\S*)$/.exec(text);
          if (m === null || ta.selectionStart !== text.length) { wsDismiss(); return; }
          const q = m[1].toLowerCase();
          if (q === "add" || q === "rename" || q === "delete") { wsDismiss(); return; }
          const all = wsLabels().filter((w) => w.label !== "");
          const items = q === "" ? all.slice(0, 8) : all.filter((w) => w.label.toLowerCase().includes(q)).slice(0, 8);
          wsRows = items;
          wsActive = 0;
          if (items.length === 0) { wsDismiss(); return; }
          for (const el of Array.from(wsPopup.children)) {
            if (el !== wsHint) el.remove();
          }
          items.forEach((item, i) => {
            const row = document.createElement("div");
            row.className = "tui-ac-row" + (i === 0 ? " tui-ac-active" : "");
            row.textContent = item.label;
            row.title = item.path;
            row.addEventListener("mousedown", (e) => { e.preventDefault(); wsOpen(item.id); });
            wsPopup.appendChild(row);
          });
          wsPopup.appendChild(wsHint);
          const r = ta.getBoundingClientRect();
          wsPopup.style.left = Math.max(8, r.left) + "px";
          wsPopup.style.width = Math.min(r.width, 520) + "px";
          wsPopup.style.bottom = Math.max(8, window.innerHeight - r.top + 8) + "px";
          wsPopup.style.display = "block";
        };
        const wsOnInput = () => wsRefresh();
        const wsOnKey = (e) => {
          if (wsPopup.style.display === "none" || wsRows.length === 0) return;
          const ta = wsComposer();
          if (ta === null || e.target !== ta) return;
          switch (e.key) {
            case "ArrowDown": e.preventDefault(); e.stopPropagation(); wsActive = (wsActive + 1) % wsRows.length; wsPaint(); break;
            case "ArrowUp": e.preventDefault(); e.stopPropagation(); wsActive = (wsActive - 1 + wsRows.length) % wsRows.length; wsPaint(); break;
            case "Enter":
            case "Tab": e.preventDefault(); e.stopPropagation(); wsOpen(wsRows[wsActive].id); break;
            case "Escape": e.preventDefault(); e.stopPropagation(); wsDismiss(); break;
          }
        };
        const wsOnBlur = () => { clearTimeout(wsBlurTimer); wsBlurTimer = setTimeout(wsDismiss, 150); };
        document.addEventListener("input", wsOnInput, true);
        document.addEventListener("keydown", wsOnKey, true);
        document.addEventListener("blur", wsOnBlur, true);
        ctx.effect(() => () => {
          document.removeEventListener("input", wsOnInput, true);
          document.removeEventListener("keydown", wsOnKey, true);
          document.removeEventListener("blur", wsOnBlur, true);
          clearTimeout(wsBlurTimer);
          wsPopup.remove();
          if (statusEl !== null) { clearTimeout(statusTimer); statusEl.remove(); }
        }, "tui: workspace commands");
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

      // ── feature: autofocus the composer input ──
      // Focus the composer textarea immediately: on page load (retrying while
      // the composer mounts late) and whenever the active session changes
      // (sidebar click, Ctrl+Alt+J/K, /session, /next, /prev, /new). Never
      // steals focus from an open modal or from another text field (sidebar
      // search, dialogs) the user is typing in.
      ctx.inject(["sessions"], (scope) => {
        const list = scope.sessions.list;
        const isTypingElsewhere = () => {
          const ae = document.activeElement;
          if (!ae || ae === document.body) return false;
          const tag = ae.tagName;
          return tag === "INPUT" || tag === "TEXTAREA" || ae.isContentEditable === true;
        };
        const focusInput = () => {
          if (document.querySelector('[aria-modal="true"]')) return;
          if (isTypingElsewhere()) return;
          const ta = document.querySelector("[data-composer-card] textarea");
          if (ta && !ta.disabled) ta.focus();
        };
        // On load: the composer mounts late — retry briefly.
        let tries = 0;
        const boot = setInterval(() => {
          if (tries++ >= 12) { clearInterval(boot); return; }
          if (document.querySelector("[data-composer-card] textarea")) {
            clearInterval(boot);
            focusInput();
          }
        }, 250);
        // On session switch: refocus after React renders the new session.
        let prev = list.getSnapshot().current;
        const unsub = list.subscribe(() => {
          const cur = list.getSnapshot().current;
          if (cur === prev) return;
          prev = cur;
          requestAnimationFrame(() => requestAnimationFrame(focusInput));
        });
        ctx.effect(() => () => {
          clearInterval(boot);
          unsub();
        }, "tui: composer autofocus");
      });

      // ── feature: buttons-to-commands (step 8): /session name autocomplete ──
      // The native "/" menu completes command NAMES but not their arguments.
      // While the composer line is "/session <partial>", show a small popup
      // above the input with matching session display titles; ArrowUp/Down
      // navigate, Enter/Tab opens the highlighted session (the line is
      // consumed like the bare /session command), Esc dismisses. Keys are
      // intercepted in the capture phase so React's Enter-submit never fires.
      // Plain "/session <query>" lists only grouped, titled sessions (clean
      // mode); "/session find <query>" switches the popup to the full catalog
      // (all mode) — untitled, ungrouped and archived rows included, matched
      // by title, path and content. Rows follow the sidebar's visibility
      // rules (no subagent or blank placeholders, except the current one);
      // archived sessions are marked
      // with a glyph and sorted last.
      ctx.inject(["sessions", "workspaces"], (scope) => {
        const popup = document.createElement("div");
        popup.setAttribute("data-tui-autocomplete", "session");
        // visual styling (black Pmenu + #131e30 selection) lives in the CSS
        popup.style.cssText = [
          "position:fixed", "z-index:200", "display:none", "box-sizing:border-box",
          "min-width:280px", "max-width:520px", "max-height:280px", "overflow-y:auto",
        ].join(";");
        document.body.appendChild(popup);
        // key-hint footer — persistent child; dismiss removes only the rows
        const hint = document.createElement("div");
        hint.textContent = "↑↓ choose · Tab/Enter open · Esc dismiss";
        hint.style.cssText = "padding:3px 10px 4px;color:#3c4754;font-size:11px;border-top:1px solid rgba(108,126,150,0.25);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
        let rows = [];
        let active = 0;
        let blurTimer = 0;
        const composer = () => document.querySelector("[data-composer-card] textarea");
        // Same visibility rules as the sidebar tree: no subagent
        // pseudo-sessions, no blank placeholders (except the current one),
        // no raw-id fallback labels. Archived sessions stay in the list but
        // are marked and sorted last; untitled sessions (label falls back to
        // the project basename) carry their full path so identical basenames
        // remain distinguishable.
        //
        // Two catalog modes:
        //  - default (`clean`): ONLY sessions that belong to a workspace
        //    group (not Ungrouped) AND carry a real title. Everything else —
        //    untitled path-fallback rows, Ungrouped strays, archived junk —
        //    is hidden from the plain /session picker and reachable through
        //    `/session find <query>` (mode `all` below).
        //  - `all` (/session find): every session, including untitled and
        //    ungrouped ones, with its cwd path shown for disambiguation.
        const sessionLabels = (mode = "clean") => {
          const snapshot = scope.sessions.list.getSnapshot();
          const byId = snapshot.byId ?? {};
          const current = snapshot.current;
          const archived = new Set(scope.workspaces?.list.getSnapshot().archivedSessionIds ?? []);
          const groupedIds = new Set();
          for (const ws of scope.workspaces?.list.getSnapshot().items ?? []) {
            for (const id of ws.sessionIds ?? []) groupedIds.add(id);
          }
          const out = [];
          for (const s of Object.values(byId)) {
            if (s.origin === "subagent") continue;
            if (s.blank && s.id !== current) continue;
            const label = s.displayTitle ?? s.title;
            if (!label || label === s.id) continue; // id-fallback labels are noise
            if (mode === "clean") {
              if (!groupedIds.has(s.id)) continue; // Ungrouped — only via /session find
              if (s.title === void 0) continue; // path-fallback label — only via /session find
            }
            out.push({
              id: s.id,
              label,
              path: s.title === void 0 ? (s.cwd ?? "") : "",
              archived: archived.has(s.id),
            });
          }
          // archived sessions last, host order preserved inside each group
          out.sort((a, b) => Number(a.archived) - Number(b.archived));
          return out;
        };
        const paint = () => {
          const rowsEl = Array.from(popup.children).filter((el) => el !== hint);
          rowsEl.forEach((el, i) => {
            el.classList.toggle("tui-ac-active", i === active);
          });
        };
        const dismiss = () => {
          popup.style.display = "none";
          for (const el of Array.from(popup.children)) {
            if (el !== hint) el.remove();
          }
          rows = [];
        };
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
          const findMatch = /^\/session\s+find(?:\s+(\S*))?$/.exec(text);
          const plainMatch = findMatch === null ? /^\/session\s+(\S*)$/.exec(text) : null;
          if ((findMatch === null && plainMatch === null) || ta.selectionStart !== text.length) { dismiss(); return; }
          const mode = findMatch !== null ? "all" : "clean";
          const q = ((findMatch ?? plainMatch)?.[1] ?? "").toLowerCase();
          const all = sessionLabels(mode);
          const haystack = (s) => (s.label + " " + s.path).toLowerCase();
          const items = q === "" ? all.slice(0, 8) : all.filter((s) => haystack(s).includes(q)).slice(0, 8);
          rows = items;
          active = 0;
          if (items.length === 0) { dismiss(); return; }
          for (const el of Array.from(popup.children)) {
            if (el !== hint) el.remove();
          }
          items.forEach((item, i) => {
            const row = document.createElement("div");
            row.className = "tui-ac-row" + (i === 0 ? " tui-ac-active" : "");
            if (item.archived) row.title = "archived session";
            const mark = document.createElement("span");
            mark.className = "tui-ac-mark";
            mark.textContent = item.archived ? "◫" : "";
            const name = document.createElement("span");
            name.className = "tui-ac-name" + (item.archived ? " tui-ac-archived" : "");
            name.textContent = item.label;
            row.appendChild(mark);
            row.appendChild(name);
            if (item.path !== "") {
              const sub = document.createElement("span");
              sub.className = "tui-ac-sub";
              sub.textContent = item.path;
              row.appendChild(sub);
            }
            row.addEventListener("mousedown", (e) => { e.preventDefault(); open(item.id); });
            popup.appendChild(row);
          });
          popup.appendChild(hint);
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

      // ── feature: Tab completes the native "/" trigger menu ──
      // The composer's own key handler ignores Tab, so while the "/" menu
      // (listbox) is open Tab would move focus into the menu instead of
      // picking the highlighted command. Intercept Tab in the capture phase
      // while the composer is focused and a trigger menu is open, and route
      // it through the same pick path as a click (mousedown on the active
      // option — React's onMouseDown handles it). Skipped while the custom
      // /session or /workspace autocomplete popups are visible — those own
      // Tab themselves (see data-tui-autocomplete).
      {
        const customOpen = () =>
          Array.from(document.querySelectorAll("[data-tui-autocomplete]"))
            .some((el) => el.style.display !== "none");
        const onTab = (e) => {
          if (e.key !== "Tab") return;
          if (customOpen()) return;
          const ta = document.querySelector("[data-composer-card] textarea");
          if (ta === null || document.activeElement !== ta) return;
          const menu = document.querySelector('[data-composer-card] [role="listbox"]');
          if (menu === null) return;
          const target =
            menu.querySelector('button[role="option"][aria-selected="true"]') ||
            menu.querySelector('button[role="option"]');
          if (target === null) return;
          e.preventDefault();
          e.stopPropagation();
          target.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, view: window }));
        };
        document.addEventListener("keydown", onTab, true);
        ctx.effect(() => () => {
          document.removeEventListener("keydown", onTab, true);
        }, "tui: slash-menu tab complete");
      }

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
