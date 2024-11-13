package TodlicherTeddy.AionGlossary.OpenAI.DTOs;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Message(
        String id,
        String object,
        int created_at,
        String assistant_id,
        String thread_id,
        String run_id,
        String role,
        Object[] content,
        Object[] attachments,
        Object metadata
) {
}
