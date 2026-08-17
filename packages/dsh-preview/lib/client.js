// dsh-preview client half: nothing to do in the browser (host half only).
window.__ModuleLoader__.load({
  id: "dsh-preview",
  factory: (require) => {
    const inject = [];
    function apply() {}
    return { apply, inject };
  },
});
