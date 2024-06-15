import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MessageService } from '../../services/message.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { GreetingResponse } from '../../interface/interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollframe') scrollFrame!: ElementRef;

  public messages:
    | [{ message: string; timestamp: Date; sender: string }]
    | any = [
  ];
  public message: string = '';

  messageCounts: { sender: string; count: number }[] = [];
  isBotTyping: boolean = false;
  constructor(
    private messageService: MessageService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
  ) {}
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  /**
   * Initializes the ChatComponent.
   * Calls the `botMessage` method to send a welcome message from the bot.
  */
  ngOnInit(): void {
    this.botMessage('Hello 😊');
  }
  /**
   * Scrolls the chat window to the bottom.
   * This method is called after a new message is added to the chat history.
   */
  scrollToBottom(): void {
    if (this.scrollFrame) {
      try {
        this.scrollFrame.nativeElement.scrollTop =
          this.scrollFrame.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Error scrolling to bottom:', err);
      }
    }
  }

  formatBold(data: string) {
    return data.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  }

  logOut() {
    this.authService.logout();
  }

  /**
   * Sends a message to the chat from the bot.
   * @param message The text message to be sent by the bot.
   */
  botMessage(message: string) {
    this.isBotTyping = true;
    this.messages.push({ message: 'Bot typing...', sender: 'YOU' });
    this.messageService.message(message).subscribe(
      (res: GreetingResponse) => {
        this.isBotTyping = false;
        const responseWithoutQuotes = this.formatBold(res.response);
        // Update the message property of the last message with the response from the bot,
        // after sanitizing it with the DomSanitizer
        this.messages[this.messages.length - 1] = {
          message: this.sanitizer.bypassSecurityTrustHtml(
            responseWithoutQuotes
          ),
          // Update the timestamp and sender properties of the last message
          timestamp: new Date(),
          sender: 'YOU',
        };
      },
      (error) => {
        this.isBotTyping = false;
      }
    );
  }

  /**
   * Sends a message to the chat from the user.
   * @param message The text message to be sent by the user.
   */
  sendMessage(message: string): void {
    if(this.isBotTyping)
      return;
    // Trim the message to remove leading/trailing whitespace
    message = message.trim();

    // Check if the message is not empty
    if (message !== '') {
      // Check if the message contains any HTML tags
      if (message.match(/([\<])([^\>]{1,})*([\>])/i)) {
        // Alert the user that only text messages can be sent
        alert('only text message can be sent');
      } else {
        // Add the message to the chat history with the current timestamp and sender as 'ME'
        this.messages.push({ message, timestamp: new Date(), sender: 'ME' });
        // Scroll to the bottom of the chat window
        this.scrollToBottom();
        // Clear the input field
        this.message = '';
        // Call the botMessage method to send a message from the bot
        this.botMessage(message);
      }
    }
  }
}
