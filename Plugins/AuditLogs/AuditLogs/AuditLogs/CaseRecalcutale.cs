using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using System.ServiceModel;
using Microsoft.Crm.Sdk.Messages;

namespace pluginTry
{
    public class CaseRecalcutale : IPlugin
    {
        public CaseRecalcutale() { } // Constructor, does nothing

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

                Guid accId = Guid.Empty;

                if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity caseEntity)
                {

                    //for create
                    if (caseEntity.Attributes.Contains("customerid"))
                    {
                        EntityReference customer = (EntityReference)caseEntity["customerid"];
                        if (customer.LogicalName == "account") accId = customer.Id;
                    }

                }

                // In Update or Resolve scenario
                if (context.MessageName == "Update" && context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity entity)
                {
                    if (context.PreEntityImages.Contains("PreImage"))
                    {
                        var preImage = context.PreEntityImages["PreImage"];
                        if (preImage.Contains("customerid"))
                        {
                            EntityReference customer = (EntityReference)preImage["customerid"];
                            if (customer.LogicalName == "account") accId = customer.Id;
                        }
                    }
                }


                if (context.MessageName== "Delete" && context.PreEntityImages.Contains("PreImage"))
                {
                    Entity preImage = context.PreEntityImages["PreImage"];
                    if (preImage.Contains("customerid"))
                    {
                        EntityReference customer = (EntityReference)preImage["customerid"];
                        if (customer.LogicalName == "account") accId = customer.Id;
                    }
                }

                if (accId != Guid.Empty)
                {
                    var rollupRequest = new CalculateRollupFieldRequest
                    {
                        Target = new EntityReference("account", accId),
                        FieldName = "bhaks_numberofcases"
                    };
                    orgService.Execute(rollupRequest);
                }
            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                throw new InvalidPluginExecutionException("The following error occurred in CaseRecalcutale.", ex);
            }
            catch (Exception ex)
            {
                tracingService.Trace("CaseRecalcutale: error: {0}", ex.ToString());
                throw;
            }
        }
    }
}
