package TodlicherTeddy.AionGlossary.OpenAI;

import TodlicherTeddy.AionGlossary.OpenAI.DTOs.FullThread;
import TodlicherTeddy.AionGlossary.OpenAI.DTOs.MessageResponse;
import TodlicherTeddy.AionGlossary.OpenAI.DTOs.RunPoll;
import TodlicherTeddy.AionGlossary.OpenAI.DTOs.RunResponse;
import TodlicherTeddy.AionGlossary.OpenAI.DTOs.ThreadCreationResponse;
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
    @Value("${aion.openai.assistant-id}")
    private String assistantID;

    public MessageResponse addPrompt(String threadID, String message) {
        log.info("Adding prompt [{}]", message);
        Map<String, String> body = new HashMap<>();
        body.put("role", "user");
        body.put("content", message);
        return restTemplate.postForObject(this.baseUri + "/threads/" + threadID + "/messages", body, MessageResponse.class);
    }

    public RunResponse run(String threadID) {
        log.info("Starting run for assistant [{}]", this.assistantID);
        Map<String, String> body = new HashMap<>();
        body.put("assistant_id", this.assistantID);
        return restTemplate.postForObject(this.baseUri + "/threads/" + threadID + "/runs", body, RunResponse.class);
    }

    public String poll(String threadID, String runID) {
        log.info("Polling for run [{}]", runID);
        String status = "queued";
        RunPoll result = null;
        while (status.equals("queued") || status.equals("in_progress")) {
            result = restTemplate.getForEntity(this.baseUri + "/threads/" + threadID + "/runs/" + runID, RunPoll.class).getBody();
            if (result == null) {
                log.error("Polling for run [{}] failed and returned no response", runID);
                return "error";
            }
            status = result.status();
            try { //TODO remove this and replace with ScheduledExecutorService and maybe an async response to client
                Thread.sleep(500);
            } catch (InterruptedException e) {
                log.error("Thread was interrupted while polling for run [{}]", runID);
            }
        }
        log.info("Polling for run [{}] completed with status [{}]", runID, status);
        if (!status.equals("completed")) {
            log.error("last error [{}] incomplete details [{}]", result.last_error(), result.incomplete_details());
        }
        return status;
    }

    public FullThread getFullThread(String threadID) {
        log.info("Fetching full thread for thread [{}]", threadID);
        return restTemplate.getForObject(this.baseUri + "/threads/" + threadID + "/messages", FullThread.class);
    }

    public ThreadCreationResponse createNewThread() {
        log.info("Creating a new OpenAI thread");
        Map<String, String> body = new HashMap<>();
        return restTemplate.postForObject(this.baseUri + "/threads", body, ThreadCreationResponse.class);
    }
}
