"use client";
import { useState } from "react";
import { CornerDownLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/components/chat";

export function ChatForm() {
  const [message, setMessage] = useState("");
  const { send } = useChat();

  const handleInput = (event: React.KeyboardEvent) => {
    if (event.code === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send(message);
      setMessage("");
    }
  };

  const handleSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    send(message);
    setMessage("");
  };

  return (
    <>
      <Badge variant="outline" className="absolute right-3 top-3">
        Output
      </Badge>
      <div className="flex-1" />
      <form className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
          value={message}
          onChange={(evt) => setMessage(evt.target.value)}
          onKeyDown={handleInput}
        />
        <div className="flex items-center p-3 pt-0">
          {/* <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Paperclip className="size-4" />
                      <span className="sr-only">Attach file</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Attach File</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Mic className="size-4" />
                      <span className="sr-only">Use Microphone</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Use Microphone</TooltipContent>
                </Tooltip> */}
          <Button
            type="submit"
            size="sm"
            className="ml-auto gap-1.5"
            onClick={handleSubmit}
          >
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </>
  );
}
