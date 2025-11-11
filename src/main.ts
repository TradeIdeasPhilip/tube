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
  for (let i = 0; i < sides; i++) {
    const angleDeg = (i * 360) / sides;
    const div = document.createElement("div");
    div.className = "tube-side";
    div.style.setProperty("--rotation", `${angleDeg}deg`);
    div.style.setProperty("--n", i.toString());
    div.textContent = `\n${i + 1}`;
    container.appendChild(div);
  }
}

// For the console.
(window as any).createTube = (sides: number) => {
  createTube(container, sides);
};

createTube(container, 15);
