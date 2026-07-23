CREATE TABLE books_authors
(
    books_isbn VARCHAR(255) NOT NULL,
    authors_id INTEGER      NOT NULL,
    CONSTRAINT pk_books_authors PRIMARY KEY (books_isbn, authors_id)
);

ALTER TABLE books_authors
    ADD CONSTRAINT FK_BOOKS_AUTHORS_ON_AUTHORS FOREIGN KEY (authors_id) REFERENCES authors (id);

insert into books_authors (books_isbn, authors_id) values ('9780132350884', 1);
insert into books_authors (books_isbn, authors_id) values ('9780132126953', 2);
insert into books_authors (books_isbn, authors_id) values ('9780132350874', 3);
insert into books_authors (books_isbn, authors_id) values ('9780132126953', 1);