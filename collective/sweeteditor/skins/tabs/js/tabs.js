tinyMCEPopup.requireLangPack();

var TabsDialog = {
    init : function() {
        // debugger;
	},

    insert : function() {
        // Insert tabs
        var formObj = document.forms[0], value = formObj.tabsLength.value;

        if (!AutoValidator.validate(formObj)) {
            tinyMCEPopup.alert(AutoValidator.getErrorMessages(formObj).join('. ') + '.');
            return false;
        }
        tinyMCEPopup.editor.execCommand('mceTabs', false, value);
        tinyMCEPopup.close();
	}
};

tinyMCEPopup.onInit.add(TabsDialog.init, TabsDialog);
