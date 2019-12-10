function Game() {

    var _self = this;
    this.numberOfLoginScreens = 0;
    this.maxNumberOfLoginScreens = 3;
    this.layout = new Layout();
    this.loginScreens = [];
    this.results = {};
    this.gameOver = false;
    this.successfulLogins = 0;
    this.AddScreenDelay = 30;
}

//Screen
// Policy
//  PasswordRules
// Credentials
function Credentials() {
    this.userName = "";
    this.passWord = "";
}
function PasswordRules() {
    this.passwordMinimumLength = 5;
    this.passwordLowerCasesRequired = 1;
    this.passwordUpperCasesRequired = 0;
    this.passwordSymbolsRequired = 0;
    this.passwordNumbersRequired = 0;
    this.passwordPreviousChecks = 7;

    this.randomize = function () {
        this.passwordMinimumLength = Math.ceil(Math.random()*8); //at least one, at max 15

        var multiples = false;
        if (Math.random() > .97)
            multiples = true;
        
        if (multiples) {
            this.passwordLowerCasesRequired = Math.ceil(Math.random() * this.passwordMinimumLength);
            this.passwordUpperCasesRequired = Math.ceil(Math.random() * (this.passwordMinimumLength - (this.passwordLowerCasesRequired)));
            this.passwordSymbolsRequired = Math.ceil(Math.random() * (this.passwordMinimumLength - (this.passwordLowerCasesRequired + this.passwordUpperCasesRequired)));
            this.passwordNumbersRequired = Math.ceil(Math.random() * (this.passwordMinimumLength - (this.passwordLowerCasesRequired + this.passwordUpperCasesRequired + this.passwordSymbolsRequired)));
        } else {
            this.passwordLowerCasesRequired = Math.random() > .5 ? 1 : 0;
            this.passwordUpperCasesRequired = Math.random() > .5 ? 1 : 0;
            this.passwordSymbolsRequired = Math.random() > .9 ? 1 : 0;
            this.passwordNumbersRequired = Math.random() > .95 ? 1 : 0;
        }

        this.passwordPreviousChecks = Math.random() > .95 ? Math.ceil(Math.random()*50) : Math.ceil(Math.random()*5);
    }
}
function LoginRules() {
    //if lockIpAddress set to true, we will lock people out even if they don't remember their username.
    this.lockIpAddress = false; // true;
    this.exposeUsernameIncorrect = true;
}
function Policy() {
    this.resetAfterSeconds = 30;
    this.resetTimeout = false;
    this.hasLoggedInSinceReset = false;
    this.resetTimer = null;
    this.passwordRules = new PasswordRules();
    this.loginRules = new LoginRules();
    this.attemptsBeforeLockout = 5;
    this.usernameType = "username";
    this.minimumUsernameLength = 8; //only considered if not of email type
    this.attemptsMade = 0;
    this.historicalCredentials = [];

    this.randomize = function () {
        this.resetAfterSeconds = (Math.random() * 180)+30;
    }
}
var Screen = function (id) {
    this.id = id;
    this.initialized = false;
    this.state = "Register";
    this.policy = new Policy();
    this.policy.randomize();
    this.credentials = new Credentials();
    this.loginDelay = 5;
    this.timeLimit = 60;
    this.currentTimeLimit = 0;
    this.successfulLogins = 0;

}

//Layout
// ScreenLayout
function ScreenLayout() {
    this.widthPercent = 100;
    this.heightPercent = 100
}
function Layout() {
    this.maxScreensAccross = 3;
    this.maxRowsBeforeScroll = 3;
    this.screenLayout = new ScreenLayout();
}