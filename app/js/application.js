'use strict';

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
	
	function generateMobileTables() {
		$("table.responsive").each( function(idx, table) {
			generateMobileTable(table);
		});
	}
	
	function getTableCell($table, columnIdx, rowIdx) {
		$rows = $('tr', $table);
		$columns = $('td', $rows[rowIdx]);
		return $columns[columnIdx];
	}
	
	function getDamageForCellId(id) {
		return Number(id.split('-')[1]);
	}
	
	function getDamageCellId(damageType, damage) {
		return damageType + '-' + damage;
	}
 	
	function initDamageTable(damageType, attributeValue) {
		var maxDamage = 8 + Math.floor(attributeValue / 2);
		var $table = $('#' + damageType + 'Damage');
		$('td', $table).addClass('conditionMonitorCell disabled');
		for (var i = 0; i < maxDamage; i++) {
			var cell = getTableCell($table, i % 3, Math.floor(i / 3));
			$(cell).addClass('enabled')
				.removeClass('selected disabled')
				.attr('id', getDamageCellId(damageType, i + 1));
		}
	}
	
	function setConditionMonitorSelection(table, damage) {
		$('td.enabled', table).each( function(i, cell) {
			var $cell = $(cell);
			var cellDamage = getDamageForCellId($cell.attr('id'));
			if ( cellDamage <= damage ) {
				$cell.addClass('selected');
			} else {
				$cell.removeClass('selected');
			}
		});		
	}
	
	function setupConditionMonitor() {
		initDamageTable('physical', 6);
		initDamageTable('stun', 3);
		$('.conditionMonitor td').on('click', function(event) {
			$target = $(event.target)
			if ( $target.hasClass('disabled') ) {
				return;
			}
			var selected = $target.hasClass('selected');
			var damage = getDamageForCellId($target.attr('id'));
			if ( selected ) {
				damage--;
			}
			setConditionMonitorSelection($target.closest('table'), damage);
		});
	}
	
	my.init = function() {
		generateMobileTables();
		setupConditionMonitor();
	}
	
	my.characterSheetApp = 
	
	return my;
})($);

$(function() {
	CHARACTERSHEET.init();
});
