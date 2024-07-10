import React, { useEffect, useState } from "react";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

const useTranslate = (sourceText, selectedLanguage) => {
  const [targetText, setTargetText] = useState("");

  useEffect(() => {
    const handleTranslate = async (text) => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `
                You will be provided with a sentence. This sentence: ${text}.
                Your tasks are to:
                - detect what language the sentence is in
                - translate the sentence to ${selectedLanguage}
                do not return anything other than the translated sentence
              `,
            },
          ],
        });

        const data = response.choices[0]?.message?.content || "";
        setTargetText(data);
      } catch (error) {
        console.error("Error translating text:", error);
        setTargetText("Error translating text.");
      }
    };

    if (sourceText.trim()) {
      const timeoutId = setTimeout(() => {
        handleTranslate(sourceText);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [sourceText, selectedLanguage]);

  return targetText;
};

export default useTranslate;
