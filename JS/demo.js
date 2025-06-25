function demo(executionContext){
    alert("Form saved!")
}

function demoOnLoad(executionContext) {
    // let formContext = executionContext.getFormContext()
    // let accounName = formContext.getAttribute("name").getValue();
    // alert(accounName)
    // formContext.getAttribute("name").setValue("Barack Obama");
    alert("On load Working")
}

function secondDemo(executionContext){
    let formContext = executionContext.getFormContext()
}

function preventAutoSave(executionContext){
    var eventArgs = executionContext.getEventArgs();
    if(eventArgs.getSaveMode() === 70){
        eventArgs.preventDefault();
        console.log("Auto-save prevented.");
    }
}