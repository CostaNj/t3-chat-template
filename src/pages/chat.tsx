import { type FormEventHandler, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";

import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import Link from "next/link";

type Message = {
  sender: string,
  message: string
}

const Chat: React.FC = () => {
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
        { sender: data.sender, message: data.message },
      ]);
    });

    return () => {
      pusher.unsubscribe("chat");
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback( (e) => {
    e.preventDefault();
    sendMessage.mutate({ message: messageToSend, sender: sessionData?.user?.name ?? 'Unknown' })
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
      <Link href="/">
        Go Back
      </Link>
      <p>Hello, {sessionData?.user?.name}</p>
      <div>
        {chats.map((chat, id) => (
          <>
            <small>{chat.sender}: </small>
            <span>{chat.message}</span>
            <br/>
            <br/>
          </>
        ))}
      </div>

      <br/>
      <br/>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.target.value)}
          placeholder="start typing...."
        />
        <button
          type="submit"
        >
          Send
        </button>
      </form>
    </>
  );
};

export default Chat;