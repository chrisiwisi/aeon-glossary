package TodlicherTeddy.AionGlossary;

import TodlicherTeddy.AionGlossary.OpenAI.OpenAiInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
@RequiredArgsConstructor
public class Config {
    private final OpenAiInterceptor openAiInterceptor;

    @Bean
    RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.interceptors(openAiInterceptor).build();
    }

}
