const parseArgsCLI = (data) => {
  var args = [];

  // Model
  if (data.model === "high") {
    args.push("--model", "yolo608");
  } else {
    // Medium
    args.push("--model", "yolo320");
  }

  // Car detection
  if (data.cars === true) {
    args.push("--cars");
  }

  // Detection area
  if (data.area.length !== 0) {
    args.push(
      "--area",
      data.area[0].x,
      data.area[0].y,
      data.area[0].width,
      data.area[0].height
    );

    // Render area
    if (data.frame === true) {
      args.push("--frame");
    }
  }

  // Face recognition
  if (data.recognition === true) {
    args.push("--recognition");
  }

  // Tracking
  if (data.tracking === true) {
    args.push("--tracking");

    // Tracks
    if (data.tracks === true) {
      args.push("--paths");

      // Track lenght
      args.push("--traillen", data.trackLen);
    }

    // Counters
    if (data.counters === true) {
      args.push("--counter");
    }
  }

  // Time stamp
  if (data.timestamp === true) {
    args.push("--timestamp");
  }

  return args;
};

module.exports = { parseArgsCLI };
