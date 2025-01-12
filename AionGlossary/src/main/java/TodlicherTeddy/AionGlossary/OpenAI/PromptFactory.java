package TodlicherTeddy.AionGlossary.OpenAI;

import lombok.RequiredArgsConstructor;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PromptFactory {
    //getBean('insert name', Prompt.class) can be used to implement multiple implementations of Prompt for different APIs
    private final ApplicationContext context;

    public Prompt createPrompt(String id) {
        Prompt prompt = context.getBean(Prompt.class);
        prompt.setThreadId(id);
        return prompt;
    }

    public Prompt createPrompt() {
        return createPrompt(null); //TODO what should happen here?
    }

}
