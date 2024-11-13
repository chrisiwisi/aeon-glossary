package TodlicherTeddy.AionGlossary.OpenAI;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;

@Component
@Slf4j
public class OpenAiInterceptor implements ClientHttpRequestInterceptor {
    @Value("${aion.openai.api-key}")
    private String apiKey;

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
        URI requestURI = request.getURI();
        log.trace("[RequestInterceptor][{}] Adding headers", requestURI.getAuthority());
        if (isOpenAiCall(requestURI.getAuthority())) {
            request.getHeaders().set("Authorization", "Bearer " + this.apiKey);
            request.getHeaders().set("OpenAI-Beta", "assistants=v2");
        }
        return execution.execute(request, body);
    }

    private boolean isOpenAiCall(final String requestURI) {
        return requestURI.equals("api.openai.com");
    }
}
