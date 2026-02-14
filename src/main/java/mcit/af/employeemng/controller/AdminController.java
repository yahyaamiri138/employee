package mcit.af.employeemng.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        // sample admin-only data
        return Map.of("usersCount", 10, "productsCount", 42);
    }
}
