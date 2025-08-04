using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using System.ServiceModel;

namespace pluginTry
{
    public class TaskCreate : IPlugin
    {
        public TaskCreate() { } // Constructor, does nothing

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
                        Entity task = new Entity("task")
                        {
                            ["subject"] = "Followup",
                            ["description"] = "Please follow up with contact",
                            ["scheduledend"] = DateTime.Now.AddDays(2),
                            ["prioritycode"] = new OptionSetValue(2),
                            ["regardingobjectid"] = new EntityReference("contact", contact.Id)
                        };

                        Guid taskGuid = orgService.Create(task);
                    }
                }
            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                throw new InvalidPluginExecutionException("The following error occurred in TaskCreate.", ex);
            }
            catch (Exception ex)
            {
                tracingService.Trace("TaskCreate: error: {0}", ex.ToString());
                throw;
            }
        }
    }
}
