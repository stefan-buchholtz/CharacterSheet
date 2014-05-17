(function(angular) {
	'use strict';
	
	var sr4CharacterSheet = angular.module('sr4CharacterSheet', ['characterSheetServices', 'navigation']);
	
	function sortSkills(skills, attributes) {
		skills = skills.map(function(skill) {
			skill = angular.copy(skill);
			skill.attributeValue = attributes[skill.attribute];
			return skill;
		}).sort(function(a, b) {
			return a.name.localeCompare(b.name);
		});
		return {
			actionSkills: skills.filter(function(skill) {
				return skill.type === 'action';
			}),
			knowledgeSkills: skills.filter(function(skill) {
				return skill.type === 'knowledge';
			})
		};
	}
	
	function balanceSkills($scope, actionSkills, knowledgeSkills) {
		var columnHeight;
		if ( actionSkills.length > knowledgeSkills.length ) {
			columnHeight = Math.ceil(actionSkills.length / 2) > knowledgeSkills.length ? Math.ceil(actionSkills.length / 2) : knowledgeSkills.length;
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
			columnHeight = Math.ceil(knowledgeSkills.length / 2) > actionSkills.length ? Math.ceil(knowledgeSkills.length / 2) : actionSkills.length;
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
	}

	sr4CharacterSheet.controller('Sr4CharacterSheetCtrl', ['$scope', '$routeParams', 'Character', 'PublicCharacter', 
		function($scope, $routeParams, Character, PublicCharacter) {
			$scope.editable = $routeParams.status === 'private';
			var characterService = $routeParams.status === 'private' ? Character : PublicCharacter;
			var characterId = $routeParams.characterId;
			$scope.character = characterService.get({characterId: characterId}, function(character) {
				var characterData = character.data;
				
				var skills = sortSkills(characterData.skills, characterData.attributes);
				balanceSkills($scope, skills.actionSkills, skills.knowledgeSkills);
				
				$scope.rangedWeaponCount = characterData.rangedWeapons ? characterData.rangedWeapons.length : 0;
				$scope.meleeWeaponCount = characterData.meleeWeapons ? characterData.meleeWeapons.length : 0;
				$scope.armorCount = characterData.armor ? characterData.armor.length : 0;
				if ( $scope.meleeWeaponCount ) {
					$scope.meleeWeaponDisplay = ($scope.rangedWeaponCount + $scope.meleeWeaponCount <= $scope.armorCount) ? 'left' : 'right';
				}
				                               
				if ( $scope.editable ) {
					$scope.$watch('character.status', function(status, oldStatus) {
						if ( status === oldStatus ) {
							return;
						}
						characterService.save({characterId: characterId}, { status: $scope.character.status });
					}, true);
				}
			});
		}
	]);

	sr4CharacterSheet.directive('csSr4Attributes', function() {
		return {
			restrict: 'E',
			scope: {
				attributes: '='
			},
			templateUrl: 'partials/sr4/attributes.html'
		};
	});

	sr4CharacterSheet.directive('csSr4SkillTable', function() {
		return {
			restrict: 'E',
			scope: {
				content: '='
			},
			templateUrl: 'partials/sr4/skills.html'
		};
	});

	sr4CharacterSheet.directive('csSr4ConditionMonitor', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/sr4/conditionMonitor.html',
			scope: {
				attributes: '=',
				type: '=',
				status: '=',  
				editable: '='
			},
			link: function(scope) {
				if ( scope.editable ) {
					scope.cellClick = function(event) {
						var damage = Number(event.target.getAttribute('damage'));
						if ( damage > scope.maxDamage ) {
							return;
						}
						if (damage > scope.status[scope.type]) {
							scope.status[scope.type] = damage;
						} else {
							scope.status[scope.type] = damage - 1;
						}
					};
				}
				var expression = scope.type === 'physicalDamage' ? 'attributes.constitution' : 'attributes.willpower';
				scope.$watch(expression, function(attributeValue) {
					scope.maxDamage = 8 + Math.floor(attributeValue / 2);
					scope.currentDamage = 0;
					scope.rows = [];
					var penalty = 0;
					for (var rowBaseDmg = 0; rowBaseDmg < scope.maxDamage; rowBaseDmg += 3) {
						var row = {
							base: rowBaseDmg,
							penalty: --penalty,
							columns: []
						};
						for (var col = 1; col <= 3; col++) {
							var damage = rowBaseDmg + col;
							row.columns.push({id: scope.type + '-' + damage, damage: damage, cellClass: damage <= scope.maxDamage ? 'enabled' : 'disabled'});
						}
						row.columns[2].content = penalty;
						scope.rows.push(row);
					}	
				});
			}
		};
	});

	sr4CharacterSheet.directive('csSr4RangedWeapons', function() {
		return {
			restrict: 'E',
			scope: {
				weapons: '='
			},
			templateUrl: 'partials/sr4/ranged_weapons.html'
		};
	});

	sr4CharacterSheet.directive('csSr4MeleeWeapons', function() {
		return {
			restrict: 'E',
			scope: {
				weapons: '='
			},
			templateUrl: 'partials/sr4/melee_weapons.html'
		};
	});

	sr4CharacterSheet.directive('csSr4Armor', function() {
		return {
			restrict: 'E',
			scope: {
				armor: '='
			},
			templateUrl: 'partials/sr4/armor.html'
		};
	});

	sr4CharacterSheet.directive('csSr4Comlink', function() {
		return {
			restrict: 'E',
			scope: {
				comlink: '='
			},
			templateUrl: 'partials/sr4/comlink.html'
		};
	});

	sr4CharacterSheet.directive('csSr4Cyberware', function() {
		return {
			restrict: 'E',
			scope: {
				cyberware: '='
			},
			templateUrl: 'partials/sr4/cyberware.html'
		};
	});

	sr4CharacterSheet.directive('csSr4Connections', function() {
		return {
			restrict: 'E',
			scope: {
				connections: '='
			},
			templateUrl: 'partials/sr4/connections.html'
		};
	});

	sr4CharacterSheet.directive('csSr4Sins', function() {
		return {
			restrict: 'E',
			scope: {
				sins: '='
			},
			templateUrl: 'partials/sr4/sins.html'
		};
	});

	sr4CharacterSheet.directive('csSr4Licenses', function() {
		return {
			restrict: 'E',
			scope: {
				licenses: '='
			},
			templateUrl: 'partials/sr4/licenses.html'
		};
	});

	sr4CharacterSheet.directive('csSr4Vehicles', function() {
		return {
			restrict: 'E',
			scope: {
				vehicles: '='
			},
			templateUrl: 'partials/sr4/vehicles.html'
		};
	});

	sr4CharacterSheet.directive('csSr4Lifestyles', function() {
		return {
			restrict: 'E',
			scope: {
				lifestyles: '='
			},
			templateUrl: 'partials/sr4/lifestyles.html'
		};
	});

	sr4CharacterSheet.directive('csSr4Equipment', function() {
		return {
			restrict: 'E',
			scope: {
				equipment: '=',
				magic: '='
			},
			templateUrl: 'partials/sr4/equipment.html'
		};
	});

	sr4CharacterSheet.directive('csSr4Magic', function() {
		return {
			restrict: 'E',
			scope: {
				magic: '='
			},
			templateUrl: 'partials/sr4/magic.html'
		};
	});

	sr4CharacterSheet.directive('csSr4MagicTradition', function() {
		return {
			restrict: 'E',
			scope: {
				tradition: '='
			},
			templateUrl: 'partials/sr4/magic_tradition.html'
		};
	});

	sr4CharacterSheet.directive('csSr4MagicFoci', function() {
		return {
			restrict: 'E',
			scope: {
				foci: '='
			},
			templateUrl: 'partials/sr4/magic_foci.html'
		};
	});

	sr4CharacterSheet.directive('csSr4MagicPatron', function() {
		return {
			restrict: 'E',
			scope: {
				patron: '='
			},
			templateUrl: 'partials/sr4/magic_patron.html'
		};
	});

	sr4CharacterSheet.directive('csSr4MagicSpells', function() {
		return {
			restrict: 'E',
			scope: {
				spells: '='
			},
			templateUrl: 'partials/sr4/magic_spells.html'
		};
	});

	sr4CharacterSheet.directive('csSr4Initiation', function() {
		return {
			restrict: 'E',
			scope: {
				initiation: '=',
				magic: '='
			},
			templateUrl: 'partials/sr4/initiation.html'
		};
	});

	sr4CharacterSheet.directive('csSr4Spirits', function() {
		return {
			restrict: 'E',
			scope: {
				spirits: '=',
				magic: '='
			},
			templateUrl: 'partials/sr4/spirits.html'
		};
	});

	sr4CharacterSheet.directive('csSr4AdeptPowers', function() {
		return {
			restrict: 'E',
			scope: {
				adeptPowers: '='
			},
			templateUrl: 'partials/sr4/adept_powers.html'
		};
	});

	sr4CharacterSheet.directive('csSr4Technomancy', function() {
		return {
			restrict: 'E',
			scope: {
				technomancy: '='
			},
			templateUrl: 'partials/sr4/technomancy.html'
		};
	});

	sr4CharacterSheet.directive('csKeyValueRow', function() {
		return {
			restrict: 'E',
			scope: {
				key: '=',
				value: '='
			},
			template: '<div class="key-value-row" ng-show="\'{{value}}\'"><div class="key-value-key">{{key}}</div><div class="key-value-value">{{value}}</div></div>'
		};
	});
})(angular);
