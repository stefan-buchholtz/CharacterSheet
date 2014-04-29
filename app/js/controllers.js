'use strict';

var characterSheetControllers = angular.module('characterSheetControllers', []);

characterSheetControllers.controller('Sr4CharacterSheetCtrl', ['$scope', 'Character',
	function($scope, Character) {
		var character = Character.get();
		$scope.character = character;
		
		var skills = character.skills.map(function(skill) {
			skill.attributeValue = character.attributes[skill.attribute];
			return skill;
		}).sort(function(a, b) {
			return a.name.localeCompare(b.name);
		});
		var actionSkills = skills.filter(function(skill) {
			return skill.type === 'action';
		});
		var knowledgeSkills = skills.filter(function(skill) {
			return skill.type === 'knowledge';
		})
		
		if ( actionSkills.length > knowledgeSkills.length ) {
			var columnHeight = Math.ceil(actionSkills.length / 2) > knowledgeSkills.length ? Math.ceil(actionSkills.length / 2) : knowledgeSkills.length;
			if ( columnHeight % 2 === 1 ) { 
				columnHeight++;
			}
			$scope.leftSkillColumn = {
				skills: actionSkills.slice(0, columnHeight),
				skillType: 'Aktionsfertigkeiten',
				repeatHeader: false,
				wrapperClass: 'left-column-content'
			};
			$scope.middleSkillColumn = {
				skills: actionSkills.slice(columnHeight),
				skillType: 'Aktionsfertigkeiten',
				repeatHeader: true,
				wrapperClass: 'inner-column-content'
			};
			$scope.rightSkillColumn = {
				skills: knowledgeSkills,
				skillType: 'Wissensfertigkeiten',
				repeatHeader: false,
				wrapperClass: 'right-column-content'
			};
		} else {
			var columnHeight = Math.ceil(knowledgeSkills.length / 2) > actionSkills.length ? Math.ceil(knowledgeSkills.length / 2) : actionSkills.length;
			if ( columnHeight % 2 === 1 ) { 
				columnHeight++;
			}
			$scope.leftSkillColumn = {
				skills: actionSkills,
				skillType: 'Aktionsfertigkeiten',
				repeatHeader: false,
				wrapperClass: 'left-column-content'
			};
			$scope.middleSkillColumn = {
				skills: knowledgeSkills.slice(0, columnHeight),
				skillType: 'Wissensfertigkeiten',
				repeatHeader: false,
				wrapperClass: 'inner-column-content'
			};
			$scope.rightSkillColumn = {
				skills: knowledgeSkills.slice(columnHeight),
				skillType: 'Wissensfertigkeiten',
				repeatHeader: true,
				wrapperClass: 'right-column-content'
			};			
		}
		
		$scope.rangedWeaponCount = character.rangedWeapons ? character.rangedWeapons.length : 0;
		$scope.meleeWeaponCount = character.meleeWeapons ? character.meleeWeapons.length : 0;
		$scope.armorCount = character.armor ? character.armor.length : 0;
		if ( $scope.meleeWeaponCount ) {
			$scope.meleeWeaponDisplay = ($scope.rangedWeaponCount + $scope.meleeWeaponCount <= $scope.armorCount) ? 'left' : 'right';
		}
	}
]);

characterSheetControllers.directive('csSr4Attributes', function() {
	return {
		restrict: 'E',
		scope: {
			attributes: '='
		},
		templateUrl: 'partials/sr4/attributes.html'
	};
});

characterSheetControllers.directive('csSr4SkillTable', function() {
	return {
		restrict: 'E',
		scope: {
			content: '='
		},
		templateUrl: 'partials/sr4/skills.html'
	};
});

characterSheetControllers.directive('csSr4ConditionMonitor', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/sr4/conditionMonitor.html',
		scope: {
			attributes: '=',
			type: '='
		},
		link: function(scope, element, attrs) {
			scope.cellClick = function(event) {
				var damage = Number(event.target.getAttribute('damage'));
				if ( damage > scope.maxDamage ) {
					return;
				}
				if (damage > scope.currentDamage) {
					scope.currentDamage = damage;
				} else {
					scope.currentDamage = damage - 1;
				}
			}
			var attributeValue = scope.type === 'physical' ? scope.attributes.constitution : scope.attributes.willpower;
			scope.maxDamage = 8 + Math.floor(attributeValue / 2);
			scope.currentDamage = 0;
			scope.rows = [];
			var penalty = 0;
			for (var rowBaseDmg = 0; rowBaseDmg < scope.maxDamage; rowBaseDmg += 3) {
				var row = {
					base: rowBaseDmg,
					penalty: --penalty,
					columns: []
				}
				for (var col = 1; col <= 3; col++) {
					var damage = rowBaseDmg + col;
					row.columns.push({id: scope.type + '-' + damage, damage: damage, cellClass: damage <= scope.maxDamage ? 'enabled' : 'disabled'});
				}
				row.columns[2].content = penalty;
				scope.rows.push(row);
			}
		}
	}
});

