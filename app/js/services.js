'use strict';

var characterSheetServices = angular.module('characterSheetServices', []);

characterSheetServices.factory('Character', function() {
	function getCharacter() {
		return {
			name: 'Antonio Falcone (Toni)',
			metatype: 'Ork',
			age: '24',
			gender: 'm',
			money: 20500,
			lifestyle: 'Unterschicht',
			totalKarma: 24,
			remainingKarma: 6,
			reputation: 2,
			notoriety: 0,
			publicity: null,
			height: '1,74m',
			weight: '80kg',
			hairColor: 'schwarz',
			eyeColor: 'braun',
			specialFeatures: '',
			attributes: {
				constitution: 6,
				dexterity: 5,
				reaction: 5,
				strength: 5,
				charisma: 2,
				intuition: 3,
				logic: 2,
				willpower: 3,
				edge: 2,
				essence: 6,
				initiative: "8 (10)",
				magic: 5,
				currentEdge: 2,
				astralInitiative: null,
				matrixInitiative: null,
				initiativeTurns: "1 (3)"
			},
			skills: [
				{
					name: 'Ausweichen',
					rating: 2,
					attribute: 'dexterity',
					type: 'action'
				},
				{
					name: 'Klingenwaffen',
					rating: 2,
					attribute: 'dexterity',
					type: 'action'
				},
				{
					name: 'Pistolen',
					rating: '5 (7)',
					attribute: 'dexterity',
					type: 'action'
				},
				{
					name: 'Bodenfahrzeuge',
					rating: '5 (7)',
					attribute: 'reaction',
					type: 'action'
				},
				{
					name: 'Navigation',
					rating: 2,
					attribute: 'intuition',
					type: 'action'
				},
				{
					name: 'Fingerfertigkeit',
					rating: 2,
					attribute: 'dexterity',
					type: 'action'
				},
				{
					name: 'Einschüchtern',
					rating: '2',
					attribute: 'charisma',
					type: 'action'
				},
				{
					name: 'Fahrzeugmechanik (Radfahrzeuge)',
					rating: '2 (4)',
					attribute: 'logic',
					type: 'action'
				},
				{
					name: 'Infiltration',
					rating: '3',
					attribute: 'dexterity',
					type: 'action'
				},
				{
					name: 'Laufen',
					rating: '1',
					attribute: 'constitution',
					type: 'action'
				},
				{
					name: 'Wahrnehmung',
					rating: '2',
					attribute: 'intuition',
					type: 'action'
				},
				{
					name: 'Beschatten',
					rating: '2',
					attribute: 'intuition',
					type: 'action'
				},
				{
					name: 'Gebräuche (Ork-Gang)',
					rating: '3 (5)',
					attribute: 'charisma',
					type: 'action'
				}
			],
			advantages: ['Adept', 'Beidhändigkeit', 'Immunabstossung'],
			rangedWeapons: [
				{
					name: 'Renraku Merlin',
					damage: '5K',
					armorPenetration: '-1',
					fireMode: 'HM',
					recoilCompensation: '-',
					ammo: 'normal'
				}
			],
			meleeWeapons: [
				{
					name: 'Messer',
					range: 1,
					damage: '4K',
					armorPenetration: '-'
				}
			],
			armor: [
				{
					name: 'Panzerjacke',
					protection: '8/6',
					notes: ''
				},
				{
					name: 'Mystischer Panzer',
					protection: '1/1',
					notes: ''
				}
			],
			comlink: {
				comlink: 'Renraku Sensei',
				operatingSystem: 'Renraku Ichi',
				processor: 2,
				system: 2,
				firewall: 2,
				signal: 4,
				programs: ''
			},
			cyberware: [],
			connections: [
				{
					name: 'Schieber',
					loyalty: 1,
					rating: 3
				},
				{
					name: 'Strassendoc',
					loyalty: 1,
					rating: 3
				},
				{
					name: 'Sabrina Takashari, DeMeKo-Reporterin',
					loyalty: 2,
					rating: 3
				},
				{
					name: 'Buffalo, Boß des Capitol-MC',
					loyalty: 3,
					rating: 4
				},
				{
					name: 'Schwarzmarkthändler (Stuffer Shack)',
					loyalty: 1,
					rating: 2
				}
			],
			sins: [],
			licenses: [],
			vehicles: [
				{
					name: 'Hyundai Shin-Yun',
					handling: 2,
					acceleration: '20/45',
					speed: 160,
					pilot: 1,
					body: 10,
					armor: 5,
					sensor: 1,
					notes: ''
				},
				{
					name: 'Ente',
					handling: 1,
					acceleration: '5/40',
					speed: 100,
					pilot: null,
					body: 5,
					armor: 1,
					sensor: null,
					notes: 'rot'
				}
			],
			lifestyles: [
				{
					name: 'Unterschicht',
					area: '',
					comfort: '',
					entertainment: '',
					furniture: '',
					security: '',
					space: '',
					notes: ''
				}
			],
			equipment: ['Skinlink, SIM-Modul, Elektroden', 'Brille mit Bildverbindung, Blitzkompensation, Infrarot, Smartlink, Sichtverbesserung 3', 'Akku-Schlagbohrer', 'Munition: 60 normal, 12 Ex, 100 Ex-Ex'],
			notes: [],
			magic: {
				adeptPowers: [
					{
						name: 'Gesteigerte Reflexe',
						rating: 2
					},
					{
						name: 'Verbesserte Fertigkeit (Pistolen)',
						rating: 2
					},
					{
						name: 'Verbesserte Fertigkeit (Bodenfahrzeuge)',
						rating: 2
					},
					{
						name: 'Mystischer Panzer',
						rating: 1
					},
				]
			},
			technomancy: null
		}
	}
	
	return {
		get: getCharacter
	}
});