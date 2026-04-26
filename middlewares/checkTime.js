function checkTime(req, res, next) {
    // prendiamo data e ora specifica di user
    const currenTime = new Date();
    const time = currenTime.toLocaleString();

    console.log("Sei passato dal middleware di checkTime a:", time);

    // procediamo con risoluzione della richiesta
    next();
}
module.exports = checkTime;