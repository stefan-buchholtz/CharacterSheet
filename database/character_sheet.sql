--liquibase formatted sql

--changeset SB:2013_03_31_01
CREATE DATABASE character_sheet 
	DEFAULT CHARACTER SET = 'utf8';

--changeset SB:2014_04_20_02
CREATE TABLE character_sheet.users (
	id			INT AUTO_INCREMENT PRIMARY KEY,
	user_name	VARCHAR(100) NOT NULL,
	email		VARCHAR(255) NOT NULL,
	new_email	VARCHAR(255),
	password	VARCHAR(255) NOT NULL,
	is_active	BIT NOT NULL,
	is_admin	BIT NOT NULL
) ENGINE INNODB;
--rollback DROP TABLE shadowrun.users;

--changeset SB:2014_04_20_03
INSERT INTO character_sheet.users (user_name, email, new_email, password, is_active, is_admin)
VALUES ('einstein', 'stbuchholtz@gmail.com', NULL, 'Test', 1, 1);
--rollback DELETE FROM shadowrun.users WHERE user_name = 'einstein';

--changeset SB:2014_04_20_04
ALTER TABLE character_sheet.users ADD CONSTRAINT ux_users_username UNIQUE(user_name);
--rollback ALTER TABLE shadowrun.users DROP CONSTRAINT ux_users_username;

--changeset SB:2014_04_20_05
ALTER TABLE character_sheet.users ADD CONSTRAINT ux_users_email UNIQUE(email);
--rollback ALTER TABLE shadowrun.users DROP CONSTRAINT ux_users_email;

--changeset SB:2014_04_20_07
CREATE TABLE character_sheet.rule_systems (
	id				INT AUTO_INCREMENT PRIMARY KEY,
	name			VARCHAR(40) NOT NULL,
	template_path	VARCHAR(20) NOT NULL
) ENGINE INNODB;


