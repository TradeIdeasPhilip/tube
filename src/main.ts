import "./style.css";
import { getById } from "phil-lib/client-misc";

const container = getById("container1", HTMLDivElement);

/**
 * Compute the width of one side of an N-sided tube (cylinder approximation).
 * @param sides Number of sides (N ≥ 3)
 * @param radius Radius of the cylinder (e.g., 50vmin)
 * @returns Width in same units as radius (e.g., "XXvmin")
 */
export function computeTubeSideWidth(
  sides: number,
  radius: number = 50
): string {
  if (sides < 3) throw new Error("sides must be ≥ 3");

  const chordLength = 2 * radius * Math.sin(Math.PI / sides);
  return `${chordLength.toFixed(6)}vmin`; // Use vmin to match your units
}

/**
 * Create a tube with N sides.
 * @param container The parent element.
 * @param sides Number of sides (N ≥ 3).
 * @param radius Distance from tube center to the *midpoint* of a side (apothem).
 */
function createTube(
  container: HTMLElement,
  sides: number = 12,
  radius: number = 50 // ← now apothem!
) {
  container.innerHTML = "";

  // Side width = 2 * radius * tan(π / N)
  const sideWidth = 2 * radius * Math.tan(Math.PI / sides);
  const widthStr = `${sideWidth.toFixed(6)}vmin`;
  container.style.setProperty("--width", widthStr);
  container.style.setProperty("--number-of-sides", sides.toString());
  function createSection(
    scale: number,
    height: string,
    offset: string,
    showNumber: boolean
  ) {
    for (let i = 0; i < sides; i++) {
      const angleDeg = (i * 360) / sides;
      const div = document.createElement("div");
      div.className = "tube-side";
      div.style.setProperty("--rotation", `${angleDeg}deg`);
      div.style.setProperty("--n", i.toString());
      div.style.setProperty("--y-scale", scale.toString());
      div.style.setProperty("--height", height);
      div.style.setProperty("--z-offset", offset);
      if (showNumber) {
        div.textContent = `\n${i + 1}`;
      }
      container.appendChild(div);
    }
  }
  const version: string = "working";
  switch (version) {
    case "working": {
      // Simple first version.  Works well but I thought I could tweak it.
      // On battery I get 30 fps with no problem.
      // Memory is stable at 264mb.
      createSection(1, "301px", "0px", true);
      createSection(5, "1501px", "300px", false);
      createSection(25, "6001px", "1800px", false);
      break;
    }
    case "bad short": {
      // Just like "working" but I made the first section shorter.
      // I moved the other sections closer, be kept their lengths and qualities the same.
      // I was expecting this to use slightly fewer resources.
      // I was going to check if the quality was still acceptable.
      // But it made the memory jump way up and jump around.
      // Now I'm seeing values around 365 - 385mb, with a little less jumping around.
      // I don't see any glitches as long as I keep my computer unplugged.
      // However, I moved the memory debugger from green to yellow and almost to red.
      // This move was an attempt to use less memory but it consistently uses more!
      createSection(1, "201px", "0px", true);
      createSection(5, "1501px", "200px", false);
      createSection(25, "6001px", "1700px", false);
      break;
    }
    case "skip a section": {
      // I made the first section shorter, like in "bad short".
      // But I left the other sections exactly as in "working".
      // "bad short" had surprising results, so I scaled back to see where I broke things.
      // This is not a good version because the sections do *not* connect.
      // Things seem to be working with 30fps and memory stable at 220 - 240 MB used, out of 572.5.
      // (Memory changes a little when I go to other apps, but not at all when the browser is full screen.)
      createSection(1, "201px", "0px", true);
      createSection(5, "1501px", "300px", false);
      createSection(25, "6001px", "1800px", false);
      break;
    }
    case "a different hole":{
      // This uses 394mb - 571 of memory!
      // This is the same as "working" except I slid the second section closer to the user.
      // This exposes empty space between the second and third sections.
      // I was expecting this to have about the same performance as with "working" but this seems to be the worst test case so far.
      // It sometimes glitches even on battery.
      createSection(1, "301px", "0px", true);
      createSection(5, "1501px", "200px", false);
      createSection(25, "6001px", "1800px", false);
      break;
    }
    default: {
      throw new Error("wtf");
    }
  }
}

// For the console.
(window as any).createTube = (sides: number) => {
  createTube(container, sides);
};

createTube(container, 32);
