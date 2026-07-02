let ttsVoice: SpeechSynthesisVoice | null = null;

export function loadVoice() {
  if (!("speechSynthesis" in window)) return;
  const pick = () => {
    const voices = window.speechSynthesis.getVoices();
    ttsVoice =
      voices.find((v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Daniel") || v.name.includes("Arthur") ||
         v.name.includes("Google UK") || v.name.includes("Alex") ||
         v.name.includes("Fred"))
      ) ?? voices.find((v) => v.lang.startsWith("en")) ?? null;
  };
  pick();
  window.speechSynthesis.addEventListener("voiceschanged", pick);
}

export function speakLine(text: string) {
  if (!("speechSynthesis" in window)) return;
  const spoken = text.replace(/\(.*?\)/g, "").trim();
  if (!spoken) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(spoken);
  if (ttsVoice) u.voice = ttsVoice;
  u.rate = 0.88;
  u.pitch = 0.9;
  u.volume = 1;
  window.speechSynthesis.speak(u);
}

export function stopTTS() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}
