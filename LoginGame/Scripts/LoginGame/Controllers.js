﻿function GameController(
    _gameModel,
    _screenController,
    _policyController,
    _presenetationModel
) {
    _self = this;
    this.gameModel = _gameModel;
    this.screenController = _screenController;
    this.policyController = _policyController;
    this.presentationModel = _presenetationModel;

    this.brandScreens = new BrandScreens();

    this.timeLastScreenAdded = new Date('1979-01-01');
    this.timeLastScreenUpdate = new Date('1979-01-01');
    this.stepTimer = null;

    this.AddLoginScreen = function (GameModel, screen) {
        if (GameModel.numberOfLoginScreens < GameModel.maxNumberOfLoginScreens) {
            GameModel.loginScreens.push(screen);
            GameModel.numberOfLoginScreens += 1;
            _self.UpdateLayout(GameModel);
            return screen;
        } else
            return null;
    }
    this.RemoveLoginScreen = function (GameModel, screen) {
        for (var i = 0; i < GameModel.loginScreens.length; i++) {
            if (GameModel.loginScreens[i].id == screen.id) {
                GameModel.loginScreens.splice(i, 1);
                break;
            }
        }
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

    this.UpdateRemainingLoginTime = function (screen, gameModel) {
        loginScreen = this.GetLoginScreen(gameModel, screen.id);
        if(loginScreen.state != 'Locked' && loginScreen.state != 'Success')
            loginScreen.currentTimeLimit += 1;
        if (loginScreen.currentTimeLimit > loginScreen.timeLimit) {
            loginScreen.timeLimit = loginScreen.currentTimeLimit;
            gameModel.gameOver = true;
        }
        return loginScreen.currentTimeLimit;
    }

    this.Step = function () {
        _self.HandleScreenAdd();
        _self.HandleUpdateScreens();
    }
    this.HandleUpdateScreens = function () {
        if (this.timeLastScreenUpdate.getAddSeconds(1) < new Date()) {
            for (var i = 0; i < this.gameModel.loginScreens.length; i++) {
                var screen = this.gameModel.loginScreens[i];
                this.UpdateRemainingLoginTime(screen, gameModel);
                presentationModel.handleGameOver(screen, gameModel.gameOver);
                presentationModel.updateRemainingLoginTimer(screen);
            }
            this.timeLastScreenUpdate = new Date();
        }
    }
    this.HandleScreenAdd = function () {
        //if it is time to add a new screen
        if (this.timeLastScreenAdded.getAddSeconds(gameModel.AddScreenDelay) < new Date()) {
            debugger;
            var screen = gameController.AddLoginScreen(gameModel, this.brandScreens.GetNext());
            if (screen) {
                presentationModel.UpdateDisplay(gameModel);
            }
            this.timeLastScreenAdded = new Date();
        }
    }

    this.StartGame = function () {
        this.stepTimer = setInterval(this.Step, 16);
    }

    this.Submit = function (e) {
        var button = e;
        var ScreenContainer = presentationModel.getScreenContainerFromElement(button);

        handleRegistrationPanelSubmit(button, ScreenContainer);
        handleLoginPanelSubmit(button, ScreenContainer);
        handleResetPanelSubmit(button, ScreenContainer);
    }

    var handleRegistrationPanelSubmit = function (button, screenContainer) {
        if (presentationModel.getElementInRegistrationPanel(button)) {
            var registrationpanel = presentationModel.getRegistrationPanelFromScreenContainer(screenContainer);
            var matchingScreen = this.GetLoginScreen(gameModel, presentationModel.getScreenContainerScreenId(screenContainer));

            presentationModel.SubmitRegisterPanel(screenContainer, matchingScreen, registerpanel);
            presentationModel.UpdateDisplay(gameModel);
        }
    };

    var handleLoginPanelSubmit = function (button, screenContainer) {
        if (presentationModel.getElementInLoginPanel(button)) {
            var loginpanel = presentationModel.getLoginPanelFromScreenContainer(screenContainer);
            var matchingScreen = this.GetLoginScreen(gameModel, presentationModel.getScreenContainerScreenId(screenContainer));

            presentationModel.SubmitLoginPanel(screenContainer, matchingScreen, loginpanel, gameModel);
            if (matchingScreen.state == 'Locked') {
                gameModel.gameOver = true;
                presentationModel.handleGameOver(matchingScreen, gameModel);
            }
            if (matchingScreen.state == 'Success') {
                gameModel.successfulLogins += 1;
                matchingScreen.currentTimeLimit = 0;

                //spawn another login in two seconds
                if (gameModel.loginScreens.length < gameModel.maxNumberOfLoginScreens) {
                    clearInterval(newWindowInterval);
                    setTimeout(ev_X_Press, 1000);
                    newWindowInterval = setInterval(ev_X_Press, (gameModel.AddScreenDelay * 1000) + 1000);
                }
            }
            presentationModel.UpdateDisplay(gameModel);
        }
    };

    var handleResetPanelSubmit = function (button, screenContainer) {
        if (presentationModel.getElementInResetPanel(button)) {
            var resetpanel = presentationModel.GetResetPanelFromScreenContainer(screenContainer);
            var matchingScreen = gameController.GetLoginScreen(gameModel, $(screenContainer).attr('id'));

            presentationModel.SubmitResetPanel(screenContainer, matchingScreen, resetpanel);
            presentationModel.UpdateDisplay(gameModel);
        }
    };

    $(document).bind('keydown', function (e) {
        if (e.keyCode == 13) {
            this.Submit(document.activeElement);
        }
    }.bind(this));
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
            requirementStrings.push(policy.passwordRules.passwordSymbolsRequired + ' symbol(s)');
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
        this.gotoState(screen,"Login");
    }

    this.GoToResetScreen = function (gameModel, screen, callback) {
        screen.policy.resetTimeout = true;
        //this.gotoState(screen, "Reset");
        //screen.state = "Reset";
        //if (callback)
        //    callback(gameModel);
    }

    this.SubmitLoginViewModel = function (screen, vm) {
        screen.hasLoggedInSinceReset = true;
        this.gotoState(screen, "Success");
        if (screen.state == "Success")
            screen.successfulLogins += 1;
        screen.policy.hasLogginInSinceReset = true;
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
                this.gotoState(screen, "Locked");
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
        setTimeout(_self.LoginDelayOver.bind(_self,{ screen: screen, callback: callback, param: param }), screen.loginDelay * 1000 );
    }
    this.LoginDelayOver = function (item) {
        if (item.screen.state == "Reset")
            return;

        
        this.gotoState(item.screen, "Login");

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

        screen.policy.resetTimeout = false;
        screen.policy.resetTimer = null;
        screen.policy.hasLoggedInSinceReset = false;
        this.gotoState (screen, "Login");
        //screen.state = "Login";
    }

    this.gotoState = function(screen, state){
        if (screen.policy.resetTimeout && screen.hasLoggedInSinceReset){
            screen.state = "Reset";
        }else{
            screen.state = state;
        }
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
