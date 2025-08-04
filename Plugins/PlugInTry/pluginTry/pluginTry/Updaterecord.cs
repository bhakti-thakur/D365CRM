using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using System.ServiceModel;

namespace pluginTry
{
    public class Updaterecord : IPlugin
    {
        public Updaterecord() { } // Constructor, does nothing

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
                    Entity contact = (Entity)context.InputParameters["Target"];
                    tracingService.Trace("Plugin execution started.");
                    if (contact.LogicalName == "contact")
                    {
                        if (context.Depth > 1) // Prevent recursive execution
                        {
                            tracingService.Trace("Exiting plugin due to depth > 1");
                            return;
                        }
                        Entity contactToUpdate = new Entity("contact")
                        {
                            Id = context.PrimaryEntityId
                        };
                        contactToUpdate["description"] = "This contact was updated!";
                    }
                }

                //if (context.PrimaryEntityName == "contact" && context.PrimaryEntityId != Guid.Empty)
                //{
                //    if (context.Depth > 1) // Prevent recursive execution
                //    {
                //        tracingService.Trace("Exiting plugin due to depth > 1");
                //        return;
                //    }
                //    tracingService.Trace("Updating contact field");
                //    Entity contactToUpdate = new Entity("contact")
                //    {
                //        Id = context.PrimaryEntityId
                //    };
                //    contactToUpdate["description"] = "This contact was updated!";

                //    orgService.Update(contactToUpdate);
                //    tracingService.Trace("contact updated");
                //}
            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                throw new InvalidPluginExecutionException("The following error occurred in MyPlugin.", ex);
            }
            catch (Exception ex)
            {
                tracingService.Trace("Update: error: {0}", ex.ToString());
                throw;
            }
        }
    }
}
