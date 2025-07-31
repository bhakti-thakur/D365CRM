
// Contact: 
// First name = firstname
// last name = lastname
// job title = jobtitle
// Email = emailaddress1
// Mobile phone =  mobilephone
// linked In id = ud_linkedinid

// originating lead = originatingleadid, _originatingleadid_value

//Lead: 
// First name= firstname
// Last Name = lastname
// Jobtitle = jobtitle
// Email = emailaddress1
// Mobile phone = mobilephone
// Linked in = bhaks_linkedin
//_parentaccountid_value

function CreateLead(primaryControl){
    try {
        var formContext = primaryControl;
        var recordId = formContext.data.entity.getId().replace(/[{}]/g, "");
        Xrm.WebApi.retrieveRecord("contact", recordId, "?$select= firstname, lastname, jobtitle, emailaddress1, mobilephone, ud_linkedinid, _transactioncurrencyid_value, donotsendmm, donotemail, donotpostalmail, _parentcustomerid_value")
        .then(function(result){
            console.log(
                "First name = "+ result.firstname+
                " last name ="+ result.lastname+
                " job title ="+ result.jobtitle+
                " Email ="+ result.emailaddress1+
                " Mobile phone ="+  result.mobilephone+
                " linked In id ="+ result.ud_linkedinid,
                " Transaction Currency Id= "+ result._transactioncurrencyid_value+
                " Marketing Material= " + result.donotsendmm+
                " do not email= "+ result.donotemail+
                " do not postalmail= "+ result.donotpostalmail+
                "Parent account= "+ result._parentcustomerid_value
            );
            var dataToCreate = {
                // firstname: result.firstname,
                // lastname: result.lastname,
                // jobtitle: result.jobtitle,
                // emailaddress1: result.emailaddress1,
                // mobilephone: result.mobilephone,
                // bhaks_linkedin: result.ud_linkedinid,
                // "transactioncurrencyid@odata.bind": "/transactioncurrencies(" + result._transactioncurrencyid_value + ")",
                // donotsendmm: result.donotsendmm,
                // donotemail: result.donotemail,
                // donotpostalmail: result.donotpostalmail,
                // "parentaccountid@odata.bind": "/accounts(" + result._parentcustomerid_value + ")"
            }

            //Null Handling!!!!!!!!!!!!!!!
            // | Field Type  | Safe Handling                             |
            // | ----------- | ----------------------------------------- |
            // | String/Text | `if (value) {}`                           |
            // | Boolean     | `if (typeof value === "boolean") {}`      |
            // | Lookup/Bind | `if (lookupId) { field = '/entity(id)' }` |


            if (result.firstname) dataToCreate.firstname = result.firstname;
            if (result.lastname) dataToCreate.lastname = result.lastname;
            if (result.jobtitle) dataToCreate.jobtitle = result.jobtitle;
            if (result.emailaddress1) dataToCreate.emailaddress1 = result.emailaddress1;
            if (result.mobilephone) dataToCreate.mobilephone = result.mobilephone;
            if (result.ud_linkedinid) dataToCreate.bhaks_linkedin = result.ud_linkedinid;

            if (result._transactioncurrencyid_value)
            dataToCreate["transactioncurrencyid@odata.bind"] = "/transactioncurrencies(" + result._transactioncurrencyid_value + ")";

            if (typeof result.donotsendmm === "boolean") dataToCreate.donotsendmm = result.donotsendmm;
            if (typeof result.donotemail === "boolean") dataToCreate.donotemail = result.donotemail;
            if (typeof result.donotpostalmail === "boolean") dataToCreate.donotpostalmail = result.donotpostalmail;

            if (result._parentcustomerid_value)
            dataToCreate["parentaccountid@odata.bind"] = "/accounts(" + result._parentcustomerid_value + ")";

            Xrm.WebApi.createRecord("lead", dataToCreate )
            .then(function(result){
                console.log("Lead Created successfully: " + result.id);
                Xrm.Utility.alertDialog("Lead created successfully!")
                var LeadFormOptions ={
                    entityName: "lead",
                    entityId: result.id
                } 
                Xrm.Navigation.openForm(LeadFormOptions)
                .then(function(openedForm){
                    console.log("Lead Form Opened: "+ openedForm)
                }, function(error){
                    console.log("Error Opening Lead: "+ error.message)
                })
                .catch(function(error){
                    console.log("Error Opening Lead: "+ error.message)
                })
            })
            .catch(function(error){
                console.log(error);
                Xrm.Utility.alertDialog("Error Creating Lead: "+ error.message)
            })
        })
        .catch(function(e){
            console.error(e);
        })
    } catch (error) {
        console.error(error);
    }
    
}


// Contact: 
// First name = firstname
// last name = lastname
// job title = jobtitle
// Email = emailaddress1
// Mobile phone =  mobilephone
// linked In id = ud_linkedinid

//Lead: 
// First name= firstname
// Last Name = lastname
// Jobtitle = jobtitle
// Email = emailaddress1
// Mobile phone = mobilephone
// Linked in = bhaks_linkedin
//_parentaccountid_value

