tinyMCEPopup.requireLangPack();

var AccordionDialog = {
    init : function() {
	},

    insert : function() {
        // Insert accordion
        var formObj, value;

        formObj = document.forms[0];
        value = {
            itemsLength: formObj.accordionLength.value,
            collapsable: formObj.accordionCollapsable.checked
        };

        if (!AutoValidator.validate(formObj)) {
            tinyMCEPopup.alert(AutoValidator.getErrorMessages(formObj).join('. ') + '.');
            return false;
        }
        tinyMCEPopup.editor.execCommand('mceAccordion', false, value);
        tinyMCEPopup.close();
	}
};

tinyMCEPopup.onInit.add(AccordionDialog.init, AccordionDialog);
