function myRetrieveMultiple(executionContext) {
    var formContext = executionContext.getFormContext();

    // Example: Parent record ID, optional
    var parentId = formContext.data.entity.getId().replace(/[{}]/g, "");

    // Build your OData query here
    var entityLogicalName = "entitylogicalname";

    // === OData query parts ===
    var select = "?$select=field1,field2,field3";
    var filter = "&$filter=field1 eq 'SomeValue' and field2 gt 100";
    var order = "&$orderby=createdon desc";
    var expand = "&$expand=relatedentity($select=relatedfield1,relatedfield2)";  // optional

    var fullQuery = select + filter + order + expand;

    // Retrieve multiple records
    Xrm.WebApi.retrieveMultipleRecords(entityLogicalName, fullQuery)
    .then(function (result) {
        console.log("Total records fetched: " + result.entities.length);
        result.entities.forEach(function (record) {
            console.log("Record:");
            console.log(record);
        });
    })
    .catch(function (error) {
        console.log("RetrieveMultiple Error: " + error.message);
    });
}

/*

| Placeholder         | Meaning                                 |
| ------------------- | --------------------------------------- |
| `entitylogicalname` | The logical name of the entity          |
| `field1, field2`    | Fields you want to retrieve             |
| `'SomeValue'`       | Your filter conditions                  |
| `expand`            | Expand related entity lookups if needed |

Mini Examples of Filters:
1️. Simple equality:
    var filter = "&$filter=bhaks_status eq 'Active'";

2️. Greater than, less than:
    var filter = "&$filter=bhaks_quantity gt 10 and bhaks_price lt 500";

3️. Date filter:
    var filter = "&$filter=createdon ge 2024-01-01T00:00:00Z";
    
4️. Filter on Lookup fields (GUID):
    var filter = "&$filter=_bhaks_brand_value eq " + lookupId;

5️. Expand related entity (ex: include AutomobileType name when querying Brand):
    var expand = "&$expand=bhaks_AutomobileType($select=bhaks_name)";

Super Tip for Lookups:
Always remember
If the field is a lookup → use _lookupfieldname_value in OData filter.
Ex: _bhaks_brand_value eq GUID




*/