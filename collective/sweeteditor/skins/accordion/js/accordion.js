tinyMCEPopup.requireLangPack();

var AccordionDialog = {
    init : function() {
        var accordionLengthField;

        this.node = tinyMCEPopup.getWindowArg('node');

        if (this.node) {
            // If there is a selected node we have to remove from dom
            // required accordion length field (initialization based on 
            // text selection)
            accordionLengthField = document.getElementById('mceAccordionLengthField');
            accordionLengthField.parentNode.removeChild(accordionLengthField);
        }
    },

    insert : function() {
        // Insert accordion
        var formObj, value;

        formObj = document.forms[0];
        value = {
            itemsLength: formObj.accordionLength ? formObj.accordionLength.value : 0,
            collapsable: formObj.accordionCollapsable.checked,
            node: this.node
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
