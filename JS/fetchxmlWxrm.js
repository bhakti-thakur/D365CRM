
function fetchAccounts(){
var fetchXML = `
<fetch>
    <entity name="account">
        <attribute name="accountid" />
        <attribute name="name" />
        <filter>
            <condition attribute = "statuscode" operator="eq" value="0" />
        </filter>
    </entity>
</fetch>
`;

var encodedFetchXML = encodeURIComponent(fetchXML)

Xrm.WebApi.retrieveMultipleRecords("account", "?$select=name,accountid&$top=3")
.then(function(result){
    console.log("Fetched records: ", result.entities);
    for (let i = 0; i < result.entities.length; i++) {
        var acc = result.entities[i]
        console.log("Account Name: "+acc.name+ " | Account Id: "+acc.accountid)        
    }
})
.catch(function(error){
    console.log("Error: "+ error.message)
})

Xrm.WebApi.fetchXml("account", encodedFetchXML)
.then(function(result){
    console.log("Fetched accounts: "+ result.entities.length)
    result.entities.forEach(function(record){
        console.log("Account name: "+ record.name)
    });
})
.catch(function(error){
    console.log("Error: "+ error.message)
})

}   

function getAssociatedContacts(executionContext){
    var formContext = executionContext.getFormContext()
    var accId = formContext.data.entity.getId()
    accId = accId.replace(/[{}]/g, "")

    var filter = `?$select=firstname,lastname,emailaddress1&$filter=_parentcustomerid_value eq `+ accId

    Xrm.WebApi.retrieveMultipleRecords("contact", filter)
    .then(function(result){
        console.log("Contacts linked to this account: ")
        result.entities.forEach(function(contact){
            console.log("Name: "+ contact.firstname+ " "+ contact.lastname+ "Email: "+ contact.emailaddress1)
        });
    }).catch(function(error){
        console.log("error: "+ error.message)
    })
}