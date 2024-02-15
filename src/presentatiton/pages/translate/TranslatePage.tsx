import { useState } from "react";
import { GPTMessage, MyMessage, TypingLoader, TextMessageBoxSelect } from "../../components";
import { transalteUseCase } from "../../../core/use-cases";


interface Message {
    text: string;
    isGPT: boolean;
}

const languages = [
    { id: "alemán", text: "Alemán" },
    { id: "árabe", text: "Árabe" },
    { id: "bengalí", text: "Bengalí" },
    { id: "francés", text: "Francés" },
    { id: "hindi", text: "Hindi" },
    { id: "inglés", text: "Inglés" },
    { id: "japonés", text: "Japonés" },
    { id: "mandarín", text: "Mandarín" },
    { id: "portugués", text: "Portugués" },
    { id: "ruso", text: "Ruso" },
];

export const TranslatePage = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessage] = useState<Message[]>([])

    const handlePost = async (text: string, selectedOptions: string) => {
        setIsLoading(true)

        const newMessage = `Traduce: ${text} al idioma ${selectedOptions}`
        setMessage((prev) => [...prev, { text: newMessage, isGPT: false }])

        const data = await transalteUseCase(newMessage, selectedOptions)

        if (!data.ok) {
            setMessage((prev) => [...prev, { text: 'No se pudo traducir', isGPT: true }])
        } else {
            setMessage((prev) => [...prev,
            {
                text: data.message,
                isGPT: true,
            }])
        }

        setIsLoading(false)
    }
    return (
        <div className='chat-container'>
            <div className="chat-messages">
                <div className="grid grid-cols-12 gap-y-2">

                    <GPTMessage text="¿Que quieres que traduzca?" />
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

            <TextMessageBoxSelect
                onSendMessage={handlePost}
                placeholder="Selecciona un Idioma"
                options={languages}
            />
        </div>
    )
}
