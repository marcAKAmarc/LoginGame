function Game() {

    var _self = this;
    this.numberOfLoginScreens = 0;
    this.layout = new Layout();
    this.loginScreens = [];
    this.gameOver = false;
    this.successfulLogins = 0;
    this.AddScreenDelay = 25;
    //this.AddLoginScreen = function (screen) {
    //    this.loginScreens.push(screen);
    //    this.numberOfLoginScreens += 1;
    //    this.UpdateLayout();
    //    return screen;
    //}
    //this.GetLoginScreen = function (id) {
    //    for (var i = 0; i < this.loginScreens.length; i++) {
    //        if (this.loginScreens[i].id.toString() == id.toString())
    //            return this.loginScreens[i];
    //    }
    //    return null;
    //}

    //this.UpdateLayout = function () {
    //    var across = Math.min(this.layout.maxScreensAccross, this.numberOfLoginScreens);
    //    this.layout.screenLayout.widthPercent = 100 / across;
    //    var rows = Math.ceil(this.numberOfLoginScreens / this.layout.maxScreensAccross);
    //    if (rows > this.layout.maxRowsBeforeScroll)
    //        rows = this.layout.maxRowsBeforeScroll;
    //    this.layout.screenLayout.heightPercent = 100 / rows;
    //}
    //this.timing = timing || new Timing();
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
    this.passwordPreviousChecks = 5;

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
    this.passwordRules = new PasswordRules();
    this.loginRules = new LoginRules();
    this.attemptsBeforeLockout = 5;
    this.usernameType = "username";
    this.minimumUsernameLength = 8; //only considered if not of email type
    this.attemptsMade = 0;
    this.historicalCredentials = [];

    this.randomize = function () {
        this.resetAfterSeconds = (Math.random() * 60) + 120;
        this.passwordRules = new PasswordRules();
        this.passwordRules.randomize();
        this.loginRules = new LoginRules();
        this.attemptsBeforeLockout = Math.ceil(Math.random() * 5) + 2;
        this.usernameType = Math.random() < .95 ? "username" : "email";
        this.minimumUsernameLength = Math.ceil(Math.random() * 8); //only considered if not of email type
    }
    //this.Validate = function (username, password) {
    //    var errors = [];
    //    var usernameErrors = this.ValidateUsername(username);
    //    var passwordErrors = this.ValidatePassword(password);
    //    errors.push.apply(errors, usernameErrors);
    //    errors.push.apply(errors, passwordErrors);
    //    return errors;
    //}
    //this.ValidateUsername = function (username) {
    //    var errors = [];
    //    if (this.usernameType == "email") {
    //        if (!StringHelper.validateEmail(username))
    //            errors.push('Email address is invalid.');
    //    }
    //    if (this.usernameType == "username") {
    //        if (this.minimumUsernameLength > username.length)
    //            errors.push('Username must have at least ' + this.minimumUsernameLength.toString() + ' characters.');
    //    }
    //    return errors;
    //}
    //this.ValidatePassword = function (password) {
    //    var errors = [];
    //    var requirementStrings = [];
    //    if (this.passwordRules.passwordMinimumLength > 1)
    //        requirementStrings.push(this.passwordRules.passwordMinimumLength + ' character(s)');
    //    if (this.passwordRules.passwordLowerCasesRequired > 0)
    //        requirementStrings.push(this.passwordRules.passwordLowerCasesRequired + ' lower case character(s)');
    //    if (this.passwordRules.passwordUpperCasesRequired > 0)
    //        requirementStrings.push(this.passwordRules.passwordUpperCasesRequired + ' upper case character(s)');
    //    if (this.passwordRules.passwordSymbolsRequired > 0)
    //        requirementStrings.push(this.passwordRules.passwordSymbolsRequired + ' upper case character(s)');
    //    if (this.passwordRules.passwordNumbersRequired > 0)
    //        requirementStrings.push(this.passwordRules.passwordNumbersRequired + ' numeric character(s)')


    //    if (requirementStrings.length > 1)
    //        requirementStrings[requirementStrings.length - 1] = "and " + requirementStrings[requirementStrings.length - 1] + ".";
    //    else
    //        requirementStrings[requirementStrings.length - 1] = requirementStrings[requirementStrings.length - 1] + "."

    //    if ((this.passwordRules.passwordMinimumLength > password.length)
    //        || this.passwordRules.passwordLowerCasesRequired > StringHelper.countLowerCase(password)
    //        || this.passwordRules.passwordNumbersRequired > StringHelper.countNumbers(password)
    //        || this.passwordRules.passwordSymbolsRequired > StringHelper.countSymbols(password)
    //        || this.passwordRules.passwordUpperCasesRequired > StringHelper.countUpperCase(password))
    //        errors.push("Password must contain at least " + requirementStrings.join(", "));

    //    return errors;
    //}
}
var Screen = function (id) {
    this.id = id;
    this.initialized = false;
    this.state = "Register";
    this.policy = new Policy();
    this.policy.randomize();
    this.credentials = new Credentials();
    this.loginDelay = 5;
    this.timeLimit = 120;
    this.currentTimeLimit = 0;
    //this.SubmitRegisterViewModel = function (vm) {
    //    this.credentials.userName = vm.username;
    //    this.credentials.passWord = vm.password;
    //    this.state = "Login";
    //}
    //this.SubmitLoginViewModel = function (vm) {
    //    this.state = "Success";
    //}
    //this.ValidateSignIn = function (username, password) {
    //    errors = [];
    //    if (username == this.credentials.userName && password == this.credentials.passWord)
    //        errors.push("Invalid login attempt.");
    //    return errors;
    //}
    //this.LoginDelayStart = function (callback, param) {
    //    setTimeout(this.LoginDelayOver, this.loginDelay * 1000, { self: this, callback: callback, param: param });
    //}
    //this.LoginDelayOver = function (item) {
    //    item.self.state = "Login";
    //    if(item.callback)
    //        item.callback(item.param);
    //    //presentationModel.UpdateDisplay(gameModel);
    //}
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