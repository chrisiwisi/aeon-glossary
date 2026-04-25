package TodlicherTeddy.AionGlossary.OpenAI;

import TodlicherTeddy.AionGlossary.OpenAI.DTOs.FullThread;
import TodlicherTeddy.AionGlossary.OpenAI.DTOs.Message;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
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
    @Setter
    private String threadId;
    private String runID;

    public Prompt addMessage(String message) {
        openAiService.addPrompt(this.threadId, message);
        return this;
    }

    public Prompt run() {
        runID = openAiService.run(this.threadId).id();
        return this;
    }

    public Prompt poll() {
        if (runID == null) {
            log.error("Poll has been called before a run was created");
            return this;
        }
        openAiService.poll(this.threadId, runID);
        return this;
    }

    public Message latestResponse() {
        return getFullThread().data()[0];
    }

    public FullThread getFullThread() {
        return openAiService.getFullThread(this.threadId);
    }

    public String createNewThread() {
        this.threadId = openAiService.createNewThread().id();
        return this.threadId;
    }

}
