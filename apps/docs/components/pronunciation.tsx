"use client";

import { useEffect, useRef, useState } from "react";

import { site } from "@/lib/site";

import { HIT_AREA, PRESS } from "./press";

/**
 * The name, said out loud. Speech synthesis rather than a recording: one
 * syllable does not earn an audio asset, a request and a licence, and asking
 * the browser means the word is spoken by a Swedish voice wherever the reader
 * has one installed.
 *
 * The button is only rendered where it would actually work, since a speaker
 * icon that does nothing is worse than no speaker icon.
 */
export function Pronunciation() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const timer = useRef(0);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    setSupported(true);
    // Voices load asynchronously in most browsers. Touching the list now
    // means one is usually available by the time anybody clicks.
    window.speechSynthesis.getVoices();
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    },
    [],
  );

  if (!supported) return null;

  const speak = () => {
    const synth = window.speechSynthesis;
    // A second click during playback restarts rather than queues.
    synth.cancel();
    window.clearTimeout(timer.current);

    const utterance = new SpeechSynthesisUtterance(site.name.toLowerCase());
    utterance.lang = "sv-SE";
    const swedish = synth
      .getVoices()
      .find((voice) =>
        voice.lang.replace("_", "-").toLowerCase().startsWith("sv"),
      );
    if (swedish) utterance.voice = swedish;
    // A single short word runs past before it registers at full speed.
    utterance.rate = 0.85;

    const done = () => setSpeaking(false);
    utterance.onend = done;
    utterance.onerror = done;
    setSpeaking(true);
    synth.speak(utterance);
    // Some browsers drop `onend` entirely. Without this the icon would stay
    // lit for the rest of the visit.
    timer.current = window.setTimeout(done, 3000);
  };

  return (
    <button
      type="button"
      onClick={speak}
      aria-label={`Hear how ${site.name} is pronounced`}
      // The native tooltip as well as the label: hovering a lone icon should
      // answer what it does without a click.
      title={`Hear how ${site.name} is pronounced`}
      className={`grid size-6 shrink-0 place-items-center rounded ${HIT_AREA} ${PRESS} ${
        speaking ? "text-foreground" : "text-muted hover:text-foreground"
      }`}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        // 1.5 against body text at weight 400. A hairline icon beside text
        // reads as a smudge rather than a control.
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M8.5 3 5 5.75H2.75v4.5H5L8.5 13V3Z" />
        <path d="M11 6.25a2.5 2.5 0 0 1 0 3.5" />
        <path d="M12.9 4.4a5 5 0 0 1 0 7.2" opacity={speaking ? 1 : 0.55} />
      </svg>
    </button>
  );
}
