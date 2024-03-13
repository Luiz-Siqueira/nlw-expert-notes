import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface newNoteCardProps {
  onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null;

export function NewNoteCard({ onNoteCreated }: newNoteCardProps) {
  const [shoudShowOnboarding, setShoudShowOnboarding] = useState(true);
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleStartRecord = () => {
    const isSpeechRecognitionApiAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionApiAvailable) {
      toast.warning(
        "Infelizmente seu navegador não suporta a API de gravação!"
      );
      return;
    }

    setIsRecording(true);
    setShoudShowOnboarding(false);

    const SpeechRecognitionApi =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionApi();

    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;
    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");
      setContent(transcription);
    };
    speechRecognition.onerror = (event) => {
      console.error(event);
    };
    speechRecognition.start();
  };
  const handleStopRecord = () => {
    setIsRecording(false);

    if (speechRecognition) {
      speechRecognition.stop();
    }
  };

  const handleStartEditor = () => {
    setShoudShowOnboarding(false);
  };

  const reset = () => {
    setShoudShowOnboarding(true);
    handleStopRecord();
  };
  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value === "") {
      setShoudShowOnboarding(true);
    }
    setContent(event.target.value);
  };
  const handleSaveNote = (event: FormEvent) => {
    event.preventDefault();
    if (content === "") {
      return;
    }
    setShoudShowOnboarding(true);
    onNoteCreated(content);
    setContent("");
    toast.success("Nota criada com sucesso");
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 text-left p-5 gap-3 outline-none hover:ring-2 hover:ring-slate-600 focus-visible: ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close
            className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100"
            onClick={reset}
          >
            <X className="size-5" />
          </Dialog.Close>

          <form action="" className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>

              {shoudShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{" "}
                  <button
                    type="button"
                    className="font-medium text-lime-400 hover:underline"
                    onClick={handleStartRecord}
                  >
                    gravando uma nota
                  </button>{" "}
                  em audio ou se preferir{" "}
                  <button
                    type="button"
                    className="font-medium text-lime-400 hover:underline"
                    onClick={handleStartEditor}
                  >
                    utilize apenas texto
                  </button>
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleContentChange}
                  value={content}
                />
              )}
            </div>

            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecord}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse"></div>
                Gravando...(Clique para interromper)
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveNote}
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
