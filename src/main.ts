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
  numberOfSegments: number = 3,
  radius: number = 50 // ← now apothem!
) {
  container.innerHTML = "";

  // Side width = 2 * radius * tan(π / N)
  const sideWidth = 2 * radius * Math.tan(Math.PI / sides);
  const widthStr = `${sideWidth.toFixed(6)}vmin`;
  container.style.setProperty("--width", widthStr);
  container.style.setProperty("--number-of-sides", sides.toString());
  for (let i = 0; i < sides; i++) {
    const angleDeg = (i * 360) / sides;
    for (
      let segmentNumber = 0;
      segmentNumber < numberOfSegments;
      segmentNumber++
    ) {
      const div = document.createElement("div");
      div.className = "tube-side";
      div.style.setProperty("--rotation", `${angleDeg}deg`);
      div.style.setProperty("--n", i.toString());
      div.dataset["segment"] = segmentNumber.toString();
      if (segmentNumber == 0) {
        div.textContent = `\n${i + 1}`;
      }
      container.appendChild(div);
    }
  }

  // Simple first version.  Works well but I thought I could tweak it.
  // On battery I get 30 fps with no problem.
  // Memory is stable at 264mb.
  //  createSection(1, "301px", "0px", true); // 119.5mb (31.5 at 300px)
  //       createSection(1, "101px", "200px", true); //101 @ 0 => 44, 101@100 => 12.6  101@200 => 12.6
  //createSection(5, "1501px", "300px", false); // 119.5mb (31.5 at 600px, 427.8 at 150px, >572 at 0px) (setting quality to 1 makes the memory jump between 160 and 240, quality 10 makes memory 125.8, 20 goes to 353.1, 100 causes constant flickering.)
  //createSection(25, "6001px", "1800px", false); // 25.2mb
  // 396 for all
}

// For the console.
(window as any).createTube = (sides: number, numberOfSegments = 3) => {
  createTube(container, sides, numberOfSegments);
};

createTube(container, 32);
