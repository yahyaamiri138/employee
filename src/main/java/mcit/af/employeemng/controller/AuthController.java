package mcit.af.employeemng.controller;

import mcit.af.employeemng.service.UserService;
import mcit.af.employeemng.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import mcit.af.employeemng.entity.User;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {
        try {
            String username = (String) body.get("username");
            String password = (String) body.get("password");
            
            if (username == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required"));
            }
            // Extract optional fields with defaults
            String name = (String) body.getOrDefault("name", username);
            String lastname = (String) body.getOrDefault("lastname", "");
            String email = (String) body.getOrDefault("email", username + "@example.com");
            
            @SuppressWarnings("unchecked")
            Set<String> roles = body.get("roles") == null ? 
                Set.of("ROLE_USER") : 
                Set.copyOf((java.util.Collection<String>) body.get("roles"));
            
            // Use the full registration method
            User user = userService.register(name, lastname, email, username, password, roles);
            
            return ResponseEntity.ok(Map.of(
                "id", user.getId(), 
                "username", user.getUsername(),
                "message", "User registered successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String username = body.get("username");
            String password = body.get("password");
            
            if (username == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required"));
            }
            
            var optUser = userService.findByUsername(username);
            if (optUser.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
            }
            
            User user = optUser.get();
            
            if (!passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
            }
            
            Set<String> roles = user.getRoles().stream()
                .map(Enum::name)
                .collect(Collectors.toSet());
            
            String token = jwtUtil.generateToken(username, roles);
            return ResponseEntity.ok(Map.of(
                "token", token, 
                "username", username, 
                "roles", roles,
                "message", "Login successful"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // NOTE: getAllUsers() method has been removed - use /api/users endpoint instead
}