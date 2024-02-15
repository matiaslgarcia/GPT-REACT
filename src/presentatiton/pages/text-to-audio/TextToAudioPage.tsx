
import { useState } from "react";
import { GPTMessage, MyMessage, TypingLoader, TextMessageBoxSelect, GPTMessageAudio } from "../../components";
import { textToAudioUseCase } from "../../../core/use-cases";


const voices = [
  { id: "nova", text: "Nova" },
  { id: "alloy", text: "Alloy" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "onyx", text: "Onyx" },
  { id: "shimmer", text: "Shimmer" },
]


interface TextMessage {
  text: string;
  isGpt: boolean;
  type: 'text'
}

interface AudioMessage {
  text: string;
  isGpt: boolean,
  audio: string,
  type: 'audio'
}

type Message = TextMessage | AudioMessage

export const TextToAudioPage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessage] = useState<Message[]>([])

  const handlePost = async (text: string, selectedVoice: string) => {
    setIsLoading(true)
    setMessage((prev) => [...prev, { text: text, isGpt: false, type: 'text' }])

    const data = await textToAudioUseCase(text, selectedVoice)
    if (!data.ok) {
      return
    } else {
      setMessage((prev) => [...prev,
      {
        text: `${selectedVoice} - ${data.message}`,
        isGpt: true,
        type: 'audio',
        audio: data.audioUrl!
      }])
    }
    setIsLoading(false)
  }
  return (
    <div className='chat-container'>
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          <GPTMessage text="¿Que audios quieres generar hoy?" />
          {
            messages.map((msj, index) => (
              msj.isGpt
                ?
                (
                  msj.type === 'audio'
                    ?
                    (
                      <GPTMessageAudio key={index} text={msj.text} audio={msj.audio} />
                    )
                    :
                    <GPTMessage key={index} text={msj.text} />

                ) :
                <MyMessage key={index} text={msj.text} />
            )
            )
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
        placeholder="Escribe algo"
        options={voices}
      />
    </div>
  )
}
