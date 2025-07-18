async function setCreditLimit(primaryControl) { //currency
    var formContext = primaryControl
    var recordId = formContext.data.entity.getId().replace(/[{}]/g, "")
    var updateData = {
        creditlimit: 1000
    }    
    await Xrm.WebApi.updateRecord("account", recordId, updateData)
    formContext.data.refresh()
    Xrm.Utility.alertDialog("Credit Limit updated.");
}

async function copyPhonetoFax(primaryControl) {
    var formContext = primaryControl;
    var recordId = formContext.data.entity.getId().replace(/[{}]/g, "");

    var phone = formContext.getAttribute("telephone1").getValue(); // ✅ CALL the function

    if (!phone) {
        Xrm.Utility.alertDialog("Phone number is empty. Nothing to copy.");
        return;
    }

    var updateData = {
        fax: phone
    };

    try {
        await Xrm.WebApi.updateRecord("account", recordId, updateData);
        await formContext.data.refresh(); // ensures latest data is reflected on UI
        Xrm.Utility.alertDialog("Fax updated successfully.");
    } catch (error) {
        console.error("Error updating fax:", error.message);
        Xrm.Utility.alertDialog("Error updating fax: " + error.message);
    }
}


function toggleEmailPreference(primaryControl){ //boolean
    try {
        var formContext = primaryControl;
        var recordId = formContext.data.entity.getId().replace(/[{}]/g, "")
        var email = formContext.getAttribute("donotemail").getValue()
        var newEmailValue = !email; // Toggle the value
        var updateData = {
            donotemail: newEmailValue,
        }
        Xrm.WebApi.updateRecord("account", recordId, updateData)
        formContext.data.refresh()
        Xrm.Utility.alertDialog("Email preference updated to: " + (newEmailValue ? "Yes" : "No"));
    } catch (e) {
        console.log("Error: "+e.message)
    }
}


function toggleBulkEmailPreference(primaryControl){ //boolean
    try {
        var formContext = primaryControl;
        var recordId = formContext.data.entity.getId().replace(/[{}]/g, "")
        var bulkEmail = formContext.getAttribute("donotemail").getValue()
        var newBulkEmailValue = !bulkEmail; // Toggle the value
        var updateData = {
            donotbulkemail: newBulkEmailValue,
        }
        Xrm.WebApi.updateRecord("account", recordId, updateData)
        formContext.data.refresh()
        Xrm.Utility.alertDialog("Bulk Email preference updated to: " + (newBulkEmailValue ? "Yes" : "No"));
    } catch (e) {
        console.log("Error: "+e.message)
    }
}


function updateAnnualRevenue(primaryControl) {
    var formContext = primaryControl;

    // Access the annual revenue field
    var revenueAttr = formContext.getAttribute("revenue");
    if (!revenueAttr) {
        console.error("Field 'revenue' not found on the form.");
        return;
    }

    // Set new revenue value (e.g., ₹5,000,000)
    var newRevenue = 5000000;
    revenueAttr.setValue(newRevenue);

    // Optional: Save the record
    formContext.data.entity.save();

    // Show confirmation
    Xrm.Utility.alertDialog("Annual Revenue updated to ₹" + newRevenue.toLocaleString());
}
