package TodlicherTeddy.AionGlossary.OpenAI;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

@RequiredArgsConstructor
public class Prompt {
    private final String promptText;
    @Value( "${aion.openai.thread-id}" )
    private String threadId;

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
                "complete",
                "should be object",
                12456487,
                null,
                "user",
                new String[]{"this is another object?", "second object"},
                "assistant id",
                "run id",
                new String[]{"attachment object[]", "second attachment object[]"},
                "metadata"
        );
    }
}
