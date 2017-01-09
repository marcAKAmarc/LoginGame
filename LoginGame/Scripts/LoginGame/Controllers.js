function GameController() {
    _self = this;
    this.AddLoginScreen = function (GameModel, screen) {
        if (GameModel.numberOfLoginScreens < 9) {
            GameModel.loginScreens.push(screen);
            GameModel.numberOfLoginScreens += 1;
            _self.UpdateLayout(GameModel);
            return screen;
        } else
            return null;
    }
    this.GetLoginScreen = function (GameModel, id) {
        for (var i = 0; i < GameModel.loginScreens.length; i++) {
            if (GameModel.loginScreens[i].id.toString() == id.toString())
                return GameModel.loginScreens[i];
        }
        return null;
    }

    this.UpdateLayout = function (GameModel) {
        var across = Math.min(GameModel.layout.maxScreensAccross, GameModel.numberOfLoginScreens);
        GameModel.layout.screenLayout.widthPercent = 100 / across;
        var rows = Math.ceil(GameModel.numberOfLoginScreens / GameModel.layout.maxScreensAccross);
        if (rows > GameModel.layout.maxRowsBeforeScroll)
            rows = GameModel.layout.maxRowsBeforeScroll;
        GameModel.layout.screenLayout.heightPercent = 100 / rows;
    }


}

function PolicyController() {
    var _self = this;
    this.Validate = function (policy, username, password) {
        var errors = [];
        var usernameErrors = ValidateUsername(policy, username);
        var passwordErrors = ValidatePassword(policy, password);
        errors.push.apply(errors, usernameErrors);
        errors.push.apply(errors, passwordErrors);
        return errors;
    }
    this.ValidatePasswordOnly = function(policy, password){
        var errors = [];
        var passwordErrors = ValidatePassword(policy, password);
        errors.push.apply(errors, passwordErrors);
    }
    var ValidateUsername = function (policy, username) {
        var errors = [];
        if (policy.usernameType == "email") {
            if (!StringHelper.validateEmail(username))
                errors.push('Email address is invalid.');
        }
        if (policy.usernameType == "username") {
            if (policy.minimumUsernameLength > username.length)
                errors.push('Username must have at least ' + policy.minimumUsernameLength.toString() + ' characters.');
        }
        return errors;
    }
    var ValidatePassword = function (policy, password) {
        var errors = [];
        var requirementStrings = [];

        //historical check
        var copyOfPastPassword = false;
        for (var i = 0; i < policy.passwordRules.passwordPreviousChecks; i++) {

            var index = policy.historicalCredentials.length - (1 + i);
            if (index < 0)
                break;

            if (policy.historicalCredentials[i].password = password){
                copyOfPastPassword = true;
            }
        }
        if (copyOfPastPassword)
            errors.push("Password can not be a copy of any of the past " + policy.passwordRules.passwordPreviousChecks + " passwords used.");

        if (policy.passwordRules.passwordMinimumLength > 1)
            requirementStrings.push(policy.passwordRules.passwordMinimumLength + ' character(s)');
        if (policy.passwordRules.passwordLowerCasesRequired > 0)
            requirementStrings.push(policy.passwordRules.passwordLowerCasesRequired + ' lower case character(s)');
        if (policy.passwordRules.passwordUpperCasesRequired > 0)
            requirementStrings.push(policy.passwordRules.passwordUpperCasesRequired + ' upper case character(s)');
        if (policy.passwordRules.passwordSymbolsRequired > 0)
            requirementStrings.push(policy.passwordRules.passwordSymbolsRequired + ' upper case character(s)');
        if (policy.passwordRules.passwordNumbersRequired > 0)
            requirementStrings.push(policy.passwordRules.passwordNumbersRequired + ' numeric character(s)')


        if (requirementStrings.length > 1)
            requirementStrings[requirementStrings.length - 1] = "and " + requirementStrings[requirementStrings.length - 1] + ".";
        else
            requirementStrings[requirementStrings.length - 1] = requirementStrings[requirementStrings.length - 1] + "."

        if ((policy.passwordRules.passwordMinimumLength > password.length)
            || policy.passwordRules.passwordLowerCasesRequired > StringHelper.countLowerCase(password)
            || policy.passwordRules.passwordNumbersRequired > StringHelper.countNumbers(password)
            || policy.passwordRules.passwordSymbolsRequired > StringHelper.countSymbols(password)
            || policy.passwordRules.passwordUpperCasesRequired > StringHelper.countUpperCase(password))
            errors.push("Password must contain at least " + requirementStrings.join(", "));

        return errors;
    }
}

