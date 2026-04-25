package TodlicherTeddy.AionGlossary.OpenAI.DTOs;

public record FullThread(
        String object,
        Message[] data,
        String first_id,
        String last_id,
        boolean has_more
) {
}
