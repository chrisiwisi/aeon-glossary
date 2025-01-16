import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {RulesCardComponent} from "./rules-card/rules-card.component";
import {NgClass, NgForOf} from "@angular/common";
import {SearchPipe} from "./search/search.pipe";
import {FormsModule} from "@angular/forms";
import {} from "@angular/common/http";
import {ConversationComponent} from "./aion-chatbot/conversation/conversation.component";
import {ChatPromptComponent} from "./aion-chatbot/chat-prompt/chat-prompt.component";
import {AionComponent} from "./aion-chatbot/aion.component";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RulesCardComponent, NgForOf, SearchPipe, FormsModule,
        // TODO: `HttpClientModule` should not be imported into a component directly.
        // Please refactor the code to add `provideHttpClient()` call to the provider list in the
        // application bootstrap logic and remove the `HttpClientModule` import from this component.
        HttpClientModule, NgClass, ConversationComponent, ChatPromptComponent, AionComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
}