function ScreenController() {
    var _self = this;
    this.SubmitRegisterViewModel = function (screen, vm) {
        screen.credentials.userName = vm.username;
        screen.credentials.passWord = vm.password;
        screen.state = "Login";
    }

    this.GoToResetScreen = function (gameModel, screen, callback) {
        screen.state = "Reset";
        if (callback)
            callback(gameModel);
    }

    this.SubmitLoginViewModel = function (screen, vm) {
        screen.state = "Success";
        //this.LoginDelayStart(screen, null, null);
    }
    this.ValidateSignIn = function (screen, username, password) {

        errors = [];

        var invalidLogin = false;
        var invalidUsername = false;
        var showInvalidUsername = false
        var increaseLoginAttempts = false;

        if (username != screen.credentials.userName)
            invalidUsername = true;

        if (username != screen.credentials.userName || password != screen.credentials.passWord) 
            invalidLogin = true;

        if (username != screen.credentials.userName && screen.policy.loginRules.exposeUsernameIncorrect)
            showInvalidUsername = true;

        if (invalidLogin && (   (invalidUsername && screen.policy.loginRules.lockIpAddress) || (!invalidUsername)   ) )
            increaseLoginAttempts = true;

        if (increaseLoginAttempts) {
            screen.policy.attemptsMade += 1;
            if (screen.policy.attemptsMade >= screen.policy.attemptsBeforeLockout) {
                screen.state = "Locked";
            }
        }

        if(invalidLogin)
            errors.push("Invalid login attempt.");
        if(showInvalidUsername)
            errors.push("Unknown username.");
        if (increaseLoginAttempts)
            errors.push("You have made " + screen.policy.attemptsMade + " out of " + screen.policy.attemptsBeforeLockout + " before lockout.");

        return errors;
    }
    this.LoginDelayStart = function (screen, callback, param) {
        setTimeout(_self.LoginDelayOver, screen.loginDelay * 1000, { screen: screen, callback: callback, param: param });
    }
    this.LoginDelayOver = function (item) {
        if (item.screen.state == "Reset")
            return;

        item.screen.state = "Login";
        if (item.callback)
            item.callback(item.param);
        //presentationModel.UpdateDisplay(gameModel);
    }

    this.ValidateReset = function (screen, oldpassword, newpassword, confirmpassword) {

        errors = [];

        //DO THIS SHIT

        var invalidRegister = false;
        var invalidOldPassword = false;
        var invalidConfirmPassword = false;
        var invalidNewPassword = false;

        if (oldpassword != screen.credentials.passWord)
            invalidOldPassword = true;

        if (newpassword != confirmpassword)
            invalidConfirmPassword = true;

        if (newpassword == screen.credentials.passWord)
            invalidNewPassword = true;

        if (invalidOldPassword || invalidConfirmPassword)
            invalidRegister = true;

        if (invalidOldPassword)
            errors.push("Invalid old password.");
        if (invalidConfirmPassword)
            errors.push("New passwords must match.");
        if (invalidNewPassword)
            errors.push("New password must differ from old password.");
        return errors;
    }
    this.SubmitResetViewModel=function(screen, vm){

        var oldCreds = new Credentials();
        oldCreds.userName = screen.credentials.userName;
        oldCreds.passWord = screen.credentials.passWord;
        screen.policy.historicalCredentials.push(oldCreds);

        screen.credentials.passWord = vm.newpassword;

        screen.state = "Login";
    }
}

function TimeController() {
    var rollingId = 0;
    var _self = this;
    this.timers = [];
    this.AddRepeatingTimer = function(callback, params, time){
        timers.push({id:rollingId,repeating:true,time:time,callback:callback, params:params});
        setTimeout(_self.Alarm, time * 1000, { id: rollingId, callback: callback, params: params });
        rollingId += 1;
    }
    var Alarm = function (alarmParams) {
        var id = alarmParams.id;
        var callbackparams = alarmParams.params;
        var callback = alarmParams.callback;
        var timer = findTimerById(id);
        if (timer == null)
            return;
        else
            callback(callbackparams);

        if (timer.repeating == true) {
            setTimeout(_self.Alarm, timer.time, {id:timer.id, callback: timer.callback, params: timer.params })
        }
    }
    var findTimerById = function (id) {
        for (var i = 0; i < _self.timers.length; i++) {
            if (_self.timers[i].id == id)
                return _self.timers[i];
        }
        return null;
    }
}
