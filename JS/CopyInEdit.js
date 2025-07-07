function copyLookupNameToDescription(executionContext) {
    var formContext = executionContext.getFormContext();
    var accountLookup = formContext.getAttribute("parentcustomerid").getValue();

    if (accountLookup && accountLookup.length > 0) {
        var accountName = accountLookup[0].name;
        formContext.getAttribute("bhaks_accountdescription").setValue(accountName);
    } else {
        formContext.getAttribute("bhaks_accountdescription").setValue(null); // Clear if lookup is empty
    }
}