--changeset SB:2014_04_20_06
CREATE TABLE character_sheet.characters (
	id						INT AUTO_INCREMENT PRIMARY KEY,
	user_id					INT NOT NULL,
	name					VARCHAR(200) NOT NULL,
	
	street_name				VARCHAR(200) NOT NULL,
	race					VARCHAR(20) NOT NULL,
	age						SMALLINT,
	gender					CHAR(1),
	money					FLOAT,
	lifestyle				VARCHAR(20),
	karma					SMALLINT NOT NULL,
	current_karma			SMALLINT NOT NULL,
	reputation				SMALLINT,
	notoriety				SMALLINT,
	prominence				SMALLINT,
	base_constitution		SMALLINT,
	constitution			SMALLINT,
	base_agility			SMALLINT,
	agility					SMALLINT,
	base_reaction			SMALLINT,
	reaction				SMALLINT,
	base_charisma			SMALLINT,
	charisma				SMALLINT,
	base_intuition			SMALLINT,
	intuition				SMALLINT,
	base_logic				SMALLINT,
	logic					SMALLINT,
	base_willpower			SMALLINT,
	willpower				SMALLINT,
	edge					SMALLINT,
	essence					FLOAT,
	base_initiative			SMALLINT,
	initiative				SMALLINT,
	magic					SMALLINT,
	current_edge			SMALLINT,
	base_astral_initative	SMALLINT,
	astral_initiative		SMALLINT,
	base_matrix_initiative	SMALLINT,
	matrix_initiative		SMALLINT,
	initiative_turns		SMALLINT,
	physical_damage			SMALLINT,
	mental_damage			SMALLINT,
	CONSTRAINT fk_character_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE INNODB;
--rollback DROP TABLE shadowrun.characters;

--changeset SB:2013_03_31_12
INSERT INTO shadowrun.skill_groups (id, name)
VALUES (1, 'Athletik'), (2, 'Beschwören'), (3, 'Biotech'), (4, 'Cracken'), (5, 'Einfluss'), 
(6, 'Elektronik'), (7, 'Feuerwaffen'), (8, 'Heimlichkeit'), (9, 'Hexerei'), (10, 'Mechanik'),
(11, 'Nahkampf'), (12, 'Natur'), (13, 'Tasken');
--rollback DELETE FROM shadowrun.skill_groups WHERE id BETWEEN 1 AND 13;

--changeset SB:2013_03_31_13
ALTER TABLE shadowrun.skills 
ADD default_to_attribute BIT(1) NOT NULL AFTER attribute;
--rollback ALTER TABLE shadowrun.skills DROP COLUMN default_to_attribute;

--changeset SB:2013_03_31_14
ALTER TABLE shadowrun.skills
ADD CONSTRAINT chk_skill_attribute CHECK (attribute IN ('AGI', 'CON', 'REA', 'STR', 'CHA', 'INT', 'LOG', 'WIL', 'MAG', 'RES'));
--rollback ALTER TABLE shadowrun.skills DROP CONSTRAINT chk_skill_attribute;

--changeset SB:2013_03_31_15
ALTER TABLE shadowrun.skills 
ADD specializations VARCHAR(200) AFTER name;
--rollback ALTER TABLE shadowrun.skills DROP COLUMN specializations;

--changeset SB:2013_03_31_16
ALTER TABLE shadowrun.skills 
ADD needs_specification BIT(1) NOT NULL AFTER specializations;
--rollback ALTER TABLE shadowrun.skills DROP COLUMN needs_specification;

--changeset SB:2013_03_31_17
INSERT INTO shadowrun.skills (name, attribute, default_to_attribute, rulebook, skill_group_id, specializations, needs_specification)
VALUES
-- Athletik
('Akrobatik', 'AGI', 1, 'Basis', 1, 'Abrollen, Balance, Stürze mildern, Springen, Tanzen', 0),
('Klettern', 'STR', 1, 'Basis', 1, 'Abseilen, Freihändig, mit Hilfsmitteln, bestimmte Umstände', 0),
('Laufen', 'STR', 1, 'Basis', 1, 'Langstrecken, Sprinten, Stadt, Wildnis', 0),
('Schwimmen', 'STR', 1, 'Basis', 1, 'Langstrecken, Sprinten', 0),
-- Beschwören
('Binden', 'MAG', 0, 'Basis', 2, 'bestimmte Geistersorte', 0),
('Herbeirufen', 'MAG', 0, 'Basis', 2, 'bestimmte Geistersorte', 0),
('Verbannen', 'MAG', 0, 'Basis', 2, 'bestimmte Geistersorte', 0),
-- Biotech
('Erste Hilfe', 'LOG', 1, 'Basis', 3, 'bestimmte Verletzungsart', 0),
('Kybernetik', 'LOG', 0, 'Basis', 3, 'Bioware, Bodyware, Cybergliedmaßen, Headware, Nanoware', 0),
('Medizin', 'LOG', 0, 'Basis', 3, 'Chirurgie, Implantatchirurgie, Langzeitbehandlung, Notfallchirurgie, Organkulturen, Schönheitschirurgie', 0),
-- Cracken
('Elektronische Kriegsführung', 'LOG', 0, 'Basis', 4, 'Datenübertragung, Sensorsteuerung, Stören, Verschlüsseln', 0),
('Hacking', 'LOG', 1, 'Basis', 4, 'bestimmtes Programm, bestimmte Geräteart', 0),
('Matrixkampf', 'LOG', 1, 'Basis', 4, 'bestimmte Gegnerart', 0),
-- Einfluss
('Führung', 'CHA', 1, 'Basis', 5, 'Selbstbeherrschung, Moral, Überzeugen, Strategie, Taktik', 0),
('Gebräuche', 'CHA', 1, 'Basis', 5, 'bestimmte Kultur oder Subkultur', 0),
('Überreden', 'CHA', 1, 'Basis', 5, 'Schnellreden, Betrügen, Verführung', 0),
('Verhandlung', 'CHA', 1, 'Basis', 5, 'Handeln, Diplomatie, Absichten erspüren', 0),
-- Elektronik
('Computer', 'LOG', 1, 'Basis', 6, 'bestimmtes Programm, bestimmte Geräteart', 0),
('Datensuche', 'LOG', 1, 'Basis', 6, 'bestimmte Quelle, bestimmte Datenart', 0),
('Hardware', 'LOG', 0, 'Basis', 6, 'bestimmte Geräteart', 0),
('Software', 'LOG', 0, 'Basis', 6, 'Betriebssysteme, Defensive Programme, Masken-Programme, offensive Programme, auf ein Spezialprogramm', 0),
-- Feuerwaffen
('Gewehre', 'AGI', 1, 'Basis', 7, 'Scharfschützengewehre, Schrotflinten, Sportgewehre', 0),
('Pistolen', 'AGI', 1, 'Basis', 7, 'Halbautomatik, Holdouts, Revolver, Taser', 0),
('Schnellfeuerwaffen', 'AGI', 1, 'Basis', 7, 'Automatikpistolen, Karabiner, Maschinenpistolen, Sturmgewehre', 0),
-- Heimlichkeit
('Beschatten', 'INT', 1, 'Basis', 8, 'Abschütteln, Hinterhalte, Verfolgen', 0),
('Fingerfertigkeit', 'AGI', 1, 'Basis', 8, 'Ladendiebstahl, Taschendiebstahl, Zaubertricks', 0),
('Infiltration', 'AGI', 1, 'Basis', 8, 'Fahrzeug, Stadt, Wildnis, bestimmte Entdeckungsmethode', 0),
('Verkleiden', 'INT', 1, 'Basis', 8, 'Tarnung, Theater, Kosmetik, Trideo', 0),
-- Hexerei
('Antimagie', 'MAG', 0, 'Basis', 9, 'bestimmter Spruchtyp', 0),
('Ritualzauberei', 'MAG', 0, 'Basis', 9, 'bestimmter Spruchtyp', 0),
('Spruchzauberei', 'MAG', 0, 'Basis', 9, 'bestimmter Spruchtyp', 0),
-- Mechanik
('Fahrzeugmechanik', 'LOG', 0, 'Basis', 10, 'Läufer, Hovercraft, Kettenantrieb, Reifenantrieb', 0),
('Industriemechanik', 'LOG', 0, 'Basis', 10, 'Bauteile, Hydraulik, Robotik, Schweißen, Stromversorgung, etc.', 0),
('Luftfahrtmechanik', 'LOG', 0, 'Basis', 10, 'Festflügelmaschinen, Luftschiffe, Raumfahrzeuge, Rotormaschinen, Schwenkflügelmaschinen, Vektorschubmaschinen', 0),
('Seefahrtmechanik', 'LOG', 0, 'Basis', 10, 'Motorboot, Schiff, Segelboot, U-Boot', 0),
-- Nahkampf
('Klingenwaffen', 'AGI', 1, 'Basis', 11, 'Äxte, Cyber-Nahkampfwaffen, Messer, Parieren, Schwerter', 0),
('Knüppel', 'AGI', 1, 'Basis', 11, 'Hämmer, Parieren, Schlagstöcke, Stäbe, Totschläger, Zweihändig geführte Knüppel', 0),
('Waffenloser Kampf', 'AGI', 1, 'Basis', 11, 'Cyber-Nahkampfwaffen, Gegner festhalten, Parieren, Martial Arts', 0),
-- Natur
('Navigation', 'INT', 1, 'Basis', 12, 'Dschungel, Gebirge, Polar, Stadt, Wald, Wüste, anderes Gebiet', 0),
('Spurenlesen', 'INT', 1, 'Basis', 12, 'Dschungel, Gebirge, Polar, Stadt, Wald, Wüste, anderes Gebiet', 0),
('Survival', 'WIL', 1, 'Basis', 12, 'Dschungel, Gebirge, Polar, Stadt, Wald, Wüste, anderes Gebiet', 0),
-- Tasken
('Dekompilieren', 'RES', 0, 'Basis', 13, 'bestimmte Spriteart', 0),
('Kompilieren', 'RES', 0, 'Basis', 13, 'bestimmte Spriteart', 0),
('Registrieren', 'RES', 0, 'Basis', 13, 'bestimmte Spriteart', 0),
-- Fertigkeiten ohne Gruppe
('Entfesseln', 'AGI', 1, 'Basis', NULL, 'Art der Fessel', 0),
('Exotische Fernkampfwaffe', 'AGI', 1, 'Basis', NULL, '', 1),
('Exotische Nahkampfwaffe', 'AGI', 1, 'Basis', NULL, '', 1),
('Fälschen', 'AGI', 1, 'Basis', NULL, 'Amtliche Dokumente, Bildbearbeitung, Credsticks, Falschgeld, IDs', 0),
('Geschütze', 'AGI', 1, 'Basis', NULL, 'Artillerie, ballistische Waffen, Energiewaffen, Lenkraketen, Raketen', 0),
('Projektilwaffen', 'AGI', 1, 'Basis', NULL, 'Armbrüste, Bögen, Schleudern', 0),
('Schlosser', 'AGI', 1, 'Basis', NULL, 'bestimmter Schlosstyp', 0),
('Schwere Waffen', 'AGI', 1, 'Basis', NULL, 'Granatwerfer, Lenkraketen, Maschinengewehre, Raketenwerfer, Sturmkanonen', 0),
('Wurfwaffen', 'AGI', 1, 'Basis', NULL, 'Gelupft, Geschleudert, Shuriken, Wurfmesser', 0),
('Fallschirmspringen', 'CON', 1, 'Basis', NULL, 'Automatische Auslösung, geringe Sprunghöhe, HALO, normales Fallschirmspringen', 0),
('Tauchen', 'CON', 1, 'Basis', NULL, 'Flaschentauchen, Flüssigtauchapparate, Gasgemisch, Sauerstoffextraktion, spezielle Umstände', 0),
('Ausweichen', 'REA', 1, 'Basis', NULL, 'Fernkampf, Nahkampf', 0),
('Bodenfahrzeuge', 'REA', 1, 'Basis', NULL, 'Fernsteuerung, Hovercraft, Kettenfahrzeuge, LKW, Motorrad, PKW', 0),
('Exotisches Fahrzeug', 'REA', 0, 'Basis', NULL, '', 1),
('Flugzeuge', 'REA', 0, 'Basis', NULL, 'Festflügelmaschinen, Luftschiffe, Rotormaschinen, Schwenkflügelmaschinen, Vektorschubmaschinen', 0),
('Läufer', 'REA', 0, 'Basis', NULL, 'Fernsteuerung, Vierbeiner, Zweibeiner', 0),
('Raumfahrzeuge', 'REA', 0, 'Basis', NULL, 'Fernsteuerung, Semiballistisch, Suborbital, Startprozeduren, Weltraum', 0),
('Schiffe', 'REA', 1, 'Basis', NULL, 'Fernsteuerung, Motoboot, Schiff, Segelboot, U-Boot', 0),
('Einschüchtern', 'CHA', 1, 'Basis', NULL, 'Verhör, geistig, körperlich, Folter', 0),
('Unterricht', 'CHA', 1, 'Basis', NULL, 'bestimmte Fertigkeit', 0),
('Askennen', 'INT', 0, 'Basis', NULL, 'Astrale Signaturen, Auren lesen, Psychometrie, bestimmter Aurentyp', 0),
('Handwerk', 'INT', 1, 'Basis', NULL, 'Bildhauerei, Malen, Schreinern, bestimmtes Musikinstrument, andere Handwerke', 0),
('Hobbywissen', 'INT', 1, 'Basis', NULL, '', 0),
('Sprache', 'INT', 1, 'Basis', NULL, '', 0),
('Straßenwissen', 'INT', 1, 'Basis', NULL, '', 0),
('Wahrnehmung', 'INT', 1, 'Basis', NULL, 'Hören, Riechen, Schmecken, Sehen, Tasten', 0),
('Akademisches Wissen', 'LOG', 1, 'Basis', NULL, '', 1),
('Berufswissen', 'LOG', 1, 'Basis', NULL, '', 1),
('Sprengstoffe', 'LOG', 1, 'Basis', NULL, 'Kommerzielle Sprengstoffe, Entschärfen, improvisierte Sprengstoffe, Plastiksprengstoffe', 0),
('Waffenbau', 'LOG', 1, 'Basis', NULL, 'Artillerie, Feuerwaffen, Panzerung, Schwere Waffen, Sprengstoffe, Waffenzubehör', 0),
('Astralkampf', 'WIL', 0, 'Basis', NULL, 'bestimmer Foki-Typ oder Gegner', 0);
--rollback DELETE FROM shadowrun.skills;

--changeset SB:2013_04_01_01
CREATE TABLE shadowrun.spell_categories (
	id		INT AUTO_INCREMENT PRIMARY KEY,
	name	VARCHAR(100) NOT NULL
) ENGINE INNODB;
--rollback DROP TABLE shadowrun.spell_categories;

--changeset SB:2013_04_01_02
ALTER TABLE shadowrun.spells 
ADD COLUMN category_id INT NOT NULL AFTER description;
--rollback ALTER TABLE shadowrun.spells DROP COLUMN category_id;

--changeset SB:2013_04_01_03
ALTER TABLE shadowrun.spells
ADD CONSTRAINT fk_spells_category FOREIGN KEY (category_id) REFERENCES spell_categories(id);
--rollack ALTER TABLE shadowrun.spells DROP CONSTRAINT fk_spells_category;

--changeset SB:2013_04_01_04
INSERT INTO shadowrun.spell_categories (id, name)
VALUES (1, 'Heilzauber'), (2, 'Illusionszauber'), (3, 'Kampfzauber'), (4, 'Manipulationszauber'), (5, 'Wahrnehmungszauber');
--rollback TRUNCATE TABLE shadowrun.spell_categories;

--changeset SB:2013_04_01_05
ALTER TABLE shadowrun.advantages
ADD COLUMN rulebook VARCHAR(20);
--rollback ALTER TABLE shadowrun.advantages DROP COLUMN rulebook;

--changeset SB:2013_04_01_06
ALTER TABLE shadowrun.adept_powers
ADD COLUMN rulebook VARCHAR(20);
--rollback ALTER TABLE shadowrun.adept_powers DROP COLUMN rulebook;

--changeset SB:2013_04_01_07
ALTER TABLE shadowrun.spells
ADD COLUMN needs_specification BIT(1) NOT NULL AFTER attributes;
--rollback ALTER TABLE shadowrun.spells DROP COLUMN needs_specification;

--changeset SB:2013_04_01_08
ALTER TABLE shadowrun.spells
MODIFY COLUMN drain VARCHAR(40) NOT NULL;
--rollback ALTER TABLE shadowrun.spells MODIFY COLUMN drain VARCHAR(20) NOT NULL;

--changeset SB:2013_04_01_09
ALTER TABLE shadowrun.spells
MODIFY COLUMN spell_range VARCHAR(6) NOT NULL;
--rollback ALTER TABLE shadowrun.spells MODIFY COLUMN spell_range CHAR(22) NOT NULL;

--changeset SB:2013_04_01_10
INSERT INTO shadowrun.spells (name, attributes, spell_type, spell_range, damage_type, duration, drain, rulebook, category_id, needs_specification)
VALUES
-- Heilzauber
('[Attribut] senken', 'Negativ', 'P', 'B', NULL, 'A', '(K ÷ 2) + 1', 'Basis', 1, 1),
('[Attribut] steigern', '', 'M', 'B', NULL, 'A', '(K ÷ 2) - 2', 'Basis', 1, 1),
('Entgiftung', '', 'M', 'B', NULL, 'P', '(K ÷ 2) - 4', 'Basis', 1, 0),
('Gegenmittel', '', 'M', 'B', NULL, 'P', '(Toxinschaden) - 2', 'Basis', 1, 0),
('Heilen', '', 'M', 'B', NULL, 'P', '(Schaden) - 2', 'Basis', 1, 0),
('Krankheit heilen', '', 'M', 'B', NULL, 'P', '(Schaden Krankheit) - 2', 'Basis', 1, 0),
('Prophylaxe', '', 'M', 'B', NULL, 'A', '(K ÷ 2) - 2', 'Basis', 1, 0),
('Reflexe steigern', '', 'M', 'B', NULL, 'A', '(K ÷ 2) + 2', 'Basis', 1, 0),
('Sauerstoffmaske', '', 'P', 'B', NULL, 'A', '(K ÷ 2) - 1', 'Basis', 1, 0),
('Schmerzresistenz', '', 'M', 'B', NULL, 'P', '(Schaden) - 4', 'Basis', 1, 0),
('Stabilisieren', '', 'M', 'B', NULL, 'P', '(Überschuss-Schaden) - 2', 'Basis', 1, 0),
('Winterschlaf', '', 'M', 'B', NULL, 'A', '(K ÷ 2) - 3', 'Basis', 1, 0),
-- Illusionszauber
('Heimlichkeit', 'Realistisch, Monosensorisch', 'P', 'BF', NULL, 'A', '(K ÷ 2) + 1', 'Basis', 2, 0),
('Maske', 'Realistisch, Vollsensorisch', 'M', 'B', NULL, 'A', '(K ÷ 2)', 'Basis', 2, 0),
('Physische Maske', 'Realistisch, Vollsensorisch', 'P', 'B', NULL, 'A', '(K ÷ 2) + 1', 'Basis', 2, 0),
('Schweigen', 'Realistisch, Monosensorisch, Flächenzauber', 'M', 'BF (F)', NULL, 'A', '(K ÷ 2) + 2', 'Basis', 2, 0),
('Stille', 'Realistisch, Monosensorisch, Flächenzauber', 'P', 'BF (F)', NULL, 'A', '(K ÷ 2) + 3', 'Basis', 2, 0),
('Trugbild', 'Realistisch, Vollsensorisch, Flächenzauber', 'M', 'BF (F)', NULL, 'A', '(K ÷ 2) + 2', 'Basis', 2, 0),
('Trideotrugbild', 'Realistisch, Vollsensorisch, Flächenzauber', 'P', 'BF (F)', NULL, 'A', '(K ÷ 2) + 3', 'Basis', 2, 0),
('Unsichtbarkeit', 'Realistisch, Monosensorisch', 'M', 'BF', NULL, 'A', '(K ÷ 2)', 'Basis', 2, 0),
('Verbesserte Unsichtbarkeit', 'Realistisch, Monosensorisch', 'P', 'BF', NULL, 'A', '(K ÷ 2) + 1', 'Basis', 2, 0),
('Unterhaltung', 'Offensichtlich, Vollsensorisch, Flächenzauber', 'M', 'BF (F)', NULL, 'A', '(K ÷ 2) + 1', 'Basis', 2, 0),
('Trideo-Unterhaltung', 'Offensichtlich, Vollsensorisch, Flächenzauber', 'P', 'BF (F)', NULL, 'A', '(K ÷ 2) + 2', 'Basis', 2, 0),
('Verwirrung', 'Realistisch, Vollsensorisch', 'M', 'BF', NULL, 'A', '(K ÷ 2)', 'Basis', 2, 0),
('Massenverwirrung', 'Realistisch, Vollsensorisch, Flächenzauber', 'M', 'BF (F)', NULL, 'A', '(K ÷ 2) + 2', 'Basis', 2, 0),
('Chaos', 'Realistisch, Vollsensorisch', 'P', 'BF', NULL, 'A', '(K ÷ 2) + 1', 'Basis', 2, 0),
('Chaotische Welt', 'Realistisch, Vollsensorisch, Flächenzauber', 'P', 'BF (F)', NULL, 'A', '(K ÷ 2) + 3', 'Basis', 2, 0),
-- Kampfzauber
('Energieschlag', 'Direkt, Berührung', 'P', 'B', 'K', 'S', '(K ÷ 2) - 1', 'Basis', 3, 0),
('Energieblitz', 'Direkt', 'P', 'BF', 'K', 'S', '(K ÷ 2) + 1', 'Basis', 3, 0),
('Energieball', 'Direkt, Flächenzauber', 'P', 'BF (F)', 'K', 'S', '(K ÷ 2) + 3', 'Basis', 3, 0),
('Blitzstrahl', 'Indirekt, Elementar', 'P', 'BF', 'K', 'S', '(K ÷ 2) + 3', 'Basis', 3, 0),
('Kugelblitz', 'Indirekt, Elementar, Flächenzauber', 'P', 'BF (F)', 'K', 'S', '(K ÷ 2) + 5', 'Basis', 3, 0),
('Flammenwerfer', 'Indirekt, Elementar', 'P', 'BF', 'K', 'S', '(K ÷ 2) + 3', 'Basis', 3, 0),
('Feuerball', 'Indirekt, Elementar, Flächenzauber', 'P', 'BF (F)', 'K', 'S', '(K ÷ 2) + 5', 'Basis', 3, 0),
('Säurestrom', 'Indirekt, Elementar', 'P', 'BF', 'K', 'S', '(K ÷ 2) + 3', 'Basis', 3, 0),
('Giftwelle', 'Indirekt, Elementar, Flächenzauber', 'P', 'BF (F)', 'K', 'S', '(K ÷ 2) + 5', 'Basis', 3, 0),
('Schlag', 'Indirekt, Berührung', 'P', 'B', 'K', 'S', '(K ÷ 2) - 2', 'Basis', 3, 0),
('Stoß', 'Indirekt', 'P', 'BF', 'K', 'S', '(K ÷ 2)', 'Basis', 3, 0),
('Druckwelle', 'Indirekt, Flächenzauber', 'P', 'BF (F)', 'K', 'S', '(K ÷ 2) + 2', 'Basis', 3, 0),
('Schockhand', 'Direkt, Berührung', 'M', 'B', 'G', 'S', '(K ÷ 2) - 3', 'Basis', 3, 0),
('Betäubungsblitz', 'Direkt', 'M', 'BF', 'G', 'S', '(K ÷ 2) - 1', 'Basis', 3, 0),
('Betäubungsball', 'Direkt, Flächenzauber', 'M', 'BF (F)', 'G', 'S', '(K ÷ 2) + 1', 'Basis', 3, 0),
('Todeshand', 'Direkt, Berührung', 'M', 'B', 'K', 'S', '(K ÷ 2) - 2', 'Basis', 3, 0),
('Manablitz', 'Direkt', 'M', 'BF', 'K', 'S', '(K ÷ 2)', 'Basis', 3, 0),
('Manaball', 'Direkt, Flächenzauber', 'M', 'BF (F)', 'K', 'S', '(K ÷ 2) + 2', 'Basis', 3, 0),
-- Manipulationszauber
('Beeinflussen', 'Beherrschung', 'M', 'BF', NULL, 'P', '(K ÷ 2) + 1', 'Basis', 4, 0),
('Eisdecke', 'Umgebungstransformation, Flächenzauber', 'P', 'BF (F)', NULL, 'S', '(K ÷ 2) + 3', 'Basis', 4, 0),
('Entzünden', 'Transformation', 'P', 'BF', NULL, 'P', '(K ÷ 2)', 'Basis', 4, 0),
('Gedanken beherrschen', 'Beherrschung', 'M', 'BF', NULL, 'A', '(K ÷ 2) + 2', 'Basis', 4, 0),
('Mob-Bewusstsein', 'Beherrschung, Flächenzauber', 'M', 'BF (F)', NULL, 'A', '(K ÷ 2) + 4', 'Basis', 4, 0),
('Gefühle beherrschen', 'Beherrschung', 'M', 'BF', NULL, 'A', '(K ÷ 2)', 'Basis', 4, 0),
('Mob-Laune', 'Beherrschung, Flächenzauber', 'M', 'BF (F)', NULL, 'A', '(K ÷ 2) + 2', 'Basis', 4, 0),
('Gestaltwandlung', 'Transformation', 'P', 'BF', NULL, 'A', '(K ÷ 2) + 2', 'Basis', 4, 0),
('Verwendlung in [Critter]', 'Transformation', 'P', 'BF', NULL, 'A', '(K ÷ 2) + 1', 'Basis', 4, 1),
('Handlungen beherrschen', 'Beherrschung', 'M', 'BF', NULL, 'A', '(K ÷ 2)', 'Basis', 4, 0),
('Mob-Kontrolle', 'Beherrschung, Flächenzauber', 'M', 'BF (F)', NULL, 'A', '(K ÷ 2) + 2', 'Basis', 4, 0),
('Licht', 'Umgebungstransformation', 'P', 'BF (F)', NULL, 'A', '(K ÷ 2) - 1', 'Basis', 4, 0),
('Levitieren', 'Transformation', 'P', 'BF', NULL, 'A', '(K ÷ 2) + 1', 'Basis', 4, 0),
('Manabarriere', 'Umgebungstransformation, Flächenzauber', 'M', 'BF (F)', NULL, 'A', '(K ÷ 2) + 1', 'Basis', 4, 0),
('Panzerung', 'Transformation', 'P', 'BF', NULL, 'A', '(K ÷ 2) + 3', 'Basis', 4, 0),
('Physische Barriere', 'Umgebungstransformation, Flächenzauber', 'P', 'BF (F)', NULL, 'A', '(K ÷ 2) + 3', 'Basis', 4, 0),
('Poltergeist', 'Umgebungstransformation, Flächenzauber', 'P', 'BF (F)', NULL, 'A', '(K ÷ 2) + 3', 'Basis', 4, 0),
('Schatten', 'Umgebungstransformation, Flächenzauber', 'P', 'BF (F)', NULL, 'A', '(K ÷ 2) + 1', 'Basis', 4, 0),
('Schleimverwandung', 'Transformation', 'P', 'BF', NULL, 'A', '(K ÷ 2) + 2', 'Basis', 4, 0),
('Schleuder', 'Transformation', 'P', 'BF', NULL, 'S', '(K ÷ 2) + 1', 'Basis', 4, 0),
('Versteinern', 'Transformation', 'P', 'BF', NULL, 'A', '(K ÷ 2) + 2', 'Basis', 4, 0),
('Zauberfinger', 'Transformation', 'P', 'BF', NULL, 'A', '(K ÷ 2) + 1', 'Basis', 4, 0),
-- Wahrnehmungszauber
('Geistessonde', 'Aktiv, Blickrichtungsgebunden', 'M', 'B', NULL, 'A', '(K ÷ 2) + 2', 'Basis', 5, 0),
('Gerät analysieren', 'Aktiv, Blickrichtungsgebunden', 'P', 'B', NULL, 'A', '(K ÷ 2)', 'Basis', 5, 0),
('Feinde aufspüren', 'Aktiv, Flächenzauber', 'M', 'B', NULL, 'A', '(K ÷ 2) + 1', 'Basis', 5, 0),
('Erweitertes Feinde aufspüren', 'Aktiv, Erhöhte Reichweite', 'M', 'B', NULL, 'A', '(K ÷ 2) + 3', 'Basis', 5, 0),
('Hellhören', 'Passiv, Blickrichtungsgebunden', 'M', 'B', NULL, 'A', '(K ÷ 2) - 1', 'Basis', 5, 0),
('Hellsicht', 'Passiv, Blickrichtungsgebunden', 'M', 'B', NULL, 'A', '(K ÷ 2) - 1', 'Basis', 5, 0),
('Individuum aufspüren', 'Aktiv, Flächenzauber', 'M', 'B', NULL, 'A', '(K ÷ 2) - 1', 'Basis', 5, 0),
('Kampfsinn', 'Aktiv, Übersinnlich', 'M', 'B', NULL, 'A', '(K ÷ 2) + 2', 'Basis', 5, 0),
('Leben aufspüren', 'Aktiv, Flächenzauber', 'M', 'B', NULL, 'A', '(K ÷ 2)', 'Basis', 5, 0),
('Erweitertes Leben aufspüren', 'Aktiv, Erhöhte Reichweite', 'M', 'B', NULL, 'A', '(K ÷ 2) + 2', 'Basis', 5, 0),
('[Lebensform] aufspüren', 'Aktiv, Flächenzauber', 'M', 'B', NULL, 'A', '(K ÷ 2) - 1', 'Basis', 5, 1),
('Erweitertes [Lebensform] aufspüren', 'Aktiv, Erhöhte Reichweite', 'M', 'B', NULL, 'A', '(K ÷ 2) + 1', 'Basis', 5, 1),
('Magie aufspüren', 'Aktiv, Flächenzauber', 'M', 'B', NULL, 'A', '(K ÷ 2)', 'Basis', 5, 0),
('Erweitertes Magie aufspüren', 'Aktiv, Erhöhte Reichweite', 'M', 'B', NULL, 'A', '(K ÷ 2) + 2', 'Basis', 5, 0),
('[Objekt] aufspüren', 'Aktiv, Flächenzauber', 'M', 'B', NULL, 'A', '(K ÷ 2) - 1', 'Basis', 5, 1),
('Telepathie', 'Aktiv, Übersinnlich', 'M', 'B', NULL, 'A', '(K ÷ 2) + 1', 'Basis', 5, 0),
('Wahrheit analysieren', 'Aktiv, Blickrichtungsgebunden', 'M', 'B', NULL, 'A', '(K ÷ 2)', 'Basis', 5, 0);
--rollback TRUNCATE TABLE shadowrun.spells;

--changeset SB:2013_04_03_01
INSERT INTO shadowrun.advantages (name, is_handicap, gp_value, description, rulebook)
VALUES
('Adept', 0, '5', NULL, 'Basis'),
('Astrales Chamäleon', 0, '5', NULL, 'Basis'),
('Außergewöhnliches Attribut', 0, '20', NULL, 'Basis'),
('Beidhändigkeit', 0, '5', NULL, 'Basis'),
('Erhöhte Konzentrationsfähigkeit', 0, '10 pro Stufe (max. 2)', NULL, 'Basis'),
('Fotografisches Gedächtnis', 0, '10', NULL, 'Basis'),
('Freundliche Geister', 0, '10', NULL, 'Basis'),
('Glück', 0, '20', NULL, 'Basis'),
('Gummigelenke', 0, '5', NULL, 'Basis'),
('Hohe Schmerztoleranz', 0, '5 pro Stufe (max. 3)', NULL, 'Basis'),
('Magieradept', 0, '10', NULL, 'Basis'),
('Magieresistenz', 0, '5 pro Stufe (max. 4)', NULL, 'Basis'),
('Menschliches Aussehen', 0, '5', NULL, 'Basis'),
('Mut', 0, '5', NULL, 'Basis'),
('Natürliche Immunität', 0, '5 oder 15', NULL, 'Basis'),
('Pathogen- und Toxinresistenz', 0, '5 oder 10', NULL, 'Basis'),
('Programmier-Genie', 0, '10', NULL, 'Basis'),
('Resistenz gegen Signalspitzen', 0, '10', NULL, 'Basis'),
('Schlechte Verbindung', 0, '10', NULL, 'Basis'),
('Schnellheilung', 0, '10', NULL, 'Basis'),
('Schutzpatron', 0, '5', NULL, 'Basis'),
('Soziales Chamäleon', 0, '5', NULL, 'Basis'),
('Talentiert', 0, '10', NULL, 'Basis'),
('Technomancer', 0, '5', NULL, 'Basis'),
('Tierempathie', 0, '10', NULL, 'Basis'),
('Überlebenswille', 0, '5 pro Stufe (max. 3)', NULL, 'Basis'),
('Unauffälligkeit', 0, '10', NULL, 'Basis'),
('Vertrautes Terrain', 0, '10', NULL, 'Basis'),
('Zähigkeit', 0, '10', NULL, 'Basis'),
('Zauberer', 0, '15', NULL, 'Basis'),
('Abhängigkeit', 1, '5 bis 30', NULL, 'Basis'),
('Allergien', 1, '5 bis 20', NULL, 'Basis'),
('Astrales Leuchtfeuer', 1, '5', NULL, 'Basis'),
('Elfenposer', 1, '5', NULL, 'Basis'),
('Empfindliches Nervensystem', 1, '5 (10 für Hacker/Technomancer)', NULL, 'Basis'),
('Feindliche Geister', 1, '10', NULL, 'Basis'),
('Gezeichnet', 1, '5 (10 für Hacker/Technomancer)', NULL, 'Basis'),
('Gremlins', 1, '5 pro Stufe (max. 4)', NULL, 'Basis'),
('Immunabstoßung', 1, '15', NULL, 'Basis'),
('Inkompetenz', 1, '5', NULL, 'Basis'),
('Kampflähmung', 1, '20', NULL, 'Basis'),
('Körperliche Schwäche', 1, '20', NULL, 'Basis'),
('Niedrige Schmerztoleranz', 1, '10', NULL, 'Basis'),
('Orkposer', 1, '5', NULL, 'Basis'),
('Programmier-Niete', 1, '5', NULL, 'Basis'),
('Schwaches Immunsystem', 1, '5', NULL, 'Basis'),
('Simsinn-Desorientierung', 1, '10 (15 für Hacker/Technomancer)', NULL, 'Basis'),
('SIN-Mensch', 1, '5 oder 10', NULL, 'Basis'),
('Ungebildet', 1, '20', NULL, 'Basis'),
('Ungehobelt', 1, '20', NULL, 'Basis'),
('Unglück', 1, '20', NULL, 'Basis');
--rollback TRUNCATE TABLE shadowrun.advantages;

--changeset SB:2013_04_03_02
ALTER TABLE shadowrun.adept_powers 
MODIFY COLUMN cost VARCHAR(100);
--rollback ALTER TABLE shadowrun.adept_powers MODIFY COLUMN cost VARCHAR(20);

--changeset SB:2013_04_03_03
TRUNCATE TABLE shadowrun.adept_powers;
INSERT INTO shadowrun.adept_powers (name, cost, rulebook)
VALUES
('Adrenalinkick', '0,25 pro Stufe', 'Basis'),
('Astrale Wahrnehmung', '1', 'Basis'),
('Beschleunigte Heilung', '0,25 pro Stufe', 'Basis'),
('Geschärfter Sinn', '0,25 pro Verbesserung', 'Basis'),
('Geschossparade', '0,25 pro Stufe', 'Basis'),
('Gesteigerte Reflexe', 'Variabel', 'Basis'),
('Gesteigertes Körperliches Attribut', '1 pro Stufe', 'Basis'),
('Großer Sprung', '0,25 pro Stufe', 'Basis'),
('Kampfsinn', '0,5 pro Stufe', 'Basis'),
('Körpersprache', '0,5 pro Stufe', 'Basis'),
('Kritischer Schlag', '0,25 pro Stufe', 'Basis'),
('Magieresistenz', '0,5 pro Stufe', 'Basis'),
('Mystischer Panzer', '0,5 pro Stufe', 'Basis'),
('Natürliche Immunität', '0,25 pro Stufe', 'Basis'),
('Schmerzresistenz', '0,5 pro Stufe', 'Basis'),
('Stimmkontrolle', '0,5 pro Stufe', 'Basis'),
('Todeskralle', '0,5 pro Stufe', 'Basis'),
('Verbesserte Fertigkeit', '0,5 pro Stufe (Kampf), 0,25 pro Stufe (Andere)', 'Basis'),
('Verbesserte Wahrnehmung', '0,25 pro Stufe', 'Basis');
--rollback TRUNCATE TABLE shadowrun.adept_powers;

--changeset SB:2013_04_03_04
CREATE TABLE shadowrun.character_skills (
	id				INT AUTO_INCREMENT PRIMARY KEY,
	character_id	INT NOT NULL,
	skill_id		INT,
	skill_group_id	INT,
	specialization	VARCHAR(200),
	skill_value		SMALLINT NOT NULL,
	CONSTRAINT fk_characterskills_character FOREIGN KEY (character_id) REFERENCES characters(id),
	CONSTRAINT fk_characterskills_skill FOREIGN KEY (skill_id) REFERENCES skills(id),
	CONSTRAINT fk_characterskills_skillgroup FOREIGN KEY (skill_group_id) REFERENCES skill_groups(id),
	CONSTRAINT ux_characterskill UNIQUE (character_id, skill_id, specialization)
) ENGINE INNODB;
--rollback DROP TABLE shadowrun.character_skills;

--changeset SB:2013_04_03_05
CREATE TABLE shadowrun.character_advantages (
	id				INT AUTO_INCREMENT PRIMARY KEY,
	character_id	INT NOT NULL,
	advantage_id	INT NOT NULL,
	specification	VARCHAR(200),
	level			SMALLINT,
	CONSTRAINT fk_characteradvantages_character FOREIGN KEY (character_id) REFERENCES characters(id),
	CONSTRAINT fk_characteradvantages_advantage FOREIGN KEY (advantage_id) REFERENCES advantages(id),
	CONSTRAINT ux_characteradvantage UNIQUE(character_id, advantage_id, specification)
) ENGINE INNODB;
--rollback DROP TABLE shadowrun.character_advantages;

--changeset SB:2013_04_03_06
CREATE TABLE shadowrun.character_spells (
	id				INT AUTO_INCREMENT PRIMARY KEY,
	character_id	INT NOT NULL,
	spell_id		INT NOT NULL,
	specification	VARCHAR(200),
	CONSTRAINT fk_characterspells_character FOREIGN KEY (character_id) REFERENCES characters(id),
	CONSTRAINT fk_characterspells_spell FOREIGN KEY (spell_id) REFERENCES spells(id),
	CONSTRAINT ux_characterspell UNIQUE(character_id, spell_id, specification)
) ENGINE INNODB;
--rollback DROP TABLE shadowrun.character_spells;

--changeset SB:2013_04_03_07
CREATE TABLE shadowrun.character_powers (
	id				INT AUTO_INCREMENT PRIMARY KEY,
	character_id	INT NOT NULL,
	adept_power_id	INT NOT NULL,
	specification	VARCHAR(200),
	level			SMALLINT,
	CONSTRAINT fk_characterpowers_character FOREIGN KEY (character_id) REFERENCES characters(id),
	CONSTRAINT fk_characterpowers_adeptpower FOREIGN KEY (adept_power_id) REFERENCES adept_powers(id),
	CONSTRAINT ux_characterpower UNIQUE(character_id, adept_power_id, specification)
) ENGINE INNODB;
--rollback DROP TABLE shadowrun.character_powers;

--changeset SB:2013_04_03_08
CREATE TABLE shadowrun.character_connections (
	id				INT AUTO_INCREMENT PRIMARY KEY,
	character_id	INT NOT NULL,
	name			VARCHAR(100) NOT NULL,
	loyalty			SMALLINT NOT NULL,
	rating			SMALLINT NOT NULL,
	description		VARCHAR(10000),
	CONSTRAINT fk_caracterconnections_character FOREIGN KEY (character_id) REFERENCES characters(id)
) ENGINE INNODB;
--rollback DROP TABLE shadowrun.character_connections;

--changeset SB:2013_04_03_09
CREATE TABLE shadowrun.character_implants (
	id				INT AUTO_INCREMENT PRIMARY KEY,
	character_id	INT NOT NULL,
	name			VARCHAR(100) NOT NULL,
	rating			SMALLINT,
	essence_cost	FLOAT NOT NULL,
	description		VARCHAR(10000),
	CONSTRAINT fk_caracterimplants_character FOREIGN KEY (character_id) REFERENCES characters(id)
) ENGINE INNODB;
--rollback DROP TABLE shadowrun.character_implants;
