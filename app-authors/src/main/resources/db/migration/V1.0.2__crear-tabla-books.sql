CREATE TABLE books
(
    isbn    VARCHAR(255) NOT NULL,
    title   VARCHAR(255),
    price   DECIMAL,
    version INTEGER,
    CONSTRAINT pk_books PRIMARY KEY (isbn)
);

insert into books (isbn, price, title, version) values ('9780132350884', 10.99, 'Harry Potter', 1);
insert into books (isbn, price, title, version) values ('9780132126953', 16.45, 'El Silmarilion', 1);
insert into books (isbn, price, title, version) values ('9780132350874', 15.25, 'Narnia', 1);