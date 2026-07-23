package com.programacion.distribuida.authors.rest;

import com.programacion.distribuida.authors.db.Author;
import com.programacion.distribuida.authors.db.BookAuthor;
import com.programacion.distribuida.authors.db.BookAuthorId;
import com.programacion.distribuida.authors.dtos.AuthorDto;
import com.programacion.distribuida.authors.repo.AuthorRepository;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import jakarta.transaction.Transactional;

@Path("/authors")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Transactional
public class AuthorRest {

    @Inject
    AuthorRepository authorRepository;

    @Inject
    EntityManager em;

    @Inject
    @ConfigProperty(name = "quarkus.http.port")
    Integer httpPort;

    AtomicInteger counter = new AtomicInteger(1);

    @GET
    public List<Author> getAll() {
        return authorRepository.listAll();
    }

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Integer id) {

        return authorRepository.findByIdOptional(id)
                .map( it -> {
                    AuthorDto dto = AuthorDto.builder()
                            .id(it.getId())
                            .name(it.getName() + " (puerto: " + httpPort + ")")
                            .build();
                    return dto;
                })
                .map(Response::ok)
                .orElse(Response.status(Response.Status.NOT_FOUND))
                .build();
    }

    @GET
    @Path("/find/{isbn}")
    public List<AuthorDto> findByBook(@PathParam("isbn") String isbn){
        if ("0".equals(isbn)) {
            int valor = counter.getAndIncrement();
            if (valor % 5 != 0) {
                String msg = String.format("Intento %d generando error simulado para Circuit Breaker", valor);
                System.out.println(msg);
                throw new RuntimeException(msg);
            }
        }
        return authorRepository.findByBook(isbn)
                .stream()
                .map(it -> AuthorDto.builder()
                        .id(it.getId())
                        .name(it.getName() + " (puerto: " + httpPort + ")")
                        .build())
                .toList();
    }

    @POST
    public Response create(Author author) {
        authorRepository.persist(author);
        return Response.status(Response.Status.CREATED).entity(author).build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Integer id, Author author) {
        return authorRepository.findByIdOptional(id)
                .map(it -> {
                    it.setName(author.getName());
                    it.setVersion(author.getVersion());
                    return Response.ok(it).build();
                })
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Integer id) {
        em.createQuery("delete from BookAuthor ba where ba.id.authorId = :authorId")
          .setParameter("authorId", id)
          .executeUpdate();
        boolean deleted = authorRepository.deleteById(id);
        if (deleted) {
            return Response.noContent().build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @POST
    @Path("/{id}/books/{isbn}")
    public Response addBook(@PathParam("id") Integer id, @PathParam("isbn") String isbn) {
        BookAuthor ba = new BookAuthor();
        BookAuthorId baId = new BookAuthorId();
        baId.setAuthorId(id);
        baId.setBookIsbn(isbn);
        ba.setId(baId);
        em.persist(ba);
        return Response.status(Response.Status.CREATED).build();
    }

    @DELETE
    @Path("/{id}/books/{isbn}")
    public Response removeBook(@PathParam("id") Integer id, @PathParam("isbn") String isbn) {
        int deleted = em.createQuery("delete from BookAuthor ba where ba.id.authorId = :authorId and ba.id.bookIsbn = :bookIsbn")
          .setParameter("authorId", id)
          .setParameter("bookIsbn", isbn)
          .executeUpdate();
        if (deleted > 0) return Response.noContent().build();
        return Response.status(Response.Status.NOT_FOUND).build();
    }
}
