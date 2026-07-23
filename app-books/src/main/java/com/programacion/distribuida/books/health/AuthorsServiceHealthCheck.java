package com.programacion.distribuida.books.health;

import com.programacion.distribuida.books.clients.AuthorRestClient;
import com.programacion.distribuida.books.dtos.AuthorDto;
import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.HealthCheckResponseBuilder;
import org.eclipse.microprofile.health.Liveness;
import org.eclipse.microprofile.health.Readiness;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;

@Liveness
@Readiness
@ApplicationScoped
public class AuthorsServiceHealthCheck implements HealthCheck {

    @Inject
    @RestClient
    AuthorRestClient authorRestClient;

    @Override
    public HealthCheckResponse call() {
        HealthCheckResponseBuilder responseBuilder = HealthCheckResponse.named("Authors Service Health Check");

        try {
            List<AuthorDto> authors = authorRestClient.findByBook("health-check-test");
            

            if (authors != null && !authors.isEmpty() && authors.get(0).getId() == 0) {
                return responseBuilder.down().withData("status", "Fallback triggered / Circuit Open").build();
            }

            return responseBuilder.up().withData("status", "Authors service reachable").build();
        } catch (Exception e) {
            return responseBuilder.down().withData("error", e.getMessage()).build();
        }
    }
}
