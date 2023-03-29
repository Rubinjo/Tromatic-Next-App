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
    if (direction == 96) {
        return "Unknown"
    } else if (direction == 64) {
        return "←"
    } else if (direction == 32) {
        return "→"
    } else {
        return "Error"
    }
}

function directionValue(direction) {
    if (direction == 64) {
        return 1
    } else if (direction == 32) {
        return 0
    } else {
        return 0.5
    }
}

export { fancyTimeFormat, directionTitle, directionValue }
