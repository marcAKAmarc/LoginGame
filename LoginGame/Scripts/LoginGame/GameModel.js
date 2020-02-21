function Game() {

    var _self = this;
    this.numberOfLoginScreens = 0;
    this.maxNumberOfLoginScreens = 3;
    this.layout = new Layout();
    this.loginScreens = [];
    this.loginScreenQueue = [];
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
    this.passwordMinimumLength = 8;
    this.passwordLowerCasesRequired = 1;
    this.passwordUpperCasesRequired = 0;
    this.passwordSymbolsRequired = 0;
    this.passwordNumbersRequired = 0;
    this.passwordPreviousChecks = 7;

    this.randomize = function () {
        this.passwordMinimumLength = Math.ceil(5+Math.random()*8); //at least one, at max 15

        var multiples = false;
        if (Math.random() > .95)
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
        this.resetAfterSeconds = (Math.random() * 180) + 30;
        this.passwordRules.randomize();
    }
}
var Screen = function (id, brand, image) {
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
    this.brand = 'Bankify',
    this.image = '/Content/bankify_logo.png'
}

var BrandScreens = function () {
    var current = 0;
    this.Library = [
        new Screen(1,'Bankify', '/Content/bankify_logo.png', new Screen() ),
new Screen(2, 'Churchr', '/Content/churchr_logo.png', new Screen() ),
    new Screen(3, 'Copsy', '/Content/copsy_logo_alternative.png', new Screen() ),
    new Screen(4, 'Fmail', '/Content/fmail_logo.png', new Screen() ),
new Screen(5, 'Government', '/Content/government_logo.png', new Screen()),
    new Screen(6, 'Nutrily', '/Content/nutrily-logo.png', new Screen()),
    new Screen(7, 'Repairdog', '/Content/repairdog_logo.png', new Screen())
    ]
    this.Bankify = this.Library[0];
    this.Churchr = this.Library[1];
    this.Copsy = this.Library[2];
    this.Fmail = this.Library[3];
    this.Government = this.Library[4];
    this.Nutrily = this.Library[5];
    this.Repairdog = this.Library[6];

    this.GetNext = function () {
        var screen = this.Library[current];
        current += 1;
        return screen;
    }
}
var BrandScreen = function (_brand, _brandImage, _screen) {

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