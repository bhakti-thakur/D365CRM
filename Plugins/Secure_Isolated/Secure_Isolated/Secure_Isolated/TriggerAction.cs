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
    public class TriggerAction : IPlugin
    {
        public TriggerAction() { } // Constructor, does nothing

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

                //onlu run on update of case
                if (context.MessageName != "Update" || context.PrimaryEntityName != "incident") return;

                //check if statecode/status code is in InputParams
                if (!context.InputParameters.Contains("Target")) return;

                var target = (Entity)context.InputParameters["Target"];
                if (!target.Contains("statuscode") && !target.Contains("statecode")) return;

                tracingService.Trace("Changes detected. Triggering action...");

                //Execute action
                var request = new OrganizationRequest("bhaks_caseResolved049d27f83377f011b4cb7ced8d28242d");
                request["Target"] = new EntityReference("incident", context.PrimaryEntityId);
                orgService.Execute(request);


                tracingService.Trace("Action 'bhaks_caseResolved049d27f83377f011b4cb7ced8d28242d' triggered successfully");

            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                throw new InvalidPluginExecutionException("The following error occurred in Secure_Isolated.", ex);
            }
            catch (Exception ex)
            {
                tracingService.Trace("TriggerAction: error: {0}", ex.ToString());
                throw;
            }
        }
    }
}
