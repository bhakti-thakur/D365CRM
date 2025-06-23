function getSetFieldValues(executionContext) {
    try {
        // getting value from single line of text
        var formContext = executionContext.getFormContext()
        var firstNameAttr  = formContext.getAttribute("firstname"); //works fine
        if(firstNameAttr !== null){
            var firstname = firstNameAttr.getValue();
            alert("First Name: " + firstname)
        }
        else{
            alert("Field 'First Name' not found on form.")
        }
        //setting value from single line of text
        var faxAttr = formContext.getAttribute("fax") // works fine
        if (faxAttr !== null) {
            var faxVal = faxAttr.setValue(firstname)
            alert("Fax: " + faxVal)
        } else {
            alert("Fax value not found.")
        }
        var customer = formContext.getAttribute("parentcustomerid")
        if (customer !== null) {
            var customerVal = customer.getValue()
            console.log(customer)
            console.log(customerVal)
            console.log("Customer Name:" + customerVal[0].name)
            console.log("Customer Id:" + customerVal[0].id)
            console.log("Customer entity type:" + customerVal[0].entityType)
        } else {
            console.log("company ==  null")
        } 

        var new_customer = new Array()
        new_customer[0] = new Object();
        new_customer[0].name

        // var pref_user = formContext.getAttribute("preferredsystemuserid")
        // if (pref_user !== null) {
        //     var pref_user_val = pref_user.getValue()
        //     console.log(pref_user)
        //     console.log(pref_user_val)
        //     console.log("perferred user Name:" + pref_user_val[0])
        // } else {
        //     console.log("pref_user ==  null")
        // } 
    } catch (error) {
        console.log(error)
    }
}

function onLoad(executionContext) {
    var formContext = executionContext.getFormContext();
    var doNotEmail = formContext.getAttribute("donotemail").getValue()
    console.log("donotemail: "+doNotEmail)
    var preferredcontactmethod = formContext.getAttribute("preferredcontactmethodcode").getValue()
    console.log("preferred contact method" + preferredcontactmethod)
    var birthdate = formContext.getAttribute("birthdate").getValue()
    console.log("birthdate: " + birthdate)
    var creditlimit = formContext.getAttribute("creditlimit").getValue()
    console.log("creditlimit: "+ creditlimit)
}

function onSave(executionContext) {
    var formContext = executionContext.getFormContext();
    formContext.getAttribute("donotemail").setValue(true)
    formContext.getAttribute("preferredcontactmethodcode").setValue(4)
    specificBday = new Date(2000, 9, 15)
    formContext.getAttribute("birthdate").setValue(specificBday)
    formContext.getAttribute("creditlimit").setValue(23000)
    onLoad(executionContext)
}

function setOptionFieldValue(executionContext){
    var formContext = executionContext.getFormContext();
    var gender = formContext.getAttribute("gendercode").getValue()
    if (gender === null) {
        formContext.getAttribute("gendercode").setValue(2)
    } else {
        console.log(gender)
    }
    var genderText = formContext.getAttribute("gendercode").getText()
    console.log("gender: "+ gender)
    console.log("genderText: " + genderText)


    var martial_status = formContext.getAttribute("familystatuscode").getValue()
    if(martial_status === null){
        formContext.getAttribute("familystatuscode").setValue(1)
    }
    else{
        console.log(martial_status)
    }
    var martial_status_text = formContext.getAttribute("familystatuscode").getText()
    console.log("martial status: "+ martial_status)
    console.log("martial status text: "+martial_status_text)
}

function hideOrShow(executionContext) {
    var formContext = executionContext.getFormContext()
    formContext.getControl("address1_composite").setVisible(false)
    formContext.ui.tabs.get("documents_sharepoint").setVisible(false)
    formContext.ui.tabs.get("DETAILS_TAB").sections.get("marketing information").setVisible(false)
}

function optionalOrMandatory(executionContext) {
    var formContext = executionContext.getFormContext()
    formContext.getAttribute("emailaddress1").setRequiredLevel("none")
    // formContext.getAttribute("field_name").setRequiredLevel("required");   // Mandatory
    // formContext.getAttribute("field_name").setRequiredLevel("none");       // Optional
    // formContext.getAttribute("field_name").setRequiredLevel("recommended"); // Recommended (shows blue +)

}




// function filterBrand(executionContext) {
//     var formContext = executionContext.getFormContext()

//     //filter brand based on autoType
//     var autoType = formContext.getAttribute("bhaks_automobiletype").getValue()
//     if (autoType != null) {
//         var autoTypeId = autoType[0].id.replace(/[{}]/g, "")
//         console.log("Automobile type: "+autoType)
//         console.log("id: "+ autoTypeId)

//         formContext.getControl("bhaks_brand").addPreSearch(function(){
//             var brandFilter = 
//             `<filter>
//             <condition attribute="bhaks_automobiletype" operator="eq" value = "${autoTypeId}" />
//             </filter>`;
//             formContext.getControl("bhaks_brand").addCustomFilter(brandFilter, "bhaks_brand")
//         })
//     }

// }

function filterBrands(executionContext) {
    var formContext = executionContext.getFormContext();
    var autoType = formContext.getAttribute("bhaks_automobiletype").getValue(); // A entity
    var brandControl = formContext.getControl("bhaks_brand"); // B entity

    if (autoType && brandControl) {
        var autoTypeId = autoType[0].id.replace(/[{}]/g, "");
        console.log("Automobile Type selected: ", autoTypeId);

        brandControl.addPreSearch(function () {
            var filter = `<filter type="and">
                            <condition attribute="bhaks_automobiletype" operator="eq" value="${autoTypeId}" />
                          </filter>`;
            brandControl.addCustomFilter(filter, "bhaks_brand"); // Entity logical name of brand
        });

    } else {
        console.warn("Automobile type not selected or brand control missing.");
    }
}



// function filterModel(executionContext) {
//     var formContext = executionContext.getFormContext()

//     //Filter model based on brand
//     var brand = formContext.getAttribute("bhaks_brand").getValue()
//     if (brand!= null) {
//         var brandId = brand[0].id.replace(/[{}]/g, "")
//         console.log("Brand: "+ brand)
//         console.log("BrandId: "+ brandId)
//         formContext.getControl("bhaks_models").addPreSearch(function(){
//             var modelFilter = 
//             `<filter>
//                 <condition attribute= "bhaks_brand" operator = 'eq' value="${brandId}" />
//             </filter>`;
//             formContext.getControl("bhaks_models").addCustomFilter(modelFilter, "bhaks_models");
//         })
//     }
// }

function filterModels(executionContext) {
    var formContext = executionContext.getFormContext();
    var brand = formContext.getAttribute("bhaks_brand").getValue();
    var modelControl = formContext.getControl("bhaks_model");

    if (brand && modelControl) {
        var brandId = brand[0].id.replace(/[{}]/g, "");
        modelControl.addPreSearch(function () {
            var modelFilter = `<filter type="and">
                                  <condition attribute="bhaks_brand" operator="eq" value="${brandId}" />
                               </filter>`;
            modelControl.addCustomFilter(modelFilter, "bhaks_model");
        });
    } else {
        console.warn("Brand not selected or model control not found.");
    }
}
