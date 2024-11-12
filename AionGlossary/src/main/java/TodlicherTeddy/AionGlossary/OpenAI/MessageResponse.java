package TodlicherTeddy.AionGlossary.OpenAI;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record MessageResponse(
    String id
) {
}
