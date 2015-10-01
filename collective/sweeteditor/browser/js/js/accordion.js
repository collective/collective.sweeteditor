tinyMCEPopup.requireLangPack();

var AccordionDialog = {
    init : function() {
	},

    insert : function() {
        // Insert accordion
        var value = document.forms[0].length.value;
        tinyMCEPopup.editor.execCommand('mceAccordion', false, value);
        tinyMCEPopup.close();
	}
};

tinyMCEPopup.onInit.add(AccordionDialog.init, AccordionDialog);
