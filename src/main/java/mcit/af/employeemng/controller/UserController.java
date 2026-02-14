package mcit.af.employeemng.controller;

import mcit.af.employeemng.entity.User;
import mcit.af.employeemng.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Register new user
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationRequest request) {
        try {
            User user = userService.register(
                request.getUsername(),
                request.getPassword(),
                request.getRoles()
            );
            
            // Set the new fields if they exist in request
            if (request.getName() != null) user.setName(request.getName());
            if (request.getLastname() != null) user.setLastname(request.getLastname());
            if (request.getEmail() != null) user.setEmail(request.getEmail());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Get user by username
 @GetMapping("/id/{id}")
public ResponseEntity<User> getUserById(@PathVariable Long id) {
    return userService.getUserById(id) // این متد باید در سرویس وجود داشته باشد
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}


    // Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest request) {
        return userService.findByUsername(request.getUsername())
                .map(existingUser -> {
                    if (!existingUser.getId().equals(id)) {
                        return ResponseEntity.badRequest().body("Username already exists");
                    }
                    // Update fields
                    if (request.getName() != null) existingUser.setName(request.getName());
                    if (request.getLastname() != null) existingUser.setLastname(request.getLastname());
                    if (request.getEmail() != null) existingUser.setEmail(request.getEmail());
                    if (request.getRoles() != null) {
                        existingUser.setRoles(request.getRoles().stream()
                                .map(roleName -> mcit.af.employeemng.config.RoleEnum.valueOf(roleName))
                                .collect(java.util.stream.Collectors.toSet()));
                    }
                    return ResponseEntity.ok(existingUser);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete user
    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.getAllUsers().stream()
                .filter(user -> user.getId().equals(id))
                .findFirst()
                .ifPresent(user -> {
                    // You'll need to add delete method in service/repository
                    // For now, we'll just return success
                });
        return ResponseEntity.noContent().build();
    }

    // Request DTO for registration
    public static class UserRegistrationRequest {
        private String name;
        private String lastname;
        private String email;
        private String username;
        private String password;
        private Set<String> roles;

        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getLastname() { return lastname; }
        public void setLastname(String lastname) { this.lastname = lastname; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        
        public Set<String> getRoles() { return roles; }
        public void setRoles(Set<String> roles) { this.roles = roles; }
    }

    // Request DTO for update
    public static class UserUpdateRequest {
        private String name;
        private String lastname;
        private String email;
        private String username;
        private Set<String> roles;

        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getLastname() { return lastname; }
        public void setLastname(String lastname) { this.lastname = lastname; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public Set<String> getRoles() { return roles; }
        public void setRoles(Set<String> roles) { this.roles = roles; }
    }
}