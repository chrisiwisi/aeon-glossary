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

    public MessageResponse addPrompt(String message) {
        Map<String, String> parameters = new HashMap<>();
        parameters.put("role", "user");
        parameters.put("content", message);
        log.info("{}/threads/{}/messages", this.baseUri, this.threadID);
        return restTemplate.postForObject(this.baseUri + "/threads/" + this.threadID + "/messages", parameters, MessageResponse.class);
    }
}
