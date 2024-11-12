package TodlicherTeddy.AionGlossary.OpenAI;

import lombok.RequiredArgsConstructor;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessageService  {
    private final ApplicationContext context;

    public Message prompt(String message) {
        Prompt prompt = context.getBean(Prompt.class);
        return prompt.addMessage(message).run().poll().latestResponse();
    }
}
