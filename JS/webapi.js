function autofillFaxFromAccount(executionContext){
    var formContext = executionContext.getFormContext()
    var accountLookup = formContext.getAttribute("parentcustomerid").getValue()
    if(accountLookup){
        var accountID = accountLookup[0].id.replace(/[{}]/g, "")
        Xrm.WebApi.retrieveRecord("account", accountID, "?$select=telephone1").then(
            function success(result){
                console.log("Account Phone: "+ result.telephone1);
                formContext.getAttribute("fax").setValue(result.telephone1)
            },
            function(error){
                console.log(error.message);
            }
        )
    }
}

function retrieveContactEmail(executionContext) {
    var formContext = executionContext.getFormContext()
    var contactId = formContext.data.entity.getId().replace(/[{}]/g, "")
    Xrm.WebApi.retrieveRecord("contact", contactId, "?$select=emailaddress1").then(
        function(result){
            alert("Contact email: "+ result.emailaddress1)
        }).catch(function(error){
            console.log("Error: "+ error)
        })
}

function UpdateAccountTelephone(executionContext) {
    var data = {
        telephone1: "9156"
    };
    var formContext = executionContext.getFormContext()
    var accountLookup = formContext.getAttribute("parentcustomerid").getValue()
    if (accountLookup) {
        var accountID = accountLookup[0].id.replace(/[{}]/g, "")
        Xrm.WebApi.updateRecord("account", accountID, data)
        .then(function(result){
            alert("record updated successfully!!");
            console.log("Record updated: " + result)
        })
        .catch(function(error){
            console.log("Error: "+error.message);
        })
    }
}


function CreateTaskForContact(executionContext) {
    var formContext = executionContext.getFormContext()
    var contactId = formContext.data.entity.getId().replace(/[{}]/g, "")
    var data = {
        subject: "Follow up",
        description:"Call the customer to follow up",
        scheduledstart: new Date(),
        scheduledend: new Date(),
        "regardingobjectid_contact@odata.bind": "/contacts(" + contactId +  ")"
    };
    Xrm.WebApi.createRecord("task", data)
    .then(function(result){
        alert("Task created: "+ result.id)
    })
    .catch(function(error){
        console.log("Error: "+error)
    })
    
}

//OData Query Options: 
// | Query Option | Purpose                                                  |
// | ------------ | -------------------------------------------------------- |
// | `$select`    | Select specific columns/fields you want                  |
// | `$filter`    | Apply filter conditions                                  |
// | `$orderby`   | Sort the records                                         |
// | `$expand`    | Retrieve related entity data (1\:N or N:1 relationships) |
// | `$top`       | Limit number of records                                  |
// | `$skip`      | Skip records for paging                                  |

function Queries(executionContext) {
    var formContext = executionContext.getFormContext()
}
