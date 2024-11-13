package TodlicherTeddy.AionGlossary.OpenAI;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenAiService {
    private final RestTemplate restTemplate;
    @Value("${aion.openai.base-uri}")
    private String baseUri;
    @Value("${aion.openai.thread-id}")
    private String threadID;
    @Value("${aion.openai.thread-id}")
    private String assistantID;

    public MessageResponse addPrompt(String message) {
        log.info("Adding prompt [{}]", message);
        Map<String, String> body = new HashMap<>();
        body.put("role", "user");
        body.put("content", message);
        return restTemplate.postForObject(this.baseUri + "/threads/" + this.threadID + "/messages", body, MessageResponse.class);
    }

    public RunResponse run() {
        log.info("Starting run for assistant [{}]", assistantID);
        Map<String, String> body = new HashMap<>();
        body.put("assistant_id", assistantID);
        return restTemplate.postForObject(this.baseUri + "/threads/" + this.threadID + "/runs", body, RunResponse.class);
    }


}
