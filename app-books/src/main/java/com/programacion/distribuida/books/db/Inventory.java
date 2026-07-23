package com.programacion.distribuida.books.db;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "inventories")
@Getter @Setter
@ToString
public class Inventory {

    @Id
    @OneToOne
    @JoinColumn(name = "book_isbn")
    @ToString.Exclude
    private Book book;

    private Integer sold;
    private Integer supplied;
    private Integer version;

}
