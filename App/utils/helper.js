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

export default fancyTimeFormat