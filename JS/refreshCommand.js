function refreshRibbonOnStatusChange(executionContext) {
    var formContext = executionContext.getFormContext();
    formContext.ui.refreshRibbon();
}


function checkOpportunityCanBeClosed(primaryControl) {

    /*
     * Display Rule for showing 'Close as Won' button
     * Shows only if:
     * 1. Order Status is 'Accepted'
     * 2. BPF is marked as Finished
     */

    try {

                // | Keyword | Scope    | Can be reassigned? | Hoisted? | Best for            |
                // | ------- | -------- | ------------------ | -------- | ------------------- |
                // | `var`   | Function | ✅ Yes              | ✅ Yes    | Old JS              |
                // | `let`   | Block    | ✅ Yes              | ❌ No     | Reassignable values |
                // | `const` | Block    | ❌ No               | ❌ No     | Final values        |
                // As I'm not reassigning status or processStatus, so const is perfect.

                //Use:
                // const for values that don’t change.
                // let for reassignable ones.
                // Never use var unless working in legacy systems.

        const status = primaryControl.getAttribute("bhaks_orderstatus")?.getValue(); //gets order status
        const processStatus = primaryControl.data.process.getStatus(); //gets BPF status

        console.log("Order Status:", status);
        console.log("Process Status:", processStatus);

        const isAccepted = (status === 822110000) && (status !=  null); //order status must be accepted and not null
        const isProcessFinished = (processStatus === "finished"); //BPF status must be finished

                // Use === (strict equality) always unless you explicitly need type coercion.
                // | Operator | Checks                            | Example             |
                // | -------- | --------------------------------- | ------------------- |
                // | `==`     | Value only (allows type coercion) | `'5' == 5 → true`   |
                // | `===`    | Value **and** Type                | `'5' === 5 → false` |


        console.log("isAccepted : " + isAccepted + "\nisProcessFinished: "+ isProcessFinished);
        return isAccepted && isProcessFinished;
    } catch (e) {
        console.error("Error in checkOpportunityCanBeClosed:", e);
        return false;
    }
}

function onFormLoad(executionContext) {
    var formContext = executionContext.getFormContext();

    formContext.data.process.addOnProcessStatusChange(function () {
        console.log("Process status changed. Re-evaluating ribbon.");
        formContext.ui.refreshRibbon(); 
    });
}

