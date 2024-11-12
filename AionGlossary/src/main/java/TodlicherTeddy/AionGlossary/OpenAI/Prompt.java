package TodlicherTeddy.AionGlossary.OpenAI;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
@RequiredArgsConstructor
public class Prompt {
    @Value( "${aion.openai.thread-id}" )
    private String threadId;
    private final OpenAiService openAiService;

    public Prompt addMessage(String message) {
        openAiService.addPrompt(message);
        return this;
    }

    public Prompt run() {
        return this;
    }

    public Prompt poll() {
        return this;
    }

    public Message latestResponse() {
        return new Message(
                "id",
                "i dunno",
                15946573,
                "Thread id und so",
                "completed",
                "should be object",
                12456487,
                null,
                "user",
                new String[]{"this is a response object?", "second response object"},
                "assistant id",
                "run id",
                new String[]{"attachment object[]", "second attachment object[]"},
                "metadata"
        );
    }
}