characterSheetControllers.directive('csSr4RangedWeapons', function() {
	return {
		restrict: 'E',
		scope: {
			weapons: '='
		},
		templateUrl: 'partials/sr4/ranged_weapons.html'
	}
});

characterSheetControllers.directive('csSr4MeleeWeapons', function() {
	return {
		restrict: 'E',
		scope: {
			weapons: '='
		},
		templateUrl: 'partials/sr4/melee_weapons.html'
	}
});

characterSheetControllers.directive('csSr4Armor', function() {
	return {
		restrict: 'E',
		scope: {
			armor: '='
		},
		templateUrl: 'partials/sr4/armor.html'
	}
});

characterSheetControllers.directive('csSr4Comlink', function() {
	return {
		restrict: 'E',
		scope: {
			comlink: '='
		},
		templateUrl: 'partials/sr4/comlink.html'
	}
});

characterSheetControllers.directive('csSr4Cyberware', function() {
	return {
		restrict: 'E',
		scope: {
			cyberware: '='
		},
		templateUrl: 'partials/sr4/cyberware.html'
	}
});

characterSheetControllers.directive('csSr4Connections', function() {
	return {
		restrict: 'E',
		scope: {
			connections: '='
		},
		templateUrl: 'partials/sr4/connections.html'
	}
});

characterSheetControllers.directive('csSr4Sins', function() {
	return {
		restrict: 'E',
		scope: {
			sins: '='
		},
		templateUrl: 'partials/sr4/sins.html'
	}
});

characterSheetControllers.directive('csSr4Licenses', function() {
	return {
		restrict: 'E',
		scope: {
			licenses: '='
		},
		templateUrl: 'partials/sr4/licenses.html'
	}
});

characterSheetControllers.directive('csSr4Vehicles', function() {
	return {
		restrict: 'E',
		scope: {
			vehicles: '='
		},
		templateUrl: 'partials/sr4/vehicles.html'
	}
});

characterSheetControllers.directive('csSr4Lifestyles', function() {
	return {
		restrict: 'E',
		scope: {
			lifestyles: '='
		},
		templateUrl: 'partials/sr4/lifestyles.html'
	}
});

characterSheetControllers.directive('csSr4Equipment', function() {
	return {
		restrict: 'E',
		scope: {
			equipment: '=',
			magic: '='
		},
		templateUrl: 'partials/sr4/equipment.html'
	}
});

characterSheetControllers.directive('csSr4Magic', function() {
	return {
		restrict: 'E',
		scope: {
			magic: '='
		},
		templateUrl: 'partials/sr4/magic.html'
	}
});

characterSheetControllers.directive('csSr4MagicTradition', function() {
	return {
		restrict: 'E',
		scope: {
			tradition: '='
		},
		templateUrl: 'partials/sr4/magic_tradition.html'
	}
});

characterSheetControllers.directive('csSr4MagicFoci', function() {
	return {
		restrict: 'E',
		scope: {
			foci: '='
		},
		templateUrl: 'partials/sr4/magic_foci.html'
	}
});

characterSheetControllers.directive('csSr4MagicPatron', function() {
	return {
		restrict: 'E',
		scope: {
			patron: '='
		},
		templateUrl: 'partials/sr4/magic_patron.html'
	}
});

characterSheetControllers.directive('csSr4MagicSpells', function() {
	return {
		restrict: 'E',
		scope: {
			spells: '='
		},
		templateUrl: 'partials/sr4/magic_spells.html'
	}
});

characterSheetControllers.directive('csSr4Initiation', function() {
	return {
		restrict: 'E',
		scope: {
			initiation: '=',
			magic: '='
		},
		templateUrl: 'partials/sr4/initiation.html'
	}
});

characterSheetControllers.directive('csSr4Spirits', function() {
	return {
		restrict: 'E',
		scope: {
			spirits: '=',
			magic: '='
		},
		templateUrl: 'partials/sr4/spirits.html'
	}
});

characterSheetControllers.directive('csSr4AdeptPowers', function() {
	return {
		restrict: 'E',
		scope: {
			adeptPowers: '='
		},
		templateUrl: 'partials/sr4/adept_powers.html'
	}
});

characterSheetControllers.directive('csSr4Technomancy', function() {
	return {
		restrict: 'E',
		scope: {
			technomancy: '='
		},
		templateUrl: 'partials/sr4/technomancy.html'
	}
});

characterSheetControllers.directive('csKeyValueRow', function() {
	return {
		restrict: 'E',
		scope: {
			key: '=',
			value: '='
		},
		template: '<div class="key-value-row" ng-show="\'{{value}}\'"><div class="key-value-key">{{key}}</div><div class="key-value-value">{{value}}</div></div>'
	}
})