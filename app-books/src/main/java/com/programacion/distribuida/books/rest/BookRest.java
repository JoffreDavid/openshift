package com.programacion.distribuida.books.rest;

import com.programacion.distribuida.books.clients.AuthorRestClient;
import com.programacion.distribuida.books.db.Book;
import com.programacion.distribuida.books.dtos.AuthorDto;
import com.programacion.distribuida.books.dtos.BookDto;
import com.programacion.distribuida.books.repo.BookRepository;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.persistence.EntityManager;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriBuilder;
import lombok.RequiredArgsConstructor;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.RestClientBuilder;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.util.List;

@Path("/books")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Transactional
@ApplicationScoped
public class BookRest {

    final BookRepository bookRepository;
    final AuthorRestClient client;

    @Inject
    EntityManager em;

    @Inject
    public BookRest(BookRepository bookRepository, @RestClient AuthorRestClient client) {
        this.bookRepository = bookRepository;
        this.client = client;
    }


    @GET
    @Path("/{isbn}")
    public Response findByIsbn(@PathParam("isbn") String isbn) {

        return bookRepository.findByIdOptional(isbn)
                .map(book -> {

                    var authors =  client.findByBook(isbn);

                    return BookDto.builder()
                            .isbn(book.getIsbn())
                            .title(book.getTitle())
                            .price(book.getPrice())
                            .authors(authors)
                            .inventorySold(book.getInventory() != null ? book.getInventory().getSold() : null)
                            .inventorySupplied(book.getInventory() != null ? book.getInventory().getSupplied() : null)
                            .build();
                })

                .map(Response::ok)
                .orElse(Response.status(Response.Status.NOT_FOUND))
                .build();
    }

    @GET
    public List<BookDto> findAll() {
        return bookRepository.streamAll()
                .map(book -> {
                    var authors =  client.findByBook(book.getIsbn());
                    return BookDto.builder()
                            .isbn(book.getIsbn())
                            .title(book.getTitle())
                            .price(book.getPrice())
                            .authors(authors)
                            .inventorySold(book.getInventory() != null ? book.getInventory().getSold() : null)
                            .inventorySupplied(book.getInventory() != null ? book.getInventory().getSupplied() : null)
                            .build();
                })
                .toList();
    }

    @PUT
    @Path("/{isbn}")
    public Response update(@PathParam("isbn") String isbn, Book book) {
        return bookRepository.findByIdOptional(isbn)
                .map(it -> {
                    it.setTitle(book.getTitle());
                    it.setPrice(book.getPrice());
                    return Response.ok(it).build();
                })
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    @DELETE
    @Path("/{isbn}")
    public Response delete(@PathParam("isbn") String isbn) {
        em.createNativeQuery("DELETE FROM books_authors WHERE books_isbn = :isbn")
          .setParameter("isbn", isbn)
          .executeUpdate();
        em.createNativeQuery("DELETE FROM inventories WHERE book_isbn = :isbn")
          .setParameter("isbn", isbn)
          .executeUpdate();
        bookRepository.deleteById(isbn);
        return Response.ok().build();
    }

    @POST
    public Response update(Book book) {
        bookRepository.persist(book);
        var uri = UriBuilder.fromUri("/books/{isbn}")
                .build(book.getIsbn());
        return Response.created(uri).build();
    }
}
