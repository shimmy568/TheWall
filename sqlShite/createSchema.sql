CREATE TABLE messages (
	id SERIAL UNIQUE,
	message		VARCHAR,
	ip			VARCHAR,
	time		BIGINT UNSIGNED
);
