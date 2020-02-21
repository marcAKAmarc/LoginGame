Date.prototype.getAddSeconds = function (seconds) {
    var dateticks = this.getTime();
    dateticks += 1000 * seconds;
    return new Date(dateticks);
}