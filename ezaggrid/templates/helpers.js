
let dateFormatter = function (node) {
	// make sure date is not undefined
	if (node && node.value){
		let d = new Date(node.value);
		let ymd = d.toISOString().substring(0, 10);
		let h = d.getHours();
		let m = d.getMinutes();
		let s = d.getSeconds();
		if (h == 0 && m == 0 && s == 0) {
			return ymd;
		} else {
			return ymd + ' ' + h + ':' + m + ':' + s;
		}	
	}
	return null;
};

let formatInt = d3.format(',.0f');
let formatFloat = d3.format(',.2f');


let intFormatter = function (node) {
	return formatInt(node.value);
};


let floatFormatter = function (node) {
	return formatFloat(node.value);
};


let compareDates = function (filterLocalDate, cellValue) {
	// Assume dates are stored as iso
	var cellDate = new Date(cellValue);

	if (cellDate < filterLocalDate) {
		return -1;
	} else if (cellDate > filterLocalDate) {
		return 1;
	} else {
		return 0;
	}
};


let sizeToFit = function (gridOptions) {
	gridOptions.api.sizeColumnsToFit();
};

let autoSizeAll = function (gridOptions) {
	var allColumnIds = [];
	gridOptions.columnApi.getAllColumns().forEach(function (column) {
		allColumnIds.push(column.colId);
	});
	gridOptions.columnApi.autoSizeColumns(allColumnIds);
};


let exportToCsv = function (gridOptions) {
	var params = {
		skipHeader: false,
		columnGroups: true,
		skipFooters: false,
		skipGroups: false,
		skipPinnedTop: false,
		skipPinnedBottom: false,
		allColumns: true,
		onlySelected: false,
		suppressQuotes: true,
		fileName: 'my_file.csv',
		sheetName: 'my_sheet',
		shouldRowBeSkipped: function (params) {
			// return params.node.data.myfield === 'myvalue';
			return false;
		},
		processCellCallback: function (params) {
			// if (isDate(params.value)) {
			// 	return formatDate(params.value);
			// } else {
			// 	return params.value;
			// }
			return params.value;
		},
		processHeaderCallback: null,
	};
	gridOptions.api.exportDataAsCsv(params);
};


let exportToExcel = function (gridOptions) {
	var params = {
		skipHeader: false,
		columnGroups: true,
		skipFooters: false,
		skipGroups: false,
		skipPinnedTop: false,
		skipPinnedBottom: false,
		allColumns: true,
		onlySelected: false,
		suppressQuotes: true,
		fileName: 'my_file.xls',
		sheetName: 'my_sheet',
		shouldRowBeSkipped: function (params) {
			// return params.node.data.myfield === 'myvalue';
			return false;
		},
		processCellCallback: function (params) {
			// if (isDate(params.value)) {
			// 	return formatDate(params.value);
			// } else {
			// 	return params.value;
			// }
			return params.value;
		},
		processHeaderCallback: null,
	};
	gridOptions.api.exportDataAsExcel(params);
};

let helpers = {
	dateFormatter: dateFormatter,
	compareDates: compareDates,
	intFormatter: intFormatter,
	floatFormatter: floatFormatter,
	sizeToFit: sizeToFit,
	autoSizeAll: autoSizeAll,
	exportToCsv: exportToCsv,
	exportToExcel: exportToExcel
};
