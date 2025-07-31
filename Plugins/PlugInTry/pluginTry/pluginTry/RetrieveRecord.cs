using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using System.ServiceModel;
using Microsoft.Xrm.Sdk.Query;

namespace pluginTry
{
    public class RetrieveRecord : IPlugin
    {
        public RetrieveRecord() { } // Constructor, does nothing

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

                //if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
                //{
                //    Entity contact = (Entity)context.InputParameters["Target"];
                //    tracingService.Trace("Plugin execution started.");
                //    if (contact.LogicalName == "contact")
                //    {
                //        if (contact.Attributes.Contains("parentcustomerid"))
                //        {
                //            EntityReference accRef = (EntityReference)contact["parentcustomerid"];
                //            tracingService.Trace("Account lookup found. ID: {0}", accRef.Id);

                //            Entity acc = orgService.Retrieve("account", accRef.Id, new Microsoft.Xrm.Sdk.Query.ColumnSet("name", "accountnumber", "emailaddress1"));
                //            string accname = acc.GetAttributeValue<string>("name");
                //            string accNo = acc.GetAttributeValue<string>("accountnumber");
                //            string email = acc.GetAttributeValue<string>("emailaddress1");

                //            Entity note = new Entity("annotation")
                //            {
                //                ["subject"] = "Account lookup info",
                //                ["notetext"] = $"Account: {accname}, email: {email}",
                //                ["objectid"] = new EntityReference("contact", contact.Id),
                //            };

                //            Guid noteid =  orgService.Create(note);
                //        }
                //    }
                //}

                if (context.PrimaryEntityName == "contact" && context.PrimaryEntityId != Guid.Empty)
                {
                    tracingService.Trace("Plugin execution started.");

                    // Retrieve full contact record (important in PostOperation)
                    Entity contact = orgService.Retrieve("contact", context.PrimaryEntityId, new ColumnSet("parentcustomerid"));

                    if (contact.Attributes.Contains("parentcustomerid") && contact["parentcustomerid"] != null)
                    {
                        EntityReference accRef = (EntityReference)contact["parentcustomerid"];
                        tracingService.Trace("Account lookup found. ID: {0}", accRef.Id);

                        Entity acc = orgService.Retrieve("account", accRef.Id, new ColumnSet("name", "accountnumber", "emailaddress1"));
                        string accname = acc.GetAttributeValue<string>("name");
                        string accNo = acc.GetAttributeValue<string>("accountnumber");
                        string email = acc.GetAttributeValue<string>("emailaddress1");

                        Entity note = new Entity("annotation")
                        {
                            ["subject"] = "Account lookup info",
                            ["notetext"] = $"Account: {accname}, email: {email}",
                            ["objectid"] = new EntityReference("contact", context.PrimaryEntityId),
                        };

                        Guid noteid = orgService.Create(note);
                        tracingService.Trace("Note created with ID: {0}", noteid);
                    }
                    else
                    {
                        tracingService.Trace("parentcustomerid is null or not present on contact.");
                    }
                }
    
            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                throw new InvalidPluginExecutionException("The following error occurred in MyPlugin.", ex);
            }
            catch (Exception ex)
            {
                tracingService.Trace("RetrieveRecord: error: {0}", ex.ToString());
                throw;
            }
        }
    }
}
