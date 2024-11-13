package TodlicherTeddy.AionGlossary.OpenAI.DTOs;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Message(
        String id,
        String object,
        int created_at,
        String thread_id,
        String status,
        Object incomplete_details,
        Integer completed_at,
        Integer incomplete_et,
        String role,
        Object[] content,
        String assistant_id,
        String run_id,
        Object[] attachments,
        Object metadata
) {
}
