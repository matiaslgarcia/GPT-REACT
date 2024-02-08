import { useState } from "react";
import { GPTMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"

interface Message {
  text: string;
  isGPT: boolean;
}

export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessage] = useState<Message[]>([])

  const handlePost = async (text: string) => {
    setIsLoading(true)
    setMessage((prev) => [...prev, { text: text, isGPT: false }])

    //TODO: UseCase
    setIsLoading(false)

    //Todo: añadir mensaje
  }
  return (
    <div className='chat-container'>
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          <GPTMessage text="Hola, soy tu asistente profesional" />
          {
            messages.map((msj, index) => (
              msj.isGPT
                ? (
                  <GPTMessage key={index} text="Esto es de OpenAI" />
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
      {/* <TextMessageBoxFile
        onSendMessage={handlePost}
        placeholder="Escribe algo"

      /> */}
      {/* <TextMessageBoxSelect
        onSendMessage={handlePost}
        placeholder="Escribe algo"
        disableCorrections
        options={[{id:'1', text:'hola'}, {id:"2", text:'mundo'}]}
      /> */}
    </div>
  )
}
