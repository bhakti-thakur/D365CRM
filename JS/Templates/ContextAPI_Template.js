function myFunction(executionContext) {
    try {
        var formContext = executionContext.getFormContext();

        // === GET VALUES ===

        // Get simple field
        var textValue = formContext.getAttribute("fieldlogicalname").getValue();

        // Get lookup field
        var lookupValue = formContext.getAttribute("lookupfieldlogicalname").getValue();
        if (lookupValue != null) {
            var lookupId = lookupValue[0].id.replace(/[{}]/g, "");
            var lookupName = lookupValue[0].name;
            var lookupEntity = lookupValue[0].entityType;
        }

        // Get date field
        var dateValue = formContext.getAttribute("datefieldlogicalname").getValue();

        // === SET VALUES ===

        // Set text field
        formContext.getAttribute("fieldlogicalname").setValue("New Value");

        // Set lookup field
        var lookupToSet = [{
            id: "GUID",
            name: "Display Name",
            entityType: "entitylogicalname"
        }];
        formContext.getAttribute("lookupfieldlogicalname").setValue(lookupToSet);

        // Set date field
        formContext.getAttribute("datefieldlogicalname").setValue(new Date());

        // === VISIBILITY ===

        formContext.getControl("fieldlogicalname").setVisible(true);  // Show
        formContext.getControl("fieldlogicalname").setVisible(false); // Hide

        // === ENABLE/DISABLE ===

        formContext.getControl("fieldlogicalname").setDisabled(false); // Enable
        formContext.getControl("fieldlogicalname").setDisabled(true);  // Disable

        // === REQUIRED LEVEL ===

        formContext.getAttribute("fieldlogicalname").setRequiredLevel("required");
        formContext.getAttribute("fieldlogicalname").setRequiredLevel("none");

        // === NOTIFICATIONS ===

        formContext.ui.setFormNotification("Some info here", "INFO", "notifId");
        formContext.ui.clearFormNotification("notifId");

        // === FILTER LOOKUP EXAMPLE ===

        formContext.getControl("lookupfieldlogicalname").addPreSearch(function() {
            var filterXml = "<filter type='and'><condition attribute='statuscode' operator='eq' value='1' /></filter>";
            formContext.getControl("lookupfieldlogicalname").addCustomFilter(filterXml, "entitylogicalname");
        });

    } catch (e) {
        console.log("Error: " + e.message);
    }
}


// Event Handler: OnLoad, OnChange, or OnSave

// Pass Execution Context: ✅ Yes (always)

