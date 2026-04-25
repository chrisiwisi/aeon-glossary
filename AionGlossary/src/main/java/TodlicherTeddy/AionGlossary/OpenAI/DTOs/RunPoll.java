package TodlicherTeddy.AionGlossary.OpenAI.DTOs;

public record RunPoll(
        LastError last_error,
        String incomplete_details,
        String status
) {
    public record LastError(
            String code,
            String message
    ) {}
}
