# 📘 CRM Plugin Template with Explanation

---

## 🔧 Namespace and Usings

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
```

```csharp
using Microsoft.Xrm.Sdk;
using System.ServiceModel;
```

These are necessary for accessing CRM interfaces like `IPlugin`, `IOrganizationService`, and handling faults from the CRM web service.

```csharp
public class ClassName : IPlugin
```
This declares the plugin class. All plugins must implement `IPlugin` to be recognized and executed by CRM.

```csharp
public ClassName() { }
```
Default constructor: Can be used to initialize configuration or dependencies if needed. Optional if no setup required.

```csharp
public void Execute(IServiceProvider serviceProvider)
```
This is the main method called by CRM when the plugin is triggered.

```csharp
IPluginExecutionContext context = (IPluginExecutionContext)
  serviceProvider.GetService(typeof(IPluginExecutionContext));
```
Provides runtime information: entity involved, message name (e.g., Create), user info, stage (Pre/Post), Input/Output parameters, etc.
## What is IPluginExecutionContext?
IPluginExecutionContext is the core context object passed into your plugin during runtime.
It gives you everything you need to know about the event that triggered the plugin — like:

- Who triggered it?

- What record(s) were involved?

- Which message (e.g., Create, Update)?

- What stage is the plugin running in?

## Why is it important?
You cannot write meaningful plugin logic without this context — it contains the real-time environment your plugin is running in.

## How It Fits in the Plugin Lifecycle
User Action (e.g., Update Contact) 
    ➡️
CRM triggers pipeline 
    ➡️
Plugin fires 
    ➡️
CRM injects IPluginExecutionContext ➝ you use it to make your logic dynamic


```csharp
IOrganizationServiceFactory serviceFactory = 
  (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
```
- This line fetches a factory from the CRM pipeline's service provider.

- A factory is a design pattern that helps you generate instances of a service (here, `IOrganizationService`).

- This is needed because plugin code does not run in your user’s session directly, so you need this service to connect to Dataverse programmatically.

```csharp
IOrganizationService orgService = 
  serviceFactory.CreateOrganizationService(context.UserId);
```
- Now that we have a factory, this line creates a service instance (object) using the factory.

- It passes `context.UserId` — meaning the plugin will execute as the user who triggered the plugin.

- You can use `orgService` to:

    - `Create`, `Retrieve`, `Update`, `Delete` records

    - Run FetchXML queries

    - Execute custom actions or workflows

 Required to perform CRUD operations. `CreateOrganizationService(context.UserId)` ensures the plugin runs with the current user's privileges.

 ## Why This Separation Exists?
- `IPluginExecutionContext`: Tells you what happened.

- `IOrganizationService`: Lets you do something in Dataverse.

- `IOrganizationServiceFactory`: Bridges them by creating the service dynamically.

 ```csharp
 ITracingService tracingService = 
  (ITracingService)serviceProvider.GetService(typeof(ITracingService));
```
Useful for logging debug messages and troubleshooting, especially in sandbox environments where normal debugging isn't possible.

```csharp
if (context.InputParameters.Contains("Target") && 
    context.InputParameters["Target"] is Entity)
{
    Entity table_name = (Entity)context.InputParameters["Target"];
```
Checks if the plugin was triggered by a record-level event and safely extracts the target entity object.

```csharp
    if (table_name.LogicalName == "table_name")
    {
        // Your plugin logic here
    }
}
```
Verifies the entity is the expected table (e.g., account, contact). Helps avoid running logic on the wrong entity.

```csharp
catch (FaultException<OrganizationServiceFault> ex)
{
    throw new InvalidPluginExecutionException("The following error occurred in MyPlugin.", ex);
}
```
Catches CRM-specific service faults and throws them wrapped in a plugin-safe exception.
```csharp
catch (Exception ex)
{
    tracingService.Trace("ClassName: error: {0}", ex.ToString());
    throw;
}
```
Logs unexpected errors and rethrows them. Always use tracing to log errors in plugins.