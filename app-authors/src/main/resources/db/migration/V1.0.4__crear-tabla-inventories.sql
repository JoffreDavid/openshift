CREATE TABLE inventories
(
    book_isbn VARCHAR(255) NOT NULL,
    sold      INTEGER,
    supplied  INTEGER,
    version   INTEGER,
    CONSTRAINT pk_inventories PRIMARY KEY (book_isbn)
);

ALTER TABLE inventories
    ADD CONSTRAINT FK_INVENTORIES_ON_BOOK_ISBN FOREIGN KEY (book_isbn) REFERENCES books (isbn);

insert into inventories (book_isbn, sold, supplied, version) values ('9780132350884', 15, 50, 1);
insert into inventories (book_isbn, sold, supplied, version) values ('9780132126953', 8, 30, 1);
insert into inventories (book_isbn, sold, supplied, version) values ('9780132350874', 20, 40, 1);