package TodlicherTeddy.AionGlossary.OpenAI;

import org.springframework.stereotype.Service;

@Service
public class MessageService {

    public Prompt prompt(String message) {
        return new Prompt(message);
    }
}
