
function filterBrands(executionContext) {
    var formContext = executionContext.getFormContext();
    var autoTypelookup = formContext.getAttribute("bhaks_automobiletype").getValue()
    if (autoTypelookup != null) {
        var autoTypeId = autoTypelookup[0].id.replace(/[{}]/g, "")
        console.log("automobile type lookup: "+ autoTypelookup[0])
        console.log("Automobile type lookup Id:"+ autoTypeId)
        var brandControl = formContext.getControl("bhaks_brand")
        if(!brandControl){
            console.error("Control 'bhaks_brand' not found on the form");
            return;
        }
        brandControl.addPreSearch(function() {
            var filterXml = 
                `<filter type='and'>
                    <condition attribute='bhaks_automobiletype' operator='eq' value='${autoTypeId}' />    
                </filter>`

            brandControl.addCustomFilter(filterXml, "bhaks_brands")
            console.log("brand filtered!!")
        })
    }
    
}

function initializeBrandFilter(executionContext) {
    var formContext = executionContext.getFormContext();
    var autoTypeAttr = formContext.getAttribute("bhaks_automobiletype");

    if (autoTypeAttr && autoTypeAttr.getValue() != null) {
        filterBrands(executionContext);
    }

    // Register for future onchange events
    autoTypeAttr.addOnChange(filterBrands);
    console.log("brand Filter initialized using initializeBrandFilter.")
}
