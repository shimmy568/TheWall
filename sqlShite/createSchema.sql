CREATE TABLE messages (
	id SERIAL UNIQUE,
	message	VARCHAR,
	ip		VARCHAR,
	time	BIGINT
);

CREATE TABLE banList (
	ip VARCHAR UNIQUE,
	expire BIGINT
);
