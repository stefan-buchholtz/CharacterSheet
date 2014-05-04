--liquibase formatted sql

--changeset SB:2014_04_20_01
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

--changeset SB:2014_04_20_06
CREATE TABLE character_sheet.rule_systems (
	id				INT AUTO_INCREMENT PRIMARY KEY,
	name			VARCHAR(40) NOT NULL,
	template_path	VARCHAR(20) NOT NULL
) ENGINE INNODB;
--rollback DROP TABLE character_sheet.rule_systems;

--changeset SB:2014_04_20_07
INSERT INTO character_sheet.rule_systems(id, name, template_path)
VALUES(1, 'ShadowRun 4', 'sr4');
--rollback DELETE FROM character_sheet.rule_systems WHERE id=1;

--changeset SB:2014_04_20_08
CREATE TABLE character_sheet.characters (
	id						INT AUTO_INCREMENT PRIMARY KEY,
	user_id					INT NOT NULL,
	name					VARCHAR(200) NOT NULL,
	rule_system_id			INT NOT NULL,
	character_data			TEXT,
	character_status		VARCHAR(1000),
	CONSTRAINT fk_character_user FOREIGN KEY (user_id) REFERENCES users(id),
	CONSTRAINT fk_character_rulesystem FOREIGN KEY (rule_system_id) REFERENCES rule_systems(id)
) ENGINE INNODB;
--rollback DROP TABLE character_sheet.characters;

--changeset SB:2014_05_03_01
CREATE USER charactersheet@localhost IDENTIFIED BY 'HVtYYZN3rkd8iX';
--rollback DROP USER charactersheet@localhost;

--changeset SB:2014_05_03_02
GRANT SELECT, UPDATE, INSERT, DELETE ON character_sheet.* TO charactersheet@localhost;
--rollback REVOKE SELECT, UPDATE, INSERT, DELETE ON character_sheet.* FROM charactersheet@localhost;

--changeset SB:2014_05_04_01
ALTER TABLE character_sheet.characters ADD (
	is_public BIT NOT NULL DEFAULT 0
);
--rollback ALTER TABLE character_sheet.characters DROP COLUMN is_public;
