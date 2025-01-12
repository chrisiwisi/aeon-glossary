package TodlicherTeddy.AionGlossary;

import TodlicherTeddy.AionGlossary.OpenAI.DTOs.FullThread;
import TodlicherTeddy.AionGlossary.OpenAI.DTOs.Message;
import TodlicherTeddy.AionGlossary.OpenAI.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "aionGlossary/api/v1")
@Slf4j
@CrossOrigin(origins = {"http://localhost:4200/", "https://todlicherteddy.github.io/aeon-glossary/"})
public class AIController {
    private final MessageService messageService;

    //TODO split into send message and poll response, also add a getAllMessages thread
    @GetMapping("/messages") //TODO maybe return no internal ids?
    ResponseEntity<FullThread> completion(@RequestParam(value = "message", defaultValue = "Tell me a joke about greek mythology") String message) {
        log.trace("A new rules question was asked: {}", message);
        return ResponseEntity.ok(messageService.prompt(message));
    }

    //TODO without authentication everyone can theoretically guess an id and read the messages of others!
    @GetMapping("/threads")
    ResponseEntity<String> thread() {
        log.trace("Opening a new Thread");
        return ResponseEntity.ok(messageService.createNewThread());
    }

    @GetMapping("/threads/{id}")
    ResponseEntity<FullThread> getFullThread(@PathVariable(value = "id") Long id) {
        log.trace("Fetching all messages in thread");
        return ResponseEntity.ok(messageService.getFullThread());
    }
}
