package com.programacion.distribuida.books.rest;

import com.programacion.distribuida.books.db.Inventory;
import com.programacion.distribuida.books.repo.InventoryRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.List;

@Path("/inventories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class InventoryRest {

    @Inject
    InventoryRepository inventoryRepository;

    @GET
    public List<Inventory> obtenerTodos() {
        return inventoryRepository.listAll();
    }

    @GET
    @Path("/{isbn}")
    public Response obtenerPorId(@PathParam("isbn") String isbn) {
        return inventoryRepository.findByIdOptional(isbn)
                .map(Response::ok)
                .orElse(Response.status(Response.Status.NOT_FOUND))
                .build();
    }
}