//Autopopulate lead from onChange existing contact field in lead form
function autopopulateLead(executionContext) {
    var formContext = executionContext.getFormContext();
    try {
        var existingContactAttr = formContext.getAttribute("ud_existingcontact");
        if (existingContactAttr !== null && existingContactAttr.getValue() !== null) {
            var existingContact = existingContactAttr.getValue();
            var existingContactId = existingContact[0].id.replace(/[{}]/g, "");
            console.log("Selected Contact: ", existingContact[0].name);

            var query = "?$select=firstname,lastname,jobtitle,emailaddress1,mobilephone,ud_linkedinid,donotsendmm,donotemail,donotpostalmail,transactioncurrencyid,_parentcustomerid_value";

            Xrm.WebApi.retrieveRecord("contact", existingContactId, query)
                .then(function (result) {
                    formContext.getAttribute("firstname").setValue(result.firstname || null);
                    formContext.getAttribute("lastname").setValue(result.lastname || null);
                    formContext.getAttribute("jobtitle").setValue(result.jobtitle || null);
                    formContext.getAttribute("emailaddress1").setValue(result.emailaddress1 || null);
                    formContext.getAttribute("mobilephone").setValue(result.mobilephone || null);
                    formContext.getAttribute("bhaks_linkedin").setValue(result.ud_linkedinid || null);

                    if (
                        result._parentcustomerid_value &&
                        result["_parentcustomerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"] === "account"
                        ) {
                            formContext.getAttribute("parentaccountid").setValue([{
                                id: result._parentcustomerid_value,
                                name: result["_parentcustomerid_value@OData.Community.Display.V1.FormattedValue"] || "",
                                entityType: "account"
                            }]);
                        }
                    formContext.getAttribute("donotsendmm").setValue(result.donotsendmm || false);
                    formContext.getAttribute("donotemail").setValue(result.donotemail || false);
                    formContext.getAttribute("donotpostalmail").setValue(result.donotpostalmail || false);

                    if (result.transactioncurrencyid) {
                        formContext.getAttribute("transactioncurrencyid").setValue([{
                            id: result.transactioncurrencyid,
                            name: result["_transactioncurrencyid_value@OData.Community.Display.V1.FormattedValue"],
                            entityType: "transactioncurrency"
                        }]);
                    }

                    Xrm.Utility.alertDialog("Lead form auto-populated!");
                })
                .catch(function (err) {
                    console.error("Error auto populating lead: ", err.message);
                });
        }
    } catch (error) {
        console.error("Error fetching existing Contact details: ", error);
    }
}

function cloneLeadRecord(selectedControlSelectedItemReferences) {
    // Check if any lead is selected
    if (!selectedControlSelectedItemReferences || selectedControlSelectedItemReferences.length === 0) {
        Xrm.Utility.alertDialog("No lead selected.");
        return;
    }

    console.log(selectedControlSelectedItemReferences[0]);   
    // Get the selected Lead ID from the grid
    var leadId = selectedControlSelectedItemReferences[0].Id.replace(/[{}]/g, "");

    // Retrieve the full lead record
    Xrm.WebApi.retrieveRecord("lead", leadId).then(function (result) {
        var dataToClone = {};

        // List of fields to clone
        var fieldsToClone = [
            "firstname", "lastname", "jobtitle", "emailaddress1",
            "mobilephone", "companyname", "description", "subject",
            "industrycode", "leadsourcecode", "revenue", "donotsendmm",
            "donotemail", "donotpostalmail", "bhaks_linkedin"
        ];

        // Clone simple fields
        fieldsToClone.forEach(function (field) {
            if (result.hasOwnProperty(field)) {
                dataToClone[field] = result[field] || null;
            }
        });

        // Clone lookups (manually)
        if (result._transactioncurrencyid_value) {
            dataToClone["transactioncurrencyid@odata.bind"] =
                `/transactioncurrencies(${result._transactioncurrencyid_value})`;
        }

        if (result._parentaccountid_value) {
            dataToClone["parentaccountid@odata.bind"] =
                `/accounts(${result._parentaccountid_value})`;
        }

        if (result._ud_existingcontact_value){
            console.log("Existing Contact ID: ", result._ud_existingcontact_value);
            dataToClone["ud_ExistingContact@odata.bind"] = `/contacts(${result._ud_existingcontact_value})`;
        }

        // Create the new lead record
        Xrm.WebApi.createRecord("lead", dataToClone).then(function (response) {
            Xrm.Utility.alertDialog("Lead cloned successfully!");

            // Optionally open the cloned record
            Xrm.Navigation.openForm({
                entityName: "lead",
                entityId: response.id
            });

        }).catch(function (error) {
            console.error("Error creating cloned lead:", error.message);
            Xrm.Utility.alertDialog("Cloning failed: " + error.message);
        });

    }).catch(function (error) {
        console.error("Error retrieving lead:", error.message);
        Xrm.Utility.alertDialog("Could not retrieve lead details: " + error.message);
    });
}
