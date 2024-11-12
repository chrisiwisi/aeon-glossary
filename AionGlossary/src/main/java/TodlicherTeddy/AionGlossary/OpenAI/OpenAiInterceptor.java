package TodlicherTeddy.AionGlossary.OpenAI;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@Slf4j
public class OpenAiInterceptor implements HandlerInterceptor {
    @Value("${aion.openai.api-key}")
    private String apiKey;

    @Override
    public boolean preHandle(final HttpServletRequest request, final HttpServletResponse response, final Object handler) throws Exception {
        String requestURI = request.getRequestURI();
        log.info("[preHandle][{}][{}]{}", request, request.getMethod(), requestURI);

        if (isOpenAiCall(requestURI)) {
            response.setHeader("Authorization", "Bearer " + this.apiKey);
        }
        return true;
    }

    private boolean isOpenAiCall(final String requestURI) {
        return requestURI.startsWith("https://api.openai.com");
    }
}
