package TodlicherTeddy.AionGlossary.OpenAI.DTOs;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record RunResponse(
        String id,
        String assistant_id,
        String thread_id
) {
}
