//regex HELPERS
var StringHelper = StringHelper || {
     validateEmail : function (email) {
        var filter = new RegExp('^(?=[A-Z0-9][A-Z0-9@@._%+-]{5,253}+$)[A-Z0-9._%+-]{1,64}+@(?:(?=[A-Z0-9-]{1,63}+\.)[A-Z0-9]++(?:-[A-Z0-9]++)*+\.){1,8}+[A-Z]{2,63}+$');
        return filter.test(email);
    },
    validateHasNumber: function(string){
        var filter = new RegExp('\d');
        return filter.test(string);
    },
    countNumbers: function(string){
        return string.replace(/[^0-9]/g,'').length;
    },
    validateHasUpperCase: function(string){
        var filter = new RegExp('[A-Z]');
        return filter.test(string);
    },
    countUpperCase: function(string){
        return string.replace(/[^A-Z]/g,'').length;
    },
    validateHasLowerCase: function(string){
        var filter = new RegExp('[a-z]');
        return filter.test(string);
    },
    countLowerCase: function(string){
        return string.replace(/[^a-z]/g,'').length;
    },
    validateHasSymbol: function(string){
        var filter = new RegExp('[^\w\d\s:]');
        return filter.test(string);
    },
    countSymbols: function(string){
        return string.replace(/[\w\d\s:]/g,'').length;
    }
}