package com.programacion.distribuida.customers.service;

import com.programacion.distribuida.customers.db.Customer;
import com.programacion.distribuida.customers.repo.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository repository;

    public List<Customer> findAll() {
        return repository.findAll();
    }

    public List<Customer> findByEmail(String email) {
        Optional<Customer> opt = repository.findByEmail(email);
        if (opt.isPresent()) {
            return List.of(opt.get());
        }
        return List.of();
    }

    public Optional<Customer> findById(Integer id) {
        return repository.findById(id);
    }

    public Customer save(Customer customer) {
        return repository.save(customer);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }

    public boolean existsById(Integer id) {
        return repository.existsById(id);
    }
    
    public boolean existsByEmail(String email) {
        return repository.findByEmail(email).isPresent();
    }
}
