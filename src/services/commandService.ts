export function processCommand(command: string): {
  action: string;
  url?: string;
  isBrowserAction: boolean;
} {
  const lowerCmd = command.toLowerCase().trim();

  // 1. Email / Mail app: "open gmail", "open mail", "send mail", "email"
  if (lowerCmd.includes("open gmail") || lowerCmd.includes("open mail") || lowerCmd.includes("send mail") || lowerCmd.includes("open email")) {
    return {
      action: `Opening your Mail app, Harshit. Go on, write those emails you've been avoiding.`,
      url: `mailto:`,
      isBrowserAction: true,
    };
  }

  // 2. Phone / Calling app: "open phone", "call [number]"
  const phoneMatch = lowerCmd.match(/(?:call|dial)\s+([\d\+\s]+)/) || lowerCmd.match(/open\s+(?:phone|dialer)/);
  if (phoneMatch) {
    const number = phoneMatch[1] ? phoneMatch[1].replace(/\s+/g, "") : "";
    return {
      action: number
        ? `Trigerring call to ${number} on your device. Hope they actually want to talk to you!`
        : `Opening your device Dialer app, Harshit. Let's see who's getting a call today.`,
      url: `tel:${number}`,
      isBrowserAction: true,
    };
  }

  // 3. Calculator: "open calculator"
  if (lowerCmd.includes("open calculator") || lowerCmd.includes("calculator")) {
    return {
      action: `Opening the Calculator. Don't tell me you need help with 7 times 8, Harshit.`,
      url: `https://www.google.com/search?q=calculator`,
      isBrowserAction: true,
    };
  }

  // 4. Calendar: "open calendar"
  if (lowerCmd.includes("open calendar") || lowerCmd === "calendar") {
    return {
      action: `Opening your Calendar. Let's see how many meetings we can pretend to be busy in, Harshit.`,
      url: `https://calendar.google.com/`,
      isBrowserAction: true,
    };
  }

  // 5. Notes / Notepad: "open notes", "open google keep"
  if (lowerCmd.includes("open notes") || lowerCmd.includes("google keep") || lowerCmd === "notes") {
    return {
      action: `Opening your Notes app. Let's write down some brilliant ideas that you'll probably forget tomorrow, Harshit.`,
      url: `https://keep.google.com/`,
      isBrowserAction: true,
    };
  }

  // 6. Google Maps / Navigation: "open maps", "navigate to [query]"
  const mapsMatch = lowerCmd.match(/navigate\s+to\s+(.+)$/) || lowerCmd.match(/open\s+(?:google\s+)?maps/);
  if (mapsMatch) {
    const query = mapsMatch[1] ? encodeURIComponent(mapsMatch[1].trim()) : "";
    return {
      action: query
        ? `Finding routes to ${mapsMatch[1]} on Maps. Try not to get lost, Harshit.`
        : `Opening Google Maps. Let's explore the world from your screen, Harshit!`,
      url: query ? `https://www.google.com/maps/search/?api=1&query=${query}` : `https://maps.google.com/`,
      isBrowserAction: true,
    };
  }

  // 7. Social Media Apps: Instagram, Twitter/X, Facebook, LinkedIn, GitHub
  if (lowerCmd.includes("open instagram") || lowerCmd.includes("instagram")) {
    return {
      action: `Opening Instagram. Ready to doom-scroll some reels, Harshit?`,
      url: `https://www.instagram.com/`,
      isBrowserAction: true,
    };
  }
  if (lowerCmd.includes("open twitter") || lowerCmd.includes("open x") || lowerCmd === "x" || lowerCmd === "twitter") {
    return {
      action: `Opening Twitter/X. Don't start any keyboard wars today, Harshit!`,
      url: `https://www.twitter.com/`,
      isBrowserAction: true,
    };
  }
  if (lowerCmd.includes("open facebook") || lowerCmd.includes("facebook")) {
    return {
      action: `Opening Facebook, Harshit. Check what your high school acquaintances are up to.`,
      url: `https://www.facebook.com/`,
      isBrowserAction: true,
    };
  }
  if (lowerCmd.includes("open linkedin") || lowerCmd.includes("linkedin")) {
    return {
      action: `Opening LinkedIn, Harshit. Prepare to be inspired by corporate gurus!`,
      url: `https://www.linkedin.com/`,
      isBrowserAction: true,
    };
  }
  if (lowerCmd.includes("open github") || lowerCmd.includes("github")) {
    return {
      action: `Opening GitHub. Let's see if those green commits are looking good, Harshit.`,
      url: `https://github.com/`,
      isBrowserAction: true,
    };
  }

  // 8. WhatsApp Web/App: "open whatsapp"
  if (lowerCmd === "open whatsapp" || lowerCmd === "whatsapp") {
    return {
      action: `Opening WhatsApp, Harshit. Let's check those unread chats.`,
      url: `https://web.whatsapp.com/`,
      isBrowserAction: true,
    };
  }

  // WhatsApp Web Message: "Send a WhatsApp message to [number] saying [message]"
  const waMatch = lowerCmd.match(
    /^send\s+a\s+whatsapp\s+message\s+to\s+([\d\+\s]+)\s+saying\s+(.+)$/,
  );
  if (waMatch) {
    const number = waMatch[1].replace(/\s+/g, "");
    const message = encodeURIComponent(waMatch[2].trim());
    return {
      action: `Sending your message. Let's hope they reply, Harshit.`,
      url: `https://web.whatsapp.com/send?phone=${number}&text=${message}`,
      isBrowserAction: true,
    };
  }

  // 9. Media Search/Open: YouTube
  if (lowerCmd === "open youtube" || lowerCmd === "youtube") {
    return {
      action: `Opening YouTube. Don't get lost in those recommendation rabbits holes, Harshit!`,
      url: `https://www.youtube.com/`,
      isBrowserAction: true,
    };
  }

  const ytMatch = lowerCmd.match(/^play\s+(.+?)\s+on\s+youtube$/);
  if (ytMatch) {
    const query = encodeURIComponent(ytMatch[1].trim());
    return {
      action: `Playing ${ytMatch[1]} on YouTube. Don't judge my music taste.`,
      url: `https://www.youtube.com/results?search_query=${query}`,
      isBrowserAction: true,
    };
  }

  // 10. Media Search/Open: Spotify
  if (lowerCmd === "open spotify" || lowerCmd === "spotify") {
    return {
      action: `Opening Spotify, Harshit. Put on those headphones.`,
      url: `https://open.spotify.com/`,
      isBrowserAction: true,
    };
  }

  const spotifyMatch = lowerCmd.match(/^search\s+(.+?)\s+on\s+spotify$/);
  if (spotifyMatch) {
    const query = encodeURIComponent(spotifyMatch[1].trim());
    return {
      action: `Searching ${spotifyMatch[1]} on Spotify. Hope it's a banger.`,
      url: `https://open.spotify.com/search/${query}`,
      isBrowserAction: true,
    };
  }

  // 11. General Browsing: "Open [website name]"
  const openMatch = lowerCmd.match(/^open\s+(.+)$/);
  if (openMatch) {
    let website = openMatch[1].trim().replace(/\s+/g, "");
    if (!website.includes(".")) {
      website += ".com";
    }
    return {
      action: `Opening ${openMatch[1]} for you, ugh.`,
      url: `https://www.${website}`,
      isBrowserAction: true,
    };
  }

  return { action: "", isBrowserAction: false };
}

