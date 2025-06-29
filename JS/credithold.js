function creditHold(executionContext){
    var formContext =  executionContext.getFormContext()
    var accID = formContext.data.entity.getId().replace(/[{}]/g,"")

    Xrm.WebApi.retrieveRecord("account", accID, "?$select=creditlimit")
    .then(function(accresult){
        var creditlimit = parseFloat(accresult.creditlimit)
        console.log("creditlimit: "+ creditlimit)

        var filter = `?$filter=_customerid_value eq `+accID+ `&$select=totalamount`;
        Xrm.WebApi.retrieveMultipleRecords("invoice", filter)
        .then(function(invoiceres){
            var totalInvoiceAmount=0
            invoiceres.entities.forEach(function(invoice){
                totalInvoiceAmount += parseFloat(invoice.totalamount)
            });
            console.log("Total Invoice Amount: "+ totalInvoiceAmount)

            if (totalInvoiceAmount>creditlimit) {
                var data = {creditonhold: true};
                Xrm.WebApi.updateRecord("account", accID, data)
                .then(function(updateResult){
                    console.log("Credit hold field set to YES")
                    formContext.data.refresh(false)
                })
                .catch(function(error){
                    console.log("Update error: "+ error.message)
                })
            } else {
                console.log("Credit within Limit. No update needed.")
            }
        }).catch(function(error){
            console.log("Invoice retrieve error: "+ error.message)
        })
    }).catch(function(error){
        console.log("Account retrieval error: "+ error.message)
    })
}

function validatePhone(executionContext) {
    var formContext = executionContext.getFormContext();
    var phone= formContext.getAttribute("telephone1").getValue();
    var phonePattern = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
    if (phone && !phonePattern.test(phone)) {
        var message = "Phone must be in (123) 123-1234 format"
        formContext.ui.setFormNotification(message, "ERROR", "phoneValidation");
        formContext.getAttribute("telephone1").setValue(null)// Clear the phone field
    } else {
        formContext.ui.clearNotification("phoneValidation");
    }
}