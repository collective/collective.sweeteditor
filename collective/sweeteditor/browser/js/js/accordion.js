tinyMCEPopup.requireLangPack();

var AccordionDialog = {
    init : function() {
        var f = document.forms[0];
        // Get the selected contents as text and place it in the input
        //f.somelink.value = tinyMCEPopup.editor.selection.getContent({format : 'text'}) ;
        //f.someview.value = tinyMCEPopup.getWindowArg('some_custom_arg');
	},

    insert : function() {
        // Insert the contents from the textarea into the document
        var value = document.forms[0].length.value;
alert('SONO QUI');
alert(value);
        tinyMCEPopup.editor.execCommand('mceAccordion', false, value);
        tinyMCEPopup.close();
	}
};

tinyMCEPopup.onInit.add(AccordionDialog.init, AccordionDialog);
