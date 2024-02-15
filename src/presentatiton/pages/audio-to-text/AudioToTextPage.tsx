
import { useState } from "react";
import { GPTMessage, MyMessage, TextMessageBoxFile, TypingLoader, } from "../../components";
import { AudioToTextUseCase } from "../../../core/use-cases";

interface Message {
    text: string;
    isGPT: boolean;
}

export const AudioToTextPage = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessage] = useState<Message[]>([])

    const handlePost = async (text: string, audioFile: File) => {
        setIsLoading(true)
        setMessage((prev) => [...prev, { text: text, isGPT: false }])

        const data = await AudioToTextUseCase(audioFile, text)

        setIsLoading(false)

        if (!data) return;

        const gptMessage = `
            ## Transcripcion:
            ## Texto que escribiste: ${data.text}
            __Duracion:__ ${Math.round(data.duration)} segundos
        `


        setMessage((prev) => [
            ...prev,
            { text: gptMessage, isGPT: false }])

        for (const segment of data.segments) {
            const segmentMessage = `
__Desde ${Math.round(segment.start)} hasta ${Math.round(segment.end)} segundos:__
${segment.text}
`

            setMessage((prev) => [
                ...prev,
                { text: segmentMessage, isGPT: false }])
        }
    }
    return (
        <div className='chat-container'>
            <div className="chat-messages">
                <div className="grid grid-cols-12 gap-y-2">

                    <GPTMessage text="Hola, que audio quieres generar hoy?" />
                    {
                        messages.map((msj, index) => (
                            msj.isGPT
                                ? (
                                    <GPTMessage key={index} text={msj.text} />
                                )
                                :
                                <MyMessage key={index} text={(msj.text === '') ? 'Transcribe el audio' : msj.text} />
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

            <TextMessageBoxFile
                onSendMessage={handlePost}
                placeholder="Escribe algo"
                disableCorrections
                accept="audio/*"
            />
        </div>
    )
}
