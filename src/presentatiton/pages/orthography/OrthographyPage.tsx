import { useState } from "react";
import { GPTMessage, GPTOrthographyMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { orthographyUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGPT: boolean;
  info?: {
    userScore: number
    errors: string[]
    message: string
  }
}

export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessage] = useState<Message[]>([])

  const handlePost = async (text: string) => {
    setIsLoading(true)
    setMessage((prev) => [...prev, { text: text, isGPT: false }])

    const data = await orthographyUseCase(text)

    if (!data.ok) {
      setMessage((prev) => [...prev, { text: 'No se pudo realizar la correccion', isGPT: true }])
    } else {
      setMessage((prev) => [...prev,
      {
        text: data.message,
        isGPT: true,
        info: {
          errors: data.errors,
          message: data.message,
          userScore: data.userScore
        }
      }
      ])
    }
    setIsLoading(false)
  }
  return (
    <div className='chat-container'>
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          <GPTMessage text="Hola, soy tu asistente profesional, escribe lo que quieras para poder corregirte" />
          {
            messages.map((msj, index) => (
              msj.isGPT
                ? (
                  <GPTOrthographyMessage
                    key={index}
                    errors={msj.info!.errors}
                    message={msj.info!.message}
                    userScore={msj.info!.userScore}
                  />
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
