package TodlicherTeddy.AionGlossary;

import TodlicherTeddy.AionGlossary.OpenAI.MessageService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Config {
    @Bean
    MessageService messageService() {
        return new MessageService();
    }
}
