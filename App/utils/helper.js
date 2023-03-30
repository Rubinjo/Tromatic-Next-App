function fancyTimeFormat(duration) {
    const days = ~~(duration / 24);
    const hrs = ~~(duration % 24);

    let ret = "";

    if (days > 0) {
        ret += days + " days ";
    }

    ret += hrs + " hours";
    return ret;
}

function directionTitle(direction) {
    if (direction == 64) {
        return "←"
    } else if (direction == 32) {
        return "→"
    } else if (Number.isInteger(direction)) {
        return "o"
    } else {
        return "Error"
    }
}

function directionValue(direction) {
    if (direction === 64) {
        return 1
    } else if (direction === 32) {
        return 0
    } else {
        return 0.5
    }
}

function opModeTitle(opMode) {
    if (opMode === 0) {
        return "Auto"
    } else if (opMode == 1) {
        return "Manual"
    } else {
        return "Error"
    }
}

function opModeFanTitle(opMode) {
    if (opMode === 0) {
        return "Auto"
    } else if (opMode == 1) {
        return "On"
    } else if (opMode == 2) {
        return "Off"
    } else if (opMode == 3) {
        return "Manual"
    } else {
        return "Error"
    }
}

export { fancyTimeFormat, directionTitle, directionValue, opModeTitle, opModeFanTitle }
