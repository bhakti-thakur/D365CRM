using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using System.ServiceModel;


namespace Secure_Isolated
{
    public class Secure_Unsecure: IPlugin
    {
        private readonly string _unsecureConfig;
        private readonly string _secureConfig;
        public Secure_Unsecure(string unsecureConfig, string secureConfig ) 
        {
            _unsecureConfig = unsecureConfig;
            _secureConfig = secureConfig;
        }
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

                tracingService.Trace("Unsecure Config: " + _unsecureConfig);
                tracingService.Trace("Secure Config:" + _secureConfig);

                if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
                {
                    Entity account = (Entity)context.InputParameters["Target"];
                    tracingService.Trace("Plugin execution started.");
                    if (account.LogicalName == "account")
                    {
                        if(account.Attributes.Contains("description") && account["description"] == null) account["description"] = "Unsecure Config:" + _unsecureConfig + "\nSecure Config:" + _secureConfig;
                        tracingService.Trace("printed in description");
                    }
                }
            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                throw new InvalidPluginExecutionException("The following error occurred in MyPlugin.", ex);
            }
            catch (Exception ex)
            {
                tracingService.Trace("ClassName: error: {0}", ex.ToString());
                throw;
            }
        }
    }
}
