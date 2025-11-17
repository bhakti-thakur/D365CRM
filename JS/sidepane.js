// askcrm.sidepane.js
var AskCRM = (function () {
  const PANE_ID = "bhaks_askcrm-pane";
  const CUSTOM_PAGE_NAME = "bhaks_askcrm_queryip"; // TODO: replace with your logical name

  async function ensurePane() {
    let pane = Xrm.App.sidePanes.getPane(PANE_ID);
    if (!pane) {
      pane = await Xrm.App.sidePanes.createPane({
        title: "AskCRM",
        paneId: PANE_ID,
        canClose: true,
        width: 520,
        isSelected: false, // don't auto-open on create
        hidden: true,      // start hidden
        alwaysRender: true // keep state when hidden (use sparingly)
      }); // createPane: :contentReference[oaicite:4]{index=4}

      try {
        await pane.navigate({
        pageType: "custom",
        name: CUSTOM_PAGE_NAME
      }); // navigate semantics align with navigateTo :contentReference[oaicite:5]{index=5}
      } catch (error) {
        Xrm.Navigation.openAlertDialog({ text: "Pane navigate error: " + e.message });
        console.error("Pane navigate error", e);
      }
      
    }
    return pane;
  }

  async function open() {
    const pane = await ensurePane();
    pane.hidden = false;     // show the tab
    try { await pane.select(); } catch (e) {}
    Xrm.App.sidePanes.state = 1; // expand the side pane container (1 = expand, 0 = collapse) :contentReference[oaicite:6]{index=6}
  }

  async function toggle() {
    const pane = await ensurePane();
    const willShow = pane.hidden === true;
    pane.hidden = !willShow;
    if (willShow) {
      try { await pane.select(); } catch (e) {}
      Xrm.App.sidePanes.state = 1;
    }
  }

  async function close() {
    const pane = Xrm.App.sidePanes.getPane(PANE_ID);
    if (pane) pane.close(); // closes and removes from sidebar :contentReference[oaicite:7]{index=7}
  }

  return { ensurePane, open, toggle, close };
})();
