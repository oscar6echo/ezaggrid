
'use strict';

(function () {

    console.log("start");

    let uuid = '__$data.uuid$__';
    let width = '__$data.width$__'+'px';
    let height = '__$data.height$__'+'px';
    let theme = '__$data.theme$__';
    let gridDataJson = `__$data.grid_data_json$__`;
    console.log('gridDataJson');
    console.log(gridDataJson);

    let isGridOptionsMulti = __$data.is_grid_options_multi$__;
    let gridOptionsJson = `__$data.grid_options_json$__`;
    let gridOptionsMultiJson = `__$data.grid_options_multi_json$__`;


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

    sheet.insertRule(
        `#export-csv-${uuid} { 
            margin-left: 10px;;
        }`,
        0
    );
    {-% endif %-}
    
    // EXPORT EXCEL
    {-% if data.export_excel %-}
    let buttonExportExcel = document.createElement('button');
    buttonExportExcel.id = `export-excel-${uuid}`;
    buttonExportExcel.innerHTML = 'Export to Excel'
    container.appendChild(buttonExportExcel);

    sheet.insertRule(
        `#export-excel-${uuid} { 
            margin-left: 10px;;
        }`,
        0
    );
    {-% endif %-}
    
    // DROPDOWN MENU
    {-% if data.is_grid_options_multi %-}
    let dropdownMulti = document.createElement('select');
    dropdownMulti.id = `dropdown-multi-${uuid}`;
    container.appendChild(dropdownMulti);

    sheet.insertRule(
        `#dropdown-multi-${uuid} { 
            margin-left: 10px;;
            width: 300px;;
        }`,
        0
    );
    {-% endif %-}
    
    // CONTAINER AG GRID
    let gridDiv = document.createElement('div');
    gridDiv.style.width = width;
    gridDiv.style.height = height;
    {-% if data.hide_grid %-}
    gridDiv.style.display = 'none';
    {-% endif %-}
    gridDiv.className = theme;
    container.appendChild(gridDiv);


    // INJECT USER CSS
    {-% if data.css_rules is defined %-}
    for (let rule of css){
        sheet.insertRule(`${rule}`, 0);
    } 
    {-% endif %-}



    let urlAggridEnterprise = 'https://unpkg.com/ag-grid-enterprise@16.0.0/dist/ag-grid-enterprise.min.js';
    let urlAggridFree = 'https://www.ag-grid.com/dist/ag-grid/ag-grid.js';
    let urlD3 = 'https://d3js.org/d3-format.v1.min.js';
    let urlPako = 'https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.6/pako.js';

    require([
        {-% if data.license %-}
        urlAggridEnterprise,
        {-% else %-} 
        urlAggridFree,
        {-% endif %-}
        urlD3,
        urlPako
    ], function (agGrid, d3, pako) {
            console.log("start in require");

            console.log('d3');
            window.d3 = d3;
            console.log(d3);

            console.log('pako');
            window.pako = pako;
            console.log(pako);


            // DISPLAY FUNCTION
            let buildAgGrid = function (agGrid, gridDiv, gridOpts){

                // EMPTY DIV
                gridDiv.innerHTML = '';

                // CALL AG-GRID
                new agGrid.Grid(gridDiv, gridOpts);
                gridOpts.api.doLayout();
        
                // QUICK FILTER
                {-% if data.quick_filter %-}
                let onQuickfilterTextBoxChanged = function() {
                    let text = document.getElementById(`quickFilter-${uuid}`).value;
                    gridOpts.api.setQuickFilter(text);
                }
                quickFilter.oninput = onQuickfilterTextBoxChanged;
                {-% endif %-}
                
                // EXPORT CSV
                {-% if data.export_csv %-}
                let onButtonExportCsv = function() {
                    console.log('export to csv');
                    helpers.exportToCsv(gridOpts);
                }
                buttonExportCsv.onclick = onButtonExportCsv;
                {-% endif %-}
                
                // EXPORT EXCEL
                {-% if data.export_excel %-}
                let onButtonExportExcel = function() {
                    console.log('export to excel');
                    helpers.exportToExcel(gridOpts);
                }
                buttonExportExcel.onclick = onButtonExportExcel;
                {-% endif %-}
        
        
                // DEBUG
                window.d3 = d3;
                window.gridDiv = gridDiv;
                window.JSONfunc = JSONfunc;
                window.gridData = gridData;
                window.gridOpts = gridOpts;
            };
        
        
            // BUILD DROPDOWN MENU AND DISPLAY IN CASE OF MULTI GRIDOPTIONS
            let buildGridOptionDropdown = function(agGrid, gridDiv, dropdownMulti, gridOptionsMulti, gridData){
                let gridOptionsMultiObj = {};
        
                for (let [name, gridOptions] of gridOptionsMulti) { 
                    let option = document.createElement('option');
                    option.value = name;
                    option.text = name;
                    dropdownMulti.add(option);

                    gridOptions.rowData = gridData;
                    gridOptionsMultiObj[name] = gridOptions;
                };
                
                let displayGrid = function(name, gridOptionsMultiObj, agGrid, gridDiv) {
                    let gridOptions = gridOptionsMultiObj[name];
                    buildAgGrid(agGrid, gridDiv, gridOptions);
                }
                
                dropdownMulti.onchange = function(){
                    let name = dropdownMulti.value;
                    console.log(name);
                    displayGrid(name, gridOptionsMultiObj, agGrid, gridDiv);
                }
                
                let nameFirst = gridOptionsMulti[0][0];
                console.log('init gridOptions displayed: '+nameFirst);
                
                displayGrid(nameFirst, gridOptionsMultiObj, agGrid, gridDiv);

                // DEBUG
                window.gridOptionsMultiObj = gridOptionsMultiObj;
            };
        
        


            // LICENCE
            {-% if data.license %-} 
            agGrid.LicenseManager.setLicenseKey(atob('__$data.license$__'));
            {-% endif %-}

            // UTILITIES
            {-% include 'helpers.js' %-}
            {-% include 'json.js' %-}
            {-% include 'compress.js' %-}

            // PARSE DATA

            console.log('b0');
            {-% if data.compress_data %-}
            console.log('b1');
            let gridData = JSONfunc.parse(gzip.uncompressBase64ToStr(gridDataJson, 9));
            {-% else %-}
            let gridData = JSONfunc.parse(gridDataJson);
            {-% endif %-}
            console.log('b00');
    

            if (isGridOptionsMulti){
                console.log('MULTI');
                // PARSE OPTIONS MULTI
                let gridOptionsMulti = JSONfunc.parse(gridOptionsMultiJson).data;
                window.gridOptionsMulti = gridOptionsMulti;
                // BUILD DROPDOWN MENU AND DISPLAY FIRST (DEFAULT) GRID OPTIONS
                buildGridOptionDropdown(agGrid, gridDiv, dropdownMulti, gridOptionsMulti, gridData);
            }
            else {
                console.log('MONO');
                // PARSE OPTIONS
                let gridOptions = JSONfunc.parse(gridOptionsJson);
                // ADD DATA TO OPTIONS
                gridOptions.rowData = gridData;
                // BUILD
                buildAgGrid(agGrid, gridDiv, gridOptions);
            }

            console.log('END INIT');




        });

})();
