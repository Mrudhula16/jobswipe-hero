
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const initialBotMessages = [
  "Hi there! I'm here to help collect your feedback or bug reports. What would you like to share today?",
  "You can tell me about any issues you're experiencing or suggestions for improvement.",
];

const FeedbackChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize chat with bot greeting when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage: Message = {
        id: "initial-msg",
        text: initialBotMessages[0],
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
      
      // Add the follow-up bot message after a short delay
      setTimeout(() => {
        const followUpMessage: Message = {
          id: "follow-up-msg",
          text: initialBotMessages[1],
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prevMessages => [...prevMessages, followUpMessage]);
      }, 1000);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const responseText = generateBotResponse(input);
      const botResponse: Message = {
        id: `bot-${Date.now()}`,
        text: responseText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
      
      // If it was a submission, show confirmation
      if (responseText.includes("Thank you for your")) {
        toast({
          title: "Feedback Submitted",
          description: "Your feedback has been successfully recorded.",
        });
      }
    }, 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    const userInputLower = userInput.toLowerCase();
    
    // Check if input contains keywords related to bugs
    if (
      userInputLower.includes("bug") || 
      userInputLower.includes("error") || 
      userInputLower.includes("issue") || 
      userInputLower.includes("not working")
    ) {
      return "Thank you for your bug report! Could you please provide more details such as which page you encountered the issue on and any error messages you saw?";
    }
    
    // Check if input contains keywords related to feedback or suggestions
    else if (
      userInputLower.includes("suggest") || 
      userInputLower.includes("feature") || 
      userInputLower.includes("improve") || 
      userInputLower.includes("add") ||
      userInputLower.includes("feedback")
    ) {
      return "Thank you for your suggestion! We appreciate your input on how we can improve the platform. Is there anything specific that prompted this suggestion?";
    }

    // Check if it's a thank you message
    else if (
      userInputLower.includes("thank") || 
      userInputLower.includes("thanks")
    ) {
      return "You're welcome! Is there anything else I can help you with?";
    }
    
    // General response for detailed submissions
    else if (userInput.length > 100) {
      return "Thank you for your detailed feedback! We've recorded your submission and our team will review it soon.";
    }
    
    // Default response
    return "Thanks for sharing. Could you provide more details about what you're experiencing or suggesting?";
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button 
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full p-0"
          variant="default"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>Feedback Assistant</DrawerTitle>
          <DrawerDescription>
            Share your feedback or report bugs to help us improve.
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="flex flex-col flex-1 px-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 max-w-[80%] ${
                  message.isUser ? "ml-auto" : "mr-auto"
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {message.text}
                </div>
                <div
                  className={`text-xs text-muted-foreground mt-1 ${
                    message.isUser ? "text-right" : "text-left"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="flex items-center gap-2 pb-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your feedback or bug report..."
              className="resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default FeedbackChat;
