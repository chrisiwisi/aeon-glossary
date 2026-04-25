package TodlicherTeddy.AionGlossary.OpenAI.DTOs;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record MessageResponse(
    String id
) {
}
