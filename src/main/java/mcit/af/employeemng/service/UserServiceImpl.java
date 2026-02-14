package mcit.af.employeemng.service;

import mcit.af.employeemng.config.RoleEnum;
import mcit.af.employeemng.entity.User;
import mcit.af.employeemng.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    // ---------------------------
    // Full registration method
    // ---------------------------
    @Override
    public User register(String name, String lastname, String email, String username, String rawPassword, Set<String> rolesStr) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }

        if (name == null || name.trim().isEmpty()) name = username;
        if (lastname == null) lastname = "";
        if (email == null || email.trim().isEmpty()) email = username + "@example.com";
        if (rolesStr == null || rolesStr.isEmpty()) rolesStr = Set.of("ROLE_USER");

        Set<RoleEnum> roles = rolesStr.stream()
                .map(RoleEnum::valueOf)
                .collect(Collectors.toSet());

        User user = new User();
        user.setName(name);
        user.setLastname(lastname);
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(encoder.encode(rawPassword));
        user.setRoles(roles);

        return userRepository.save(user);
    }

    // ---------------------------
    // Simplified registration
    // ---------------------------
    @Override
    public User register(String username, String rawPassword, Set<String> rolesStr) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }

        if (rolesStr == null || rolesStr.isEmpty()) rolesStr = Set.of("ROLE_USER");

        Set<RoleEnum> roles = rolesStr.stream()
                .map(RoleEnum::valueOf)
                .collect(Collectors.toSet());

        User user = new User();
        user.setUsername(username);
        user.setPassword(encoder.encode(rawPassword));
        user.setRoles(roles);

        user.setName(username);
        user.setLastname("");
        user.setEmail(username + "@example.com");

        return userRepository.save(user);
    }

    // ---------------------------
    // Find user by username
    // ---------------------------
    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // ---------------------------
    // Find user by id
    // ---------------------------
    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // ---------------------------
    // Get all users
    // ---------------------------
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ---------------------------
    // Update user by id
    // ---------------------------
    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(existingUser -> {
            if (updatedUser.getName() != null) existingUser.setName(updatedUser.getName());
            if (updatedUser.getLastname() != null) existingUser.setLastname(updatedUser.getLastname());
            if (updatedUser.getEmail() != null) existingUser.setEmail(updatedUser.getEmail());
            if (updatedUser.getUsername() != null) existingUser.setUsername(updatedUser.getUsername());
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                existingUser.setPassword(encoder.encode(updatedUser.getPassword()));
            }
            if (updatedUser.getRoles() != null && !updatedUser.getRoles().isEmpty()) {
                existingUser.setRoles(updatedUser.getRoles());
            }
            return userRepository.save(existingUser);
        }).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}
