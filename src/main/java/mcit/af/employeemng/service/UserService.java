package mcit.af.employeemng.service;

import mcit.af.employeemng.entity.User;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserService {
    // Full registration with all fields
    User register(String name, String lastname, String email, String username, String rawPassword, Set<String> roles);
    
    // Simplified registration (for backward compatibility)
    User register(String username, String rawPassword, Set<String> roles);
    
    Optional<User> findByUsername(String username);
    
    Optional<User> getUserById(Long id); // <-- new method
    
    List<User> getAllUsers();
}
