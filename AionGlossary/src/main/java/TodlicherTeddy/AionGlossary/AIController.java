package TodlicherTeddy.AionGlossary;

import TodlicherTeddy.AionGlossary.OpenAI.Message;
import TodlicherTeddy.AionGlossary.OpenAI.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "aionGlossary/api/v1")
@Slf4j
public class AIController {
    private final MessageService messageService;

    @GetMapping("/messages") //TODO maybe return no internal ids?
    ResponseEntity<Message> completion(@RequestParam(value = "message", defaultValue = "Tell me a joke") String message) {
        log.trace("A new rules question was asked: {}", message);
        return ResponseEntity.ok(messageService.prompt(message));
    }
}
