package TodlicherTeddy.AionGlossary.OpenAI;

import TodlicherTeddy.AionGlossary.OpenAI.DTOs.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
@RequiredArgsConstructor
@Slf4j
public class Prompt {
    private final OpenAiService openAiService;
    private String runID;

    public Prompt addMessage(String message) {
        openAiService.addPrompt(message);
        return this;
    }

    public Prompt run() {
        runID = openAiService.run().id();
        return this;
    }

    public Prompt poll() {
        if (runID == null) {
            log.error("Poll has been called before a run was created");
            return this;
        }
        openAiService.poll(runID);
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
