function Presentation(_gameController, _screenController, _policyController) {
    var _self = this;
    //var gameController = _gameController;
    var screenController = _screenController;
    var policyController = _policyController;

    var ScreenContainers = [];
    this.GetScreenHeightStringFromPercent = function (percent) {
        return $(window).height() * (percent / 100);
    }
    this.UpdateDisplay = function (gameModel) {

        var updateableitems = _self.getUpdatableItems(gameModel);

        _self.AddScreens(updateableitems.unmatchedGameModelScreens);

        _self.AnimateSizeUpdate(gameModel);

        updateableitems = _self.getUpdatableItems(gameModel);

        _self.AnimatePanelUpdate(gameModel, updateableitems.matchedGameModelScreens, updateableitems.matchedScreenContainers)

        //todo
        //get unmatched screen containers (remove)
    }
    this.getUpdatableItems = function (gameModel) {
        var matchedScreenContainers = [];
        var matchedGameModelScreens = [];
        var unmatchedGameModelScreens = [];
        for (var i = 0; i < gameModel.loginScreens.length; i++) {
            var matched = false;
            for (var j = 0; j < ScreenContainers.length; j++) {
                if (ScreenContainers[j][0].id == gameModel.loginScreens[i].id.toString()) {
                    matchedScreenContainers.push(ScreenContainers[j]);
                    matchedGameModelScreens.push(gameModel.loginScreens[i]);
                    matched = true;
                    break;
                }
            }
            if (matched != true)
                unmatchedGameModelScreens.push(gameModel.loginScreens[i]);
        }
        return {
            matchedScreenContainers: matchedScreenContainers,
            matchedGameModelScreens: matchedGameModelScreens,
            unmatchedGameModelScreens: unmatchedGameModelScreens
        }
    }

    this.AddScreens = function (unmatchedGameModelScreens) {
        for (var i = 0; i < unmatchedGameModelScreens.length; i++) {
            var copyDiv = $('#hiddenLayout>:first-child').clone();
            copyDiv.attr('id', unmatchedGameModelScreens[i].id);
            $('#screensContainer').append(copyDiv);
            ScreenContainers.push($('#' + unmatchedGameModelScreens[i].id.toString()));
        }
    }

    this.AnimateSizeUpdate = function (gameModel) {
        $('.screenContainer').not("#hiddenLayout>.screenContainer").animate({
            width: gameModel.layout.screenLayout.widthPercent.toString() + '%',
            height: this.GetScreenHeightStringFromPercent(gameModel.layout.screenLayout.heightPercent).toString() + 'px'
        }, 500, function () {
        });
    }

    this.AnimatePanelUpdate = function (gameModel, matchedGameModelScreens, matchedScreenContainers) {
        for (var i = 0; i < matchedGameModelScreens.length; i++) {
            //find visible item in controlsContainers in matchedScreenContainers
            var screenstate = matchedGameModelScreens[i].state;
            var visible = matchedScreenContainers[i].children("." + screenstate.toLowerCase() + "Panel").not(".visible");
            var invisible = matchedScreenContainers[i].children().not("." + screenstate.toLowerCase() + "Panel").filter(".visible");


            //this.InitializePanel(matchedGameModelScreens[i], visible, gameModel)

            //animation would be nice, but it is hard to hack!
            /*visible.animate({
                width: '100%',
                opacity: '1'
            }, 500, function () {
            });
            invisible.animate({
                width: '0px',
                opacity: '0'
            }, 500, function () {
            });*/
            visible.attr("style", "display:unset")
            visible.addClass("visible");

            invisible.removeClass("visible");
            invisible.attr("style", "display:none");
            //if (matchedGameModelScreens[i].state == "Success") {
            //    $(visible).find(".timer").html('');
            //    $(visible).find(".timer").pietimer({
            //        timerSeconds: matchedGameModelScreens[i].loginDelay,
            //        color: '#234',
            //        fill: true,
            //        showPercentage: false,
            //        callback: function () {
            //            
            //        }
            //    });
            //    matchedGameModelScreens[i].LoginDelayStart(this.UpdateDisplay);
            //}

        }

    }
    this.InitializePanel = function (gameModelScreen, visiblePanel, gameModel) {
        //switch (gameModelScreen.state) {
        //    case "Success":
        //        if (gameModelScreen.initialized == false) {
        //            this.InitializeSuccessPanel(gameModelScreen, visiblePanel, gameModel);
        //            gameModelScreen.initialized = true;
        //        } else {
        //            this.ResetSuccessPanel(gameModelScreen, visiblePanel);
        //        }
        //        break;
        //    default:
        //        break;
        //}
    }
    this.InitializeSuccessPanel = function (gameModelScreen, visiblePanel, gameModel) {
        //$(visiblePanel).find(".timer").pietimer({
        //    timerSeconds: gameModelScreen.loginDelay,
        //    color: '#234',
        //    fill: true,
        //    showPercentage: false
        //});
        //screenController.LoginDelayStart(gameModelScreen, this.UpdateDisplay, gameModel);
    }
    this.ResetSuccessPanel = function (gameModelScreen, visiblePanel) {
        $(visiblePanel).find(".timer").pietimer("reset");
        $(visiblePanel).find(".timer").pietimer("drawTimer");
        $(visiblePanel).find(".timer").pietimer("stopWatch");
    }



    this.SubmitRegisterPanel = function (screenContainer, matchingScreen, registerpanel) {
        var vm = GetRegisterViewModelFromScreenContainer(screenContainer);
        //var registerpanel = $(screenContainer).find('.registerPanel');
        var errors = [];

        errors.push.apply(errors, policyController.Validate(matchingScreen.policy, vm.username, vm.password));

        if (vm.password != vm.confirmPassword)
            errors.push("Passwords do not match.");

        if (errors.length > 0) {
            $(registerpanel).find('.errors').html(errors.join('\n'));
            $(registerpanel).find('.errors').attr('style', 'display:inline-box;');
            return;
        } else {
            $(registerpanel).find('.errors').html('');
            $(registerpanel).find('.errors').attr('style', 'display:none;');
        }

        //if we have gotten here, we have succeeded
        screenController.SubmitRegisterViewModel(matchingScreen, vm);
        ClearRegisterViewModelFromScreenContainer(screenContainer);
        return;
    }
    this.SubmitLoginPanel = function (screenContainer, matchingScreen, loginpanel) {
        var vm = GetLoginViewModelFromScreenContainer(screenContainer);
        //var loginpanel = $(screenContainer).find('.loginPanel');
        var errors = [];

        //matchingScreen = gameController.GetLoginScreen(gameModel,$(screenContainer).attr('id'));
        errors.push.apply(errors, screenController.ValidateSignIn(matchingScreen, vm.username, vm.password));

        if (errors.length > 0) {
            $(loginpanel).find('.errors').html(errors.join('\n'));
            $(loginpanel).find('.errors').attr('style', 'display:inline-box;');
            ClearLoginViewModelFromScreenContainer(screenContainer);
            return;
        } else {
            $(loginpanel).find('.errors').html('');
            $(loginpanel).find('.errors').attr('style', 'display:none;');
        }

        //if we have gotten here, we have succeeded
        screenController.SubmitLoginViewModel(matchingScreen, vm);
        screenController.LoginDelayStart(matchingScreen, this.UpdateDisplay, gameModel);
        ClearLoginViewModelFromScreenContainer(screenContainer);
        //start reset timer
        setTimeout(
            screenController.GoToResetScreen.bind(
                screenController,
                gameModel,
                matchingScreen
            ),
            matchingScreen.policy.resetAfterSeconds * 1000,
            presentationModel.UpdateDisplay
        );
        return;
    }

    this.SubmitResetPanel = function (screenContainer, matchingScreen, resetpanel) {
        var vm = GetResetViewModelFromScreenContainer(screenContainer);

        var errors = [];

        errors.push.apply(errors, screenController.ValidateReset(matchingScreen, vm.oldpassword, vm.newpassword, vm.confirmpassword))
        errors.push.apply(errors, policyController.ValidatePasswordOnly(matchingScreen.policy, vm.newpassword));
        if (errors.length > 0) {
            $(resetpanel).find('.errors').html(errors.join('\n'));
            $(resetpanel).find('.errors').attr('style', 'display:inline-box;');
            ClearResetViewModelFromScreenContainer(screenContainer);
            return;
        } else {
            $(resetpanel).find('.errors').html('');
            $(resetpanel).find('.errors').attr('style', 'display:none;');
        }

        //if we have gotten here, we have succeeded
        screenController.SubmitResetViewModel(matchingScreen, vm);
        ClearResetViewModelFromScreenContainer(screenContainer);
    }
}