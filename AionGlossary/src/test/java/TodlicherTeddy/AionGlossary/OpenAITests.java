package TodlicherTeddy.AionGlossary;

import TodlicherTeddy.AionGlossary.OpenAI.DTOs.Message;
import TodlicherTeddy.AionGlossary.OpenAI.PromptFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.ExpectedCount;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URISyntaxException;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;

public class OpenAITests extends BaseTestCase {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private PromptFactory promptFactory;
    @Autowired
    private RestTemplate restTemplate;

    private MockRestServiceServer mockServer;

    @Value( "${aion.openai.thread-id}" )
    private String ThreadID;

    @BeforeEach
    public void init() {
        mockServer = MockRestServiceServer.createServer(restTemplate);
    }

    @Test
    public void testGetMessagesEndpointReturnsMessageFromPrompt() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/aionGlossary/api/v1/messages"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string(containsString("this is a response object")));
    }

    @Test
    public void testMessageServicePromptRunPollResponseTriggersAPICalls() throws URISyntaxException {
        //TODO initialize API response object here and use mapper.writeValueAsString(obj) to provide it in mocks
        mockServer.expect(ExpectedCount.once(),
                requestTo(new URI("https://api.openai.com/v1/threads/" + this.ThreadID + "/messages")))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withStatus(HttpStatus.OK)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("WRITE MOCK JSON HERE"));
        //TODO mock the other requests

        Message response = this.promptFactory.createPrompt(this.ThreadID).addMessage("What is a pygmalion Stone?").run().poll().getFullThread().data()[0];

        assertThat(response.content().length, is(1));
        assertThat(response.content()[0].toString(), containsString("pygmalion Stone"));
    }

}
