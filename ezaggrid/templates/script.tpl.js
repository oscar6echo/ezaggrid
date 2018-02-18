
'use strict';

(function () {

    console.log("start");

    let uuid = '__$data.uuid$__';
    let width = '__$data.width$__'+'px';
    let height = '__$data.height$__'+'px';
    let theme = '__$data.theme$__';
    let gridDataJson = `__$data.grid_data_json$__`;
    let gridOptionsJson = `__$data.grid_options_json$__`;

    {-% if data.css_rules is defined %-}
    let css = __$data.css_rules$__;
    {-% endif %-}


    // CSS
    var style = document.createElement('style');
    document.head.appendChild(style);
    let sheet = style.sheet;
    
    
    
    // MASTER CONTAINER
    let container = document.getElementById(`container-${uuid}`);
    
    // QUICK FILTER
    {-% if data.quick_filter %-}
    let quickFilter = document.createElement('input');
    quickFilter.id = `quickFilter-${uuid}`;
    quickFilter.type = 'text';
    quickFilter.placeholder = 'Filter...';
    container.appendChild(quickFilter);
    
    sheet.insertRule(
        `#quickFilter-${uuid} { 
            background-color: white;
            width: 200px;
        }`,
        0
    );
    {-% endif %-}
    
    // EXPORT CSV
    {-% if data.export_csv %-}
    let buttonExportCsv = document.createElement('button');
    buttonExportCsv.id = `export-csv-${uuid}`;
    buttonExportCsv.innerHTML = 'Export to CSV'
    container.appendChild(buttonExportCsv);
    {-% endif %-}
    
    // EXPORT EXCEL
    {-% if data.export_excel %-}
    let buttonExportExcel = document.createElement('button');
    buttonExportExcel.id = `export-excel-${uuid}`;
    buttonExportExcel.innerHTML = 'Export to Excel'
    container.appendChild(buttonExportExcel);
    {-% endif %-}
    
    // CONTAINER AG GRID
    let gridDiv = document.createElement('div');
    gridDiv.style.width = width;
    gridDiv.style.height = height;
    gridDiv.className = theme;
    container.appendChild(gridDiv);




    require([
        {-% if data.license %-} 
        "https://unpkg.com/ag-grid-enterprise@16.0.0/dist/ag-grid-enterprise.min.js",
        {-% else %-} 
        "https://www.ag-grid.com/dist/ag-grid/ag-grid.js",
        {-% endif %-}
        "https://d3js.org/d3-format.v1.min.js"
    ], function (agGrid, d3) {
            console.log("start in require");

            // agGrid.LicenseManager.setLicenseKey('{-% include "license" %-}');
            {-% if data.license %-} 
            agGrid.LicenseManager.setLicenseKey(atob('__$data.license$__'));
            {-% endif %-}

            {-% include 'helpers.js' %-}
            {-% include 'json.js' %-}

            let gridData = JSONfunc.parse(gridDataJson);
            let gridOptions = JSONfunc.parse(gridOptionsJson);

            {-% if data.css_rules is defined %-}
            for (let rule of css){
                sheet.insertRule(`${rule}`, 0);
            } 
            {-% endif %-}

            
            // gridOptions.pinnedTopRowData = [gridData[0]];
            // gridOptions.pinnedBottomRowData = [gridData[gridData.length-1]];
            // gridData = gridData.slice(1, gridData.length-1);
            gridOptions.rowData = gridData;

            new agGrid.Grid(gridDiv, gridOptions);

            gridOptions.api.doLayout();

            // QUICK FILTER
            {-% if data.quick_filter %-}
            let onQuickfilterTextBoxChanged = function() {
                let text = document.getElementById(`quickFilter-${uuid}`).value;
                console.log(text);
                gridOptions.api.setQuickFilter(text);
            }
            quickFilter.oninput = onQuickfilterTextBoxChanged;
            {-% endif %-}
            
            // EXPORT CSV
            {-% if data.export_csv %-}
            let onButtonExportCsv = function() {
                console.log('export to csv');
                helpers.exportToCsv(gridOptions);
            }
            buttonExportCsv.onclick = onButtonExportCsv;
            {-% endif %-}
            
            // EXPORT EXCEL
            {-% if data.export_excel %-}
            let onButtonExportExcel = function() {
                console.log('export to excel');
                helpers.exportToExcel(gridOptions);
            }
            buttonExportExcel.onclick = onButtonExportExcel;
            {-% endif %-}


            // DEBUG
            window.d3 = d3;
            window.gridDiv = gridDiv;
            window.JSONfunc = JSONfunc;
            window.gridData = gridData;
            window.gridOptions = gridOptions;
        });

})();
