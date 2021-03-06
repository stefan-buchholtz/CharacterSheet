(function(angular) {
	'use strict';

	var characterSheetApp = angular.module('characterSheetApp', [
		'ngRoute',
		'ui.bootstrap',
		'ui.bootstrap.tpls',
		'characterList',
		'sr4CharacterSheet',
		'characterSheetServices',
		'security'
	]);

	characterSheetApp.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider
				.when('/list/:status', {
					templateUrl: 'partials/list.html',
					controller: 'CharacterListCtrl'
				})
				.when('/character/:status/:characterId', {
					templateUrl: 'partials/sr4/base.html',
					controller: 'Sr4CharacterSheetCtrl'
				})
				.otherwise({
					template: '<div></div>',
					controller: 'StartPageCtrl'
				});
		}]);	
})(angular);

/*
var CHARACTERSHEET = (function($) {

	var my = {};

	function generateMobileTable(table) {
		if ( $(table).hasClass('desktop') ) {
			return;
		}
		var columnHeaders = $('th', table);
		var rows = $('tr', table).slice(1);

		var mobileTable = $(document.createElement('div')).addClass('responsive mobile');
		rows.each( function(rowIdx, row) {
			var cells = $('td', row);
			var mobileTableRecord = $(document.createElement('div'))
				.addClass('key-value-record')
				.appendTo(mobileTable);
			cells.each( function(colIdx, cell) {
				var cellText = $(cell).text();
				if (cellText.trim() !== '') {
					var mobileTableRow = $(document.createElement('div')).addClass('key-value-row');
					mobileTableRow.append($(document.createElement('div'))
						.addClass('key-value-key')
						.text($(columnHeaders[colIdx]).text()));
					mobileTableRow.append($(document.createElement('div'))
						.addClass('key-value-value')
						.text(cellText));
					mobileTableRecord.append(mobileTableRow);					
				}
			});
		});
		$(table).after(mobileTable);
		$(table).addClass('desktop');
	}

	my.generateMobileTables = function() {
		$("table.responsive").each( function(idx, table) {
			generateMobileTable(table);
		});
	}
	return my;
})($);
*/