import { useRef, useState } from "react";
import { GPTMessage, MyMessage, TypingLoader, TextMessageBox } from "../../components";
import { prosConstStreamGeneratorUseCase } from "../../../core/use-cases";

interface Message {
    text: string;
    isGPT: boolean;
}

export const ProsConsStreamPage = () => {

    const abortController = useRef(new AbortController());
    const isRunning = useRef(false)
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessage] = useState<Message[]>([])

    const handlePost = async (text: string) => {

        if (isRunning.current = true) {
            abortController.current.abort();
            abortController.current = new AbortController()
        }

        setIsLoading(true)
        isRunning.current = true
        setMessage((prev) => [...prev, { text: text, isGPT: false }])

        const stream = prosConstStreamGeneratorUseCase(text, abortController.current.signal);

        setIsLoading(false)
        isRunning.current = false

        setMessage((mjs) => [...mjs, { text: '', isGPT: true }])

        for await (const text of stream) {
            setMessage((mjs) => {
                const newMessages = [...mjs] // mensajes anteriores
                newMessages[newMessages.length - 1].text = text        //ultimo mensaje que acabos de insertar = al mensaje ainsertar
                return newMessages
            })
        }
    }
    return (
        <div className='chat-container'>
            <div className="chat-messages">
                <div className="grid grid-cols-12 gap-y-2">

                    <GPTMessage text="¿Que deseas comparar hoy?" />
                    {
                        messages.map((msj, index) => (
                            msj.isGPT
                                ? (
                                    <GPTMessage key={index} text={msj.text} />
                                )
                                :
                                <MyMessage key={index} text={msj.text} />
                        ))
                    }
                    {
                        isLoading && (
                            <div className="col start1 col-end-12 fade-in">
                                <TypingLoader className="fade-in" />

                            </div>
                        )
                    }
                </div>
            </div>

            <TextMessageBox
                onSendMessage={handlePost}
                placeholder="Escribe algo"
                disableCorrections
            />
        </div>
    )
}
