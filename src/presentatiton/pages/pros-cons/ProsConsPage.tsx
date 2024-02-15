import { useState } from "react";
import { GPTMessage, MyMessage, TypingLoader, TextMessageBox } from "../../components";
import { ProsConstDiscusserUseCase } from "../../../core/use-cases";


interface Message {
  text: string;
  isGPT: boolean;
}

export const ProsConsPage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessage] = useState<Message[]>([])

  const handlePost = async (text: string) => {
    setIsLoading(true)
    setMessage((prev) => [...prev, { text: text, isGPT: false }])

    const data = await ProsConstDiscusserUseCase(text)

    if (!data.ok) {
      setMessage((prev) => [...prev, { text: 'No se pudo mostrar los pros y cont', isGPT: true }])
    } else {
      setMessage((prev) => [...prev,
      {
        text: data.content,
        isGPT: true,
      }])
    }
    setIsLoading(false)
  }
  return (
    <div className='chat-container'>
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          <GPTMessage text="Puedes escribir lo que sea que quieres que compares y te de mi punto de vista" />
          {
            messages.map((msj, index) => (
              msj.isGPT
                ? (
                  <GPTMessage 
                  key={index} 
                  text={msj.text} />
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
