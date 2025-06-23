function filterBrands(executionContext) {
    var formContext = executionContext.getFormContext()
    var brandControl = formContext.getControl("bhaks_brand")
    brandControl.clearOptions()
    var autoType = formContext.getAttribute("bhaks_automobiletype").getValue()
    if (!autoType) {
        console.log("No autotype found!")
    }
    var autoTypeId = autoType[0].id.replace(/[{}]/g, "")
    Xrm.WebApi.retrieveMultipleRecords("bhaks_brands", "?$filter=bhaks_automobiletype eq"+autoTypeId)
    .then(function(result){
        if (result.entities.length > 0) {
            result.entities.forEach(function(brand) {
                brandControl.addOptions({text: brand.bhaks_name, value: brand.bhaks_brandsid})
            });
        } else {
            alert("No brands found associated with the selected automobile type.")
        }
    })
    .catch(function(error){
        console.log("Error retrieveing brands: "+ error.message)
    });
}


// function filterModels(executionContext) {
//     var formContext = executionContext.getFormContext()
//     var modelControl = formContext.getControl("bhaks_models")
//     modelControl.clearOptions()
//     var brand = formContext.getAttribute("bhaks_brand").getValue()
//     if (!brand) {
//         console.log("No brand found!")
//     }
//     var brandId = brand[0].id.replace(/[{}]/g, "")
//     XMLHttpRequest.WebApi.retrieveMultipleRecords("bhaks_models", "?$filter=bhaks_brand eq"+brandId)
//     .then(function(result){
//         if (result.entities.length > 0) {
//             result.entities.forEach(function(model) {
//                 modelControl.addOptions({text: model.bhaks_name, value: model.bhaks_modelsid})
//             });
//         } else {
//             alert("No Modells found associated with the selected Brand.")
//         }
//     })
//     .catch(function(error){
//         console.log("Error retrieveing Models: "+ error.message)
//     });
// }


function filterBrands(executionContext) {
    var formContext = executionContext.getFormContext();
    var autoTypelookup = formContext.getAttribute("bhaks_automobiletype").getValue()
    if (autoTypelookup != null) {
        var autoTypeId = autoTypelookup[0].id.replace(/[{}]/g, "");
        formContext.getControl("bhaks_brand").addPreSearch(function(){
            addBrandFilter(formContext, autoTypeId);
        });
    }
}

function addBrandFilter(formContext, autoTypeId){
    var filterXml = 
    `<filter type='and'>
        <condition attribute='bhaks_automobiletype' operator='eq' value='${autoTypeId}' />    
    </filter>`

    formContext.getControl("bhaks_brand").addCustomFilter(filterXml)
}