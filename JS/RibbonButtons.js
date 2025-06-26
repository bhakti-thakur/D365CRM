function toggleCreditHold(primaryControl){ //boolean
    try {
        var formContext = primaryControl;
        var recordId = formContext.data.entity.getId().replace(/[{}]/g, "")
        var creditHold = formContext.getAttribute("creditonhold").getValue()
        var newCreditHoldValue = !creditHold; // Toggle the value
        var updateData = {
            creditonhold: newCreditHoldValue,
        }
        Xrm.WebApi.updateRecord("account", recordId, updateData)
        formContext.data.refresh()
        Xrm.Utility.alertDialog("Credit Hold status updated to: " + (newCreditHoldValue ? "Yes" : "No"));
    } catch (e) {
        console.log("Error: "+e.message)
    }
}

async function SetAccName(primaryControl) { //string
    var formContext = primaryControl;
    var recordId = formContext.data.entity.getId().replace(/[{}]/g, "");
    var updateData = {
        name: "Utkarsh"
    };

    await Xrm.WebApi.updateRecord("account", recordId, updateData)
    formContext.data.refresh();
}

async function setCreditLimit(primaryControl) { //currency
    var formContext = primaryControl
    var recordId = formContext.data.entity.getId().replace(/[{}]/g, "")
    var updateData = {
        creditlimit: 1000
    }    
    await Xrm.WebApi.updateRecord("account", recordId, updateData)
    formContext.data.refresh()
}

async function setIndustry(primaryControl) { //option set
    var formContext = primaryControl
    var recordId = formContext.data.entity.getId().replace(/[{}]/g, "")
    var updateData = {
        industrycode:21,
    }
    await Xrm.WebApi.updateRecord("account", recordId, updateData)
    formContext.data.refresh()
}

async function createtask(primaryControl) {
    try {
        var formContext = primaryControl
        var recordid = formContext.data.entity.getId().replace(/[{}]/g, "")
        var recordName = formContext.getAttribute("name").getValue()
        var Owner = formContext.getAttribute("ownerid").getValue()
        var task = {
            subject: "Followup task for "+ recordName,
            scheduledstart: new Date(),
            scheduledend: new Date(new Date().getTime() + (24* 60* 60* 1000)),
            // regardingobjectid_account: {
            //     "@odata.bind": "/accounts(" + recordid + ")"
            // },
            // ownerid: {
            //     "@odata.bind": "/systemusers(" + Owner[0].id.replace(/[{}]/g, "") + ")"
            // }
            "regardingobjectid_account@odata.bind": "/accounts(" + recordid + ")",
            "ownerid@odata.bind": "/systemusers(" + Owner[0].id.replace(/[{}]/g, "") + ")"
        }

        await Xrm.WebApi.createRecord("task", task)
        Xrm.Utility.alertDialog("Task Created for: "+ recordName);
    } catch (error) {
        console.log("Error Creating task: "+error.message);
    }
}


//Verification task GUID: %7bDE78AADA-B350-F011-877B-7C1E523D3A93%7d
//%7b = {
//%7d = }
//Therefore: GUID = DE78AADA-B350-F011-877B-7C1E523D3A93

// async function triggerVerificationTask(primaryControl) {
//     try {
//         var formContext =  primaryControl
//         var recordId = formContext.data.entity.getId().replace(/[{}]/g, "")
//         var processId = "DE78AADA-B350-F011-877B-7C1E523D3A93"
//         var request = {
//             entityId: recordId,
//             workflowId: processId,
//             getMetadata:function(){
//                 return{
//                     boundParameters: null,
//                     parameterTypes: {
//                         entityId: { typeName: "Edm.Guid", structuralProperty: 1 },
//                         workflowId: { typeName: "Edm.Guid", structuralProperty: 1 }
//                 },
//                 operationType: 0,
//                 operationName: "ExecuteWorkflow"
//                 }
//             }
//         }
//         await Xrm.WebApi.online.execute(request);

//         var url = Xrm.Utility.getGlobalContext().getClientUrl() +
//             "/api/data/v9.2/workflows(" + processId + ")/Microsoft.Dynamics.CRM.ExecuteWorkflow";

//         var body = {
//             "EntityId": recordId
//         };

//         var response = await fetch(url, {
//             method: "POST",
//             headers: {
//                 "Accept": "application/json",
//                 "Content-Type": "application/json",
//                 "OData-MaxVersion": "4.0",
//                 "OData-Version": "4.0",
//                 "Authorization": "Bearer " + await getToken() // This part may not work directly in client-side JS due to auth restrictions
//             },
//             body: JSON.stringify(body)
//         });
//         if (response.ok) {
//             Xrm.Utility.alertDialog("Verification Task Triggered Successfully");
//             formContext.data.refresh();
//         }
//         else{
//             console.log("Error triggering process: "+ await response.text())
//         }
        
//     } catch (e) {
//         console.log("Error triggering a process: "+ e.message)
//     }
// }

async function callWorkflow() {
  var entityId = Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");
  var workflowId = "DE78AADA-B350-F011-877B-7C1E523D3A93";
  var query = "";
  try {
    //Define the query to execute the worklfow.
    query = "workflows(" + workflowId.replace("}", "").replace("{",
      "") + ")/Microsoft.Dynamics.CRM.ExecuteWorkflow";
    var data = {
      "EntityId": entityId
    };
    //Create a request
    var req = new XMLHttpRequest();
    req.open("POST", Xrm.Page.context.getClientUrl() + "/api/data/v9.0/" + query, true);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.onreadystatechange = function () {
      if (this.readyState == 4 /* complete */) {
        req.onreadystatechange = null;
        if (this.status === 200) {
          var result = JSON.parse(this.response);
          alert("✅ Workflow executed successfully.");
        } else {
          //error callback
          var error = JSON.parse(this.response).error;
          alert("❌ Error: " + error.message);
        }
      }
    };
    req.send(JSON.stringify(data));
  } catch (e) {
    alert(e)
  }
}

//Calling action from button
// async function triggerVerificationAction(primaryControl) {
//     try {
//         var formContext = primaryControl;
//         var recordId = formContext.data.entity.getId().replace(/[{}]/g, "");

//         var request = {
//             entityName: "accounts(" + recordId + ")/Microsoft.Dynamics.CRM.bhaks_VerificationTaskAction",
//             getMetadata: function () {
//                 return {
//                     boundParameter: "entity",
//                     parameterTypes: {
//                         entity: { typeName: "Microsoft.Dynamics.CRM.account", structuralProperty: 5 }
//                     },
//                     operationType: 0,
//                     operationName: "bhaks_VerificationTaskAction"
//                 };
//             }
//         };

//         await Xrm.WebApi.online.execute(request);
//         Xrm.Utility.showToastNotification("Verification Task created successfully!");
//     }
//     catch (e) {
//         console.log("Error: " + e.message);
//         Xrm.Utility.alertDialog("Error: " + e.message);
//     }
// }

function callAction() {
 
  //get the current organization url
  var globalContext = Xrm.Utility.getGlobalContext();
  var serverURL = globalContext.getClientUrl();
 
 
  // Global Action Unique Name - this name is Case Sensitive
  var actionName = "bhaks_SendSimpleEmail";
 
  //set the current loggedin userid in to _inputParameter of the
  var InputParamValue = globalContext.userSettings.userId.replace('{', '').replace('}', '');;
 
  //Pass the input parameters to action
//   var data = {
//     ToRecipient: "bhakti.thakur@stepsn.com",
//     Subject: "Hello from Global Action",
//     Body: "This is a test email."
//   };
 
  //Create the HttpRequestObject to send WEB API Request
  var req = new XMLHttpRequest();
  req.open("POST", serverURL + "/api/data/v9.2/" + actionName, true);
  req.setRequestHeader("Accept", "application/json");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.setRequestHeader("OData-MaxVersion", "4.0");
  req.setRequestHeader("OData-Version", "4.0");
 
  req.onreadystatechange = function () {
    if (this.readyState == 4 /* complete */) {
      req.onreadystatechange = null;
 
      if (req.status === 0 || (req.status >= 200 && req.status < 400)) {
        alert("Action Called Successfully...");
 
        //Get the output parameter of the action (if any)
        result = JSON.parse(this.response);
 
        alert(result);
      }
      else {
        var error = JSON.parse(this.response).error;
        console.log("Error in Action: " + error.message);
      }
    }
  };
  //Execute request passing the input parameter of the action
  req.send();
}