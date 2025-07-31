using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using System.ServiceModel;

namespace pluginTry
{
    public class CreateAuditOnContactCreate : IPlugin
    {
        public CreateAuditOnContactCreate() { } // Constructor, does nothing

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
                if (context.Depth > 1) return;
                if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity contact)
                {
                    tracingService.Trace("Creating audit record for contact: {0}", contact.Id);
                    string firstName = contact.Contains("firstname") ? contact["firstname"]?.ToString() : "";
                    string lastName = contact.Contains("lastname") ? contact["lastname"]?.ToString() : "";
                    string fullName = $"{firstName} {lastName}".Trim();

                    Entity audit = new Entity("bhaks_auditlog");
                    audit["bhaks_name"] = string.IsNullOrWhiteSpace(fullName) ? "Unnamed Contact" : fullName;
                    //audit["bhaks_name"] = "Test_Name";
                    audit["bhaks_entityname"] = contact.LogicalName;
                    audit["bhaks_user"] = new EntityReference("systemuser", context.InitiatingUserId);
                    audit["bhaks_createdon"] = DateTime.UtcNow;
                    orgService.Create(audit);
                }
            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                throw new InvalidPluginExecutionException("The following error occurred in CreateAuditOnContactCreate.", ex);
            }
            catch (Exception ex)
            {
                tracingService.Trace("CreateAuditOnContactCreate : error: {0}", ex.ToString());
                throw;
            }
        }
    }
}
