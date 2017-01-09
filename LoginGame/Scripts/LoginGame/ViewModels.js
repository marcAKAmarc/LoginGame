function RegisterViewModel(username, password, confirmPassword) {
    this.username = username;
    this.password = password;
    this.confirmPassword = confirmPassword;
}
function GetRegisterViewModelFromScreenContainer(screenContainer) {
    var username = $(screenContainer).find(".registerPanel").find(".inputUsername").val();
    var password = $(screenContainer).find(".registerPanel").find(".inputPassword").val();
    var confirmPassword = $(screenContainer).find(".registerPanel").find(".inputConfirmPassword").val();
    return new RegisterViewModel(username, password, confirmPassword);
}
function ClearRegisterViewModelFromScreenContainer(screenContainer) {
    $(screenContainer).find(".registerPanel").find(".inputUsername").val('');
    $(screenContainer).find(".registerPanel").find(".inputPassword").val('');
    $(screenContainer).find(".registerPanel").find(".inputConfirmPassword").val('');
}



function LoginViewModel(username, password) {
    this.username = username;
    this.password = password;
}
function GetLoginViewModelFromScreenContainer(screenContainer) {
    var username = $(screenContainer).find(".loginPanel").find(".inputUsername").val();
    var password = $(screenContainer).find(".loginPanel").find(".inputPassword").val();
    return new LoginViewModel(username, password);
}
function ClearLoginViewModelFromScreenContainer(screenContainer) {
    $(screenContainer).find(".loginPanel").find(".inputUsername").val('');
    $(screenContainer).find(".loginPanel").find(".inputPassword").val('');
}

function ResetViewModel(oldpassword, newpassword, confirmpassword) {
    this.oldpassword = oldpassword;
    this.newpassword = newpassword;
    this.confirmpassword = confirmpassword;
}

function GetResetViewModelFromScreenContainer(screenContainer) {
    var oldpassword = $(screenContainer).find(".resetPanel").find(".inputOldPassword").val();
    var newpassword = $(screenContainer).find(".resetPanel").find(".inputNewPassword").val();
    var confirmpassword = $(screenContainer).find(".resetPanel").find(".inputConfirmPassword").val();
    return new ResetViewModel(oldpassword, newpassword, confirmpassword);
}

function ClearResetViewModelFromScreenContainer(screenContainer) {
    var oldpassword = $(screenContainer).find(".resetPanel").find(".inputOldPassword").val('');
    var newpassword = $(screenContainer).find(".resetPanel").find(".inputNewPassword").val('');
    var confirmpassword = $(screenContainer).find(".resetPanel").find(".inputConfirmPassword").val('');
    return new ResetViewModel(oldpassword, newpassword, confirmpassword);
}