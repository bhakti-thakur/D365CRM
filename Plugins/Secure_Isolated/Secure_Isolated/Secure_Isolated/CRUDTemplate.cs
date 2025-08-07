//  this code is purely a template to reference from and can not be used directly to register a plug in

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using System.ServiceModel;

namespace pluginTry
{
    public class ClassName : IPlugin
    {
        public ClassName() { } // Constructor, does nothing

        public void Execute(IServiceProvider serviceProvider)
        {
            // Obtain the execution context
            IPluginExecutionContext context = (IPluginExecutionContext)
              serviceProvider.GetService(typeof(IPluginExecutionContext));

            // Obtain the IOrganizationService instance 
            IOrganizationServiceFactory serviceFactory =
              (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService orgService = serviceFactory.CreateOrganizationService(context.UserId);

            // Obtain the Tracing service reference
            ITracingService tracingService =
              (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            try
            {
                // TODO Plug-in business logic goes here. You can access data in the context,
                // and make calls to the Organization web service using the Dataverse SDK.

                if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
                {
                    Entity table_name = (Entity)context.InputParameters["Target"];
                    tracingService.Trace("Plugin execution started.");
                    if (table_name.LogicalName == "table_name")
                    { }
                }


                 // Create Example
                var newAccount = new Entity("account");
                newAccount["name"] = "Sample Corp";
                newAccount["telephone1"] = "1234567890";

                Guid createdId = service.Create(newAccount);
                Console.WriteLine($"Created Account ID: {createdId}");

                // Retrieve Example
                Entity retrievedAccount = service.Retrieve("account", createdId, new ColumnSet("name", "telephone1"));
                string accountName = retrievedAccount.GetAttributeValue<string>("name");
                Console.WriteLine($"Retrieved Account Name: {accountName}");

                // Update Example
                var updateAccount = new Entity("account", createdId);
                updateAccount["telephone1"] = "9876543210";
                service.Update(updateAccount);
                Console.WriteLine("Updated Account");

                // Delete Example
                service.Delete("account", createdId);
                Console.WriteLine("Deleted Account");
            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                throw new InvalidPluginExecutionException("The following error occurred in MyPlugin.", ex);
            }
            catch (Exception ex)
            {
                tracingService.Trace("ClassName: error: {0}", ex.ToString());
                throw;
            }
        }
    }
}
