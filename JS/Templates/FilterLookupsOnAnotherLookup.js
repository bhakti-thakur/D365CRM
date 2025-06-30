//Filtering Lookups based on another lookup

// parentFieldName= lookup based on which we're performing filteration
// targetFieldName= lookup field to be filtered
// targetEntityName= entity name to lookup field being filtered belongs from
// targetFilterAttribute= atribute in form where filteration is to be performed

function filterTargetLookupBasedOnParent(executionContext) {
    var formContext = executionContext.getFormContext();
    var parentLookup = formContext.getAttribute(parentFieldName).getValue();

    if (parentLookup != null) {
        var parentId = parentLookup[0].id.replace(/[{}]/g, "");
        console.log("Parent Lookup Selected:", parentId);

        var targetControl = formContext.getControl(targetFieldName);
        if (!targetControl) {
            console.error(`Control '${targetFieldName}' not found on the form`);
            return;
        }

        targetControl.addPreSearch(function () {
            var filterXml = 
                `<filter type='and'>
                    <condition attribute='${targetFilterAttribute}' operator='eq' value='${parentId}' />
                </filter>`;

            targetControl.addCustomFilter(filterXml, targetEntityName);
            console.log(`${targetFieldName} filtered with ${parentFieldName}`);
        });
    }
}

function initializeLookupFilter(executionContext) {
    var formContext = executionContext.getFormContext();
    var parentAttr = formContext.getAttribute(parentFieldName);

    if (parentAttr && parentAttr.getValue() != null) {
        // Call immediately if value is already present
        filterTargetLookupBasedOnParent(executionContext);
    }

    // Register on change
    parentAttr.addOnChange(filterTargetLookupBasedOnParent);

    console.log(`Lookup Filter Initialized from '${parentFieldName}' to '${targetFieldName}'`);
}
