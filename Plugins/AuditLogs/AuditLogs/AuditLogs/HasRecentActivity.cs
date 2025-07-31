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
    public class HasRecentActivity : IPlugin
    {
        public HasRecentActivity() { } // Constructor, does nothing

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

                if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity activity)
                {
                    if (!activity.Attributes.Contains("regardingobjectid")) return;
                    EntityReference regarding = (EntityReference)activity["regardingobjectid"];
                    if (regarding.LogicalName != "account") return;
                    Guid accId = regarding.Id;

                    //Query to retrieve multiple activities 
                    QueryExpression query = new QueryExpression("activitypointer");
                    query.ColumnSet = new ColumnSet("activityid", "modifiedon");

                    FilterExpression filter = new FilterExpression(LogicalOperator.And);
                    filter.AddCondition("regardingobjectid", ConditionOperator.Equal, accId);
                    filter.AddCondition("regardingobjecttypecode", ConditionOperator.Equal, "account");
                    //query.Criteria.AddCondition("regardingobjectid", ConditionOperator.Equal , accId);
                    //query.Criteria.AddCondition("regardingobjectid", "account");
                    query.Criteria.AddFilter(filter);
                    query.Orders.Add(new OrderExpression("modifiedon", OrderType.Descending));
                    query.TopCount = 1;

                    EntityCollection results = orgService.RetrieveMultiple(query);

                    if(results.Entities.Count > 0 && results.Entities[0].Id == activity.Id)
                    {
                        //current activity is most recent
                        Entity accToUpdate = new Entity("account", accId);
                        accToUpdate["bhaks_hasrecentactivity"] = true;
                        orgService.Update(accToUpdate);
                    }
                }
            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                throw new InvalidPluginExecutionException("The following error occurred in HasRecentActivity.", ex);
            }
            catch (Exception ex)
            {
                tracingService.Trace("HasRecentActivity: error: {0}", ex.ToString());
                throw;
            }
        }
    }
}
