using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Services;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace Secure_Isolated
{
    public class TriggerGlobalAction : IPlugin
    {
        public TriggerGlobalAction() { } // Constructor, does nothing

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

                //Ensuring target entity is persent
                if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity contact)
                {
                    if (contact.LogicalName != "contact") return;

                    //get full access to contact
                    var contactEntity = orgService.Retrieve("contact", contact.Id, new ColumnSet("ownerid"));

                    //Execute action:
                    var req = new OrganizationRequest("bhaks_SendSimpleEmail");
                    req["from"] = contactEntity.GetAttributeValue<EntityReference>("ownerid");
                    req["to"] = new EntityReference("contact", contact.Id);
                    orgService.Execute(req);
                }
                tracingService.Trace("Action 'bhaks_SendSimpleEmail' triggered successfully");

            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                throw new InvalidPluginExecutionException("The following error occurred in Secure_Isolated.", ex);
            }
            catch (Exception ex)
            {
                tracingService.Trace("TriggerGlobalAction: error: {0}", ex.ToString());
                throw;
            }
        }
    }
}
