function getRandomString(length = 5) {
    let text = "";
    let randomName =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++)
        text += randomName.charAt(
            Math.floor(Math.random() * randomName.length)
        );
    return text;
}

module.exports = { getRandomString };
