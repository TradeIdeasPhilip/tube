/**
 * From Grok.  Doesn't do anything on my system except report a warning:
 * "Memory heaps not available (older Chrome or no support)"
 */
async function getGPUMemoryInfo() {
  if (!(navigator as any).gpu) {
    throw new Error("WebGPU not supported");
  }

  const adapter = await (navigator as any).gpu.requestAdapter({
    powerPreference: "high-performance", // Prefer discrete GPU if available
  });

  if (!adapter) {
    throw new Error("No GPU adapter found");
  }

  const info = adapter.info;

  // Non-standard extension (Chrome-specific, may change)
  const memoryHeaps = info.memoryHeaps; // Array of { size: number, type: string }

  if (!memoryHeaps || !Array.isArray(memoryHeaps)) {
    console.warn("Memory heaps not available (older Chrome or no support)");
    return null;
  }

  // Calculate totals
  const totalAvailable = memoryHeaps.reduce(
    (sum, heap) => sum + (heap.size || 0),
    0
  );
  const dedicatedVRAM =
    memoryHeaps.find((h) => h.type === "dedicated")?.size || 0;
  const sharedRAM = memoryHeaps.find((h) => h.type === "shared")?.size || 0;

  console.log("GPU Memory Info:", {
    totalAvailableBytes: totalAvailable,
    totalAvailableMB: Math.round(totalAvailable / (1024 * 1024)),
    dedicatedVRAMBytes: dedicatedVRAM,
    dedicatedVRAMMB: Math.round(dedicatedVRAM / (1024 * 1024)),
    sharedRAMBytes: sharedRAM,
    sharedRAMMB: Math.round(sharedRAM / (1024 * 1024)),
    numHeaps: memoryHeaps.length,
  });

  return {
    totalAvailableMB: Math.round(totalAvailable / (1024 * 1024)),
    dedicatedVRAMMB: Math.round(dedicatedVRAM / (1024 * 1024)),
  };
}

(window as any).getGPUMemoryInfo = getGPUMemoryInfo;

// Usage: Poll periodically or on resize/load
getGPUMemoryInfo().then((info) => {
  if (info && info.totalAvailableMB < 1024) {
    // e.g., <1GB → scale back
    console.log("Low GPU memory detected; reducing quality");
    // Your scaling logic: e.g., fewer tube sides, lower res textures
  }
});
