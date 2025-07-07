function filterSubgrids(executionContext) {
    var formContext = executionContext.getFormContext();
    var subgrid = formContext.getControl("SUMMARY_TAB_section_6")
    if (!subgrid) {
        console.error(`No subgrid ${subgrid} control found.`)
        return;
    }
    if (subgrid.getGrid()) {
        applyFilter()
    } else {
        subgrid.addOnLoad(applyFilter)
    }
}

function applyFilter(){
    var fetchxml = 
    `<fetch>
        <entity name='contact'>
            <attribute name='firstname' />
            <filter>
                <condition attribute='jobtitle' operator='eq' value='Manager' />
            </filter>
        </entity>
    </fetch>`;
    subgrid.setFilterXml(fetchxml);
    subgrid.refresh();
    console.log("Subgrid filtered");
}