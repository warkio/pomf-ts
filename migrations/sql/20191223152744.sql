begin;

insert into migrations (id) values (20191223152744);

-- Do not modify anything above this comment.
-----------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users(
    id BIGSERIAL primary key,
    username text unique,
    password text not null,
    created_at timestamp without time zone default now(),
    updated_at timestamp without time zone default now(),
    api_key uuid unique not null default uuid_generate_v4()
);

-- Uploads table
CREATE TABLE IF NOT EXISTS pomf_uploads(
    id BIGSERIAL primary key,
    original_name text not null,
    new_file_name text not null,
    hash_value text not null,
    uploaded_by bigint references users(id)
);


-----------------------------------------------------------------------
-- Do not modify anything below this comment.

commit;
