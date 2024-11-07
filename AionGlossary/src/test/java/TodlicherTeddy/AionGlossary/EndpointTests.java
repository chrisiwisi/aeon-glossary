package TodlicherTeddy.AionGlossary;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

public class EndpointTests extends BaseTestCase {
    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetMessagesReturnsMessageFromPrompt() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/aionGlossary/api/v1/messages"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string(Matchers.containsString("this is a response object")));
    }

}
