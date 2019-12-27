begin;

insert into migrations (id) values (20191224134539);

-- Do not modify anything above this comment.
-----------------------------------------------------------------------


ALTER TABLE pomf_uploads
    ADD COLUMN created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now();


-----------------------------------------------------------------------
-- Do not modify anything below this comment.

commit;
