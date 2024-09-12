import React, { useState, useEffect } from "react";
import { franc } from "franc";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const TextToSpeech = ({ text, props }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [DetectedLanguage, setDetectedLanguage] = useState("");

  // Language code mapping
  const langMap = {
    eng: "en-US",
    spa: "es-ES",
    fra: "fr-FR",
    deu: "de-DE",
    ita: "it-IT",
    por: "pt-PT",
    rus: "ru-RU",
    zho: "zh-CN",
    arb: "ar-SA",
    // Add more mappings as needed
  };

  const detectLanguage = () => {
    const langCode = franc(text);
    const detectedLang = langMap[langCode] || "en-US"; // Default to English if unknown
    return detectedLang;
  };

  useEffect(() => {
    const detectedLang = detectLanguage();
    setDetectedLanguage(detectedLang);
  }, [text]);

  const speak = async () => {
    setIsSpeaking(true);
    const detectedLang = await detectLanguage();

    // Check if the language is supported for TTS
    const voices = window.speechSynthesis.getVoices();
    const supportedLang = voices.some((voice) => voice.lang === detectedLang);

    if (supportedLang) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = detectedLang;
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error(
        `Language '${detectedLang}' is not supported for text-to-speech.`
      );
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <Button
      {...props}
      className="w-full rounded-xl"
      onClick={isSpeaking ? stop : speak}
      size="sm"
    >
      {isSpeaking ? (
        <>
          <X className="h-4 w-4 mr-1" />
          Reading...
        </>
      ) : (
        `Read Story (${DetectedLanguage})`
      )}
    </Button>
  );
};

export default TextToSpeech;
