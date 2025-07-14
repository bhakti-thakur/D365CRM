
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