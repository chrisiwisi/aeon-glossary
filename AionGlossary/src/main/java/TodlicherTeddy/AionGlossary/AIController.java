package TodlicherTeddy.AionGlossary;

import TodlicherTeddy.AionGlossary.OpenAI.DTOs.FullThread;
import TodlicherTeddy.AionGlossary.OpenAI.DTOs.Message;
import TodlicherTeddy.AionGlossary.OpenAI.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "aionGlossary/api/v1")
@Slf4j
@CrossOrigin(origins = "http://localhost:4200/")
public class AIController {
    private final MessageService messageService;

    //TODO split into send message and poll response, also add a getAllMessages thread
    @GetMapping("/messages") //TODO maybe return no internal ids?
    ResponseEntity<FullThread> completion(@RequestParam(value = "message", defaultValue = "Tell me a joke about greek mythology") String message) {
        log.trace("A new rules question was asked: {}", message);
        return ResponseEntity.ok(messageService.prompt(message));
    }

    @GetMapping("/threads")
    ResponseEntity<FullThread> thread() { //TODO give every user/ group of users their own Thread
        log.trace("Fetching all messages in thread");
        return ResponseEntity.ok(messageService.getFullThread());
    }
}
