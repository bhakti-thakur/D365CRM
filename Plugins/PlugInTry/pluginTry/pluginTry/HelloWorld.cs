using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;


namespace pluginTry
{
    public class HelloWorld: IPlugin
    {
        public HelloWorld() { } // Constructor, does nothing

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

                        string firstName = string.Empty;
                        string lastName = string.Empty;
                        if (contact.Attributes.Contains("firstname"))
                        {
                            firstName = contact["firstname"].ToString();
                        }

                        if (contact.Attributes.Contains("lastname"))
                        {
                            lastName = contact["lastname"].ToString();
                        }

                        contact["description"] = "Hello " + firstName + " " + lastName + ".";


                        if (!contact.Attributes.Contains("address1_city"))
                        {
                            contact["address1_city"] = "Pune";
                        }

                        if(!contact.Attributes.Contains("address1_postalcode") || contact["address1_postalcode"] == null)
                        {
                            contact["address1_postalcode"] = "411001";
                        }

                        if (!contact.Attributes.Contains("gendercode") || contact["gendercode"] == null) contact["gendercode"] = new OptionSetValue(2);

                        if ((!contact.Attributes.Contains("fax") || contact["fax"] == null) && contact.Attributes.Contains("mobilephone")) contact["fax"] = contact["mobilephone"];

                        if (!contact.Attributes.Contains("familystatuscode")) contact["familystatuscode"] = new OptionSetValue(3);

                        if (contact.Attributes.Contains("donotemail")) contact["donotemail"] = true;

                        // Check if donotsendmm == true and creditlimit is not null
                        //if (contact.Attributes.Contains("donotsendmm") &&
                        //    (bool)contact["donotsendmm"] == true &&
                        //    contact.Attributes.Contains("creditlimit") &&
                        //    contact["creditlimit"] != null &&
                        //    contact.Attributes.Contains("creditonhold"))
                        //{
                        //    contact["creditonhold"] = false; // creditonhold is also boolean
                        //}



                        if ((contact.Attributes.Contains("donotsendmm") && (bool)contact["donotsendmm"] == true) && (contact.Attributes.Contains("creditlimit") && contact["creditlimit"] != null))
                        {
                            Money creditLimit = (Money)contact["creditlimit"];
                            if (creditLimit.Value > 0)
                            {
                                tracingService.Trace("donotsendmm value: {0}", contact.Contains("donotsendmm") ? contact["donotsendmm"].ToString() : "Not Found");
                                contact["creditonhold"] = true;
                            }
                        }
                         //get lookup value
                        EntityReference parentAccount = contact.GetAttributeValue<EntityReference>("parentcustomerid");
                        //if (parentAccount != null)
                        //{
                        //    Guid accId = parentAccount.Id;
                        //    string logicalName = parentAccount.LogicalName;
                        //    string name = parentAccount.Name;
                        //}

                        //set or update lookup
                        //contact["parentcustomerid"] = new EntityReference("account", new Guid(NEW_GUID_HERE));

                        //remove lookup
                        if (parentAccount != null) contact["parentcustomerid"] = null;


                        tracingService.Trace("Plugin execution completed.");
                    }
                }
                {

                }

            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                throw new InvalidPluginExecutionException("The following error occurred in MyPlugin.", ex);
            }
            catch (Exception ex)
            {
                tracingService.Trace("MyPlugin: error: {0}", ex.ToString());
                throw;
            }
        }
    }
}
