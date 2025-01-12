package TodlicherTeddy.AionGlossary.OpenAI;

import TodlicherTeddy.AionGlossary.OpenAI.DTOs.FullThread;
import TodlicherTeddy.AionGlossary.OpenAI.DTOs.Message;
import lombok.RequiredArgsConstructor;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessageService  {
    //getBean('insert name', Prompt.class) can be used to implement multiple implementations of Prompt for different APIs
    private final ApplicationContext context;

    public FullThread prompt(String message) {
        Prompt prompt = context.getBean(Prompt.class);
        return prompt.addMessage(message).run().poll().getFullThread();
    }

    public FullThread getFullThread() {
        return context.getBean(Prompt.class).getFullThread();
    }

    public String createNewThread() {
        return context.getBean(Prompt.class).createNewThread();
    }

}
