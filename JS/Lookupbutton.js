//In account entity, create a button that is only visible when user selects a record in primary contact, then retrieve name, pphone and email of that slected contact ad show it in alert on button click.

// id="account|NoRelationship|Form|CreditHold!60a3c4aa9b464497b37ccb6eb2a9c58800"

 function lookupDetails(executionContext) {
    var formContext = executionContext.getFormContext();
    var recordId = formContext.data.entity.getId().replace(/[{}]/g, "")
    var primaryContact = formContext.getAttribute("primarycontactid").getValue();
    if (!primaryContact || primaryContact.length === 0) {
        Xrm.Utility.alertDialog("Please select a primary contact first.");
        return;
    } else {
        Xrm.WebApi.retrieveRecord("account", recordId, "?$select=primarycontactid")
        .then(function (result) {
            console.log("primarycontactid: " + result);
        })
        .catch(function (error) {
            console.log("Retrieve Error: " + error.message);
        });
    }
 }

 function CallLookupDetailsFromButton(primaryControl){
    var formContext = primaryControl;
    var recordId = formContext.data.entity.getId().replace(/[{}]/g, "");
    var primaryContact = formContext.getAttribute("primarycontactid").getValue();
    if (!primaryContact || primaryContact.length === 0) {
        Xrm.Utility.alertDialog("Please select a primary contact first.");
        return;
    } else {
        Xrm.WebApi.retrieveRecord("contact", primaryContact[0].id.replace(/[{}]/g, ""), "?$select=fullname,telephone1,emailaddress1")
        .then(function (result) {
            var contactDetails = "Name: " + result.fullname + "\n" +
                                 "Phone: " + result.telephone1 + "\n" +
                                 "Email: " + result.emailaddress1;
            Xrm.Utility.alertDialog(contactDetails);
        })
        .catch(function (error) {
            console.log("Retrieve Error: " + error.message);
        });
    }
 }