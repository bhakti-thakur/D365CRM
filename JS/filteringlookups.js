
function filterBrands(executionContext) {
    var formContext = executionContext.getFormContext();
    var autoTypelookup = formContext.getAttribute("bhaks_automobiletype").getValue()
    if (autoTypelookup != null) {
        var autoTypeId = autoTypelookup[0].id.replace(/[{}]/g, "")
        console.log("Automobile type lookup: "+ autoTypelookup[0])
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


function filterModels(executionContext) {
    var formContext = executionContext.getFormContext();
    var brandlookup = formContext.getAttribute("bhaks_brand").getValue()
    if (brandlookup != null) {
        var brandId = brandlookup[0].id.replace(/[{}]/g, "")
        console.log("brand lookup: "+ brandlookup[0])
        console.log("brand lookup Id:"+ brandId)
        var ModelControl = formContext.getControl("bhaks_models")
        if(!ModelControl){
            console.error("Control 'bhaks_models' not found on the form");
            return;
        }
        ModelControl.addPreSearch(function() {
            var filterXml = 
                `<filter type='and'>
                    <condition attribute='bhaks_brand' operator='eq' value='${brandId}' />    
                </filter>`

            ModelControl.addCustomFilter(filterXml, "bhaks_models")
            console.log("Models filtered!!")
        })
    }
    
}

function initializeModelFilter(executionContext) {
    var formContext = executionContext.getFormContext();
    var brandAttr = formContext.getAttribute("bhaks_brand");

    if (brandAttr && brandAttr.getValue() != null) {
        filterModels(executionContext);
    }

    // Register for future onchange events
    brandAttr.addOnChange(filterModels);
    console.log("Model Filter initialized using initializeModelFilter.")
}