function myWebApiFunction(executionContext) {
    try {
        var formContext = executionContext.getFormContext();

        // === Example: Get Current Record ID ===
        var recordId = formContext.data.entity.getId().replace(/[{}]/g, "");

        // === 1️⃣ Retrieve a single record ===
        Xrm.WebApi.retrieveRecord("entitylogicalname", recordId, "?$select=field1,field2")
        .then(function (result) {
            console.log("Field1: " + result.field1);
            console.log("Field2: " + result.field2);
        })
        .catch(function (error) {
            console.log("Retrieve Error: " + error.message);
        });

        // === 2️⃣ Retrieve multiple records ===
        Xrm.WebApi.retrieveMultipleRecords("relatedentitylogicalname", "?$select=field1,field2&$top=10")
        .then(function (result) {
            result.entities.forEach(function (record) {
                console.log("Record Field1: " + record.field1);
            });
        })
        .catch(function (error) {
            console.log("RetrieveMultiple Error: " + error.message);
        });

        // === 3️⃣ Create a new record ===
        var dataToCreate = {
            field1: "Some Value",
            field2: 12345
        };

        Xrm.WebApi.createRecord("entitylogicalname", dataToCreate)
        .then(function (result) {
            console.log("Record created with ID: " + result.id);
        })
        .catch(function (error) {
            console.log("Create Error: " + error.message);
        });

        // === 4️⃣ Update an existing record ===
        var dataToUpdate = {
            field1: "Updated Value"
        };

        Xrm.WebApi.updateRecord("entitylogicalname", recordId, dataToUpdate)
        .then(function () {
            console.log("Record updated.");
        })
        .catch(function (error) {
            console.log("Update Error: " + error.message);
        });

        // === 5️⃣ Delete record (commented out by default) ===
        /*
        Xrm.WebApi.deleteRecord("entitylogicalname", recordId)
        .then(function () {
            console.log("Record deleted.");
        })
        .catch(function (error) {
            console.log("Delete Error: " + error.message);
        });
        */

    } catch (e) {
        console.log("Outer Error: " + e.message);
    }
}

// entitylogicalname → logical name of your entity (example: bhaks_vehicletype, bhaks_brand, bhaks_model, etc.)

// field1, field2 → logical names of fields you are working with.