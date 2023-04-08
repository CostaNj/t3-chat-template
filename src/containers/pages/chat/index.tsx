import React, { type FormEventHandler, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import Link from "next/link";
import Image from "next/image";

import { Button } from "~/components/buttons/button";
import { Input } from "~/components/inputs/input";
import { DEFAULT_AVATAR } from "~/constants/providers";

import { ChatInputsContainer, MessageContainer, Message, MessagesBox } from "./styles/chat.styles";

type Message = {
  sender: string,
  message: string
  avatar: string
}

export const ChatPage: React.FC = () => {
  const { data: sessionData } = useSession();

  const [chats, setChats] = useState<Message[]>([]);
  const [messageToSend, setMessageToSend] = useState("");
  const sendMessage = api.pusher.sendAll.useMutation();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, { cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER });

    const channel = pusher.subscribe("chat");

    channel.bind("chat-event", (data: Message) => {
      setChats((prevState) => [
        ...prevState,
        { sender: data.sender, message: data.message, avatar: data.avatar },
      ]);
    });

    return () => {
      pusher.unsubscribe("chat");
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback( (e) => {
    e.preventDefault();
	 if(messageToSend) {
		 setMessageToSend('')
		 sendMessage.mutate({
			 message: messageToSend,
			 sender: sessionData?.user?.name ?? 'Unknown',
			 avatar: sessionData?.user?.image ?? DEFAULT_AVATAR
		 })
	 }
  }, [sendMessage, messageToSend, sessionData?.user?.name ])

  if (!sessionData) {
    return (
      <div>
        AccessDenied
      </div>
    )
  }

  return (
    <>
      <MessagesBox>
        {chats.map((chat, index) => (
          <MessageContainer key={`chat_message_${index}`}>
				 <Image
					 alt={chat.sender}
					 src={chat.avatar}
					 height={40}
					 width={40}
					 style={{
						 objectFit: 'cover',
						 borderRadius: 50
					 }}
				 />
            <Message>{chat.message}</Message>
          </MessageContainer>
        ))}
      </MessagesBox>

      <br/>
      <br/>
      <form onSubmit={handleSubmit}>
			<ChatInputsContainer>
				<Input
					type="text"
					value={messageToSend}
					onChange={(e) => setMessageToSend(e.target.value)}
					placeholder="start typing...."
				/>
				<Button type="submit">
					Send
				</Button>
				<Link href='/'>
					<Button>
						Go back
					</Button>
				</Link>
			</ChatInputsContainer>
      </form>
    </>
  );
};
