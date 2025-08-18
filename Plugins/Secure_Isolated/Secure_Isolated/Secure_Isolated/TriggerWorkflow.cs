
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ServiceModel;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;

namespace Secure_Isolated
{
    public class TriggerWorkflow: IPlugin
    {
        public TriggerWorkflow() { } // Constructor, does nothing

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

                if (context.MessageName != "Create" || !context.InputParameters.Contains("Target")) return;

                Entity caseEntity = (Entity)context.InputParameters["Target"];
                Guid caseId = caseEntity.Id;
                if (caseEntity.Id == Guid.Empty)
                {
                    tracingService.Trace("Case ID is empty, retrieving from context.PrimaryEntityId: {0}", context.PrimaryEntityId);
                    caseEntity.Id = context.PrimaryEntityId;
                }
                tracingService.Trace("Case id: " +  caseId);
                tracingService.Trace("triggering workflow...");
                //workflow id = b08633e4-8973-f011-b4cb-7c1e523c2430
                //workflow id = %7bb08633e4-8973-f011-b4cb-7c1e523c2430%7d
                Guid workflowId = new Guid("b08633e4-8973-f011-b4cb-7c1e523c2430");
                var workflowReq = new ExecuteWorkflowRequest
                {
                    WorkflowId = workflowId,
                    EntityId = caseId,
                };

                orgService.Execute(workflowReq);
                tracingService.Trace("Workflow triggered successfully");

            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                throw new InvalidPluginExecutionException("The following error occurred in Secure_Isolated.", ex);
            }
            catch (Exception ex)
            {
                tracingService.Trace("TriggerWorkflow: error: {0}", ex.ToString());
                throw;
            }
        }
    }
}
