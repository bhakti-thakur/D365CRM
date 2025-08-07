//Track Important Field Changes on Contact into a Custom “Change Log” Entity
//On update of a Contact, if important fields (like emailaddress1, mobilephone) change, log the before and after values into a custom entity called Contact Change Log.

using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace Secure_Isolated
{
    public class Pre_PostImage : IPlugin
    {
        public Pre_PostImage() { } // Constructor, does nothing

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

                Entity preImage = (Entity)context.PreEntityImages["PreImage"];
                Entity postImage = (Entity)context.PostEntityImages["PostImage"];

                if (preImage == null || postImage == null)
                {
                    tracingService.Trace("PreImage or PostImage is null.");
                    return;
                }

                var oldEmail = preImage.Contains("emailaddress1") ? preImage.GetAttributeValue<string>("emailaddress1") : null;
                var newEmail = postImage.Contains("emailaddress1") ? postImage.GetAttributeValue<string>("emailaddress1") : null;

                var oldPhone = preImage.Contains("telephone1") ? preImage.GetAttributeValue<string>("telephone1") : null;
                var newPhone = postImage.Contains("telephone1") ? postImage.GetAttributeValue<string>("telephone1") : null;

                if (oldEmail != newEmail || oldPhone != newPhone)
                {
                    tracingService.Trace("Entered if statement to check old n new values");

                    Entity log = new Entity("bhaks_changelogs");
                    log["bhaks_name"] = postImage.Contains("name") ? postImage["name"] : "Unnamed";
                    log["bhaks_relatedaccount"] = new EntityReference("account", postImage.Id);
                    log["bhaks_oldemail"] = oldEmail;
                    log["bhaks_newemail"] = newEmail;
                    log["bhaks_oldphone"] = oldPhone;
                    log["bhaks_newphone"] = newPhone;
                    tracingService.Trace("created a new entity log");

                    try
                    {
                        orgService.Create(log);
                        tracingService.Trace("Change log created successfully.");
                    }
                    catch (Exception ex)
                    {
                        tracingService.Trace("Error creating log: " + ex.Message);
                        throw;
                    }
                }
            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                throw new InvalidPluginExecutionException("The following error occurred in Pre_PostImage.", ex);
            }
            catch (Exception ex)
            {
                tracingService.Trace("Pre_PostImage: error: {0}", ex.ToString());
                throw;
            }
        }
    }
}
