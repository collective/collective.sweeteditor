/**
 * Plone snippet Plugin
 *
 * @author Davide Moro (inspired by Maurizio Lupo's redomino.tinymceplugins.snippet)
 */

(function($) {
    // tinymce.PluginManager.requireLangPack('accordion');
    tinymce.create('tinymce.plugins.AccordionPlugin', {
        init : function(ed, url) {
            // Register commands
            ed.addCommand('mceAccordion', function() {
                var selected, selectedContent, content, templateHeader, templateBody;

                templateHeader = $('<div><p class="collapseHeading">Header</></div>')
                templateBody = $('<div><p class="collapseHeading">Body</p></div>')
                selected = ed.selection.getNode();
                selectedContent = ed.selection.getContent();

                if (selectedContent) {
                    // TODO
                    $selected = $(selected);
                    content =  '[shortcode]'+selected+'[/shortcode]';
                } else {
                    content = templateHeader.html() + templateBody.html();
                }
                ed.execCommand('mceInsertContent', false, content);
/*
                ed.windowManager.open({
                    file : url + '/dialog.htm',
                    width :  parseInt(ed.getParam("paste_dialog_width", "450")),
                    height :  parseInt(ed.getParam("paste_dialog_height", "400")),
                    inline : 1
                );
*/
            });

            // Register buttons
            ed.addButton('accordion', {
                title : 'accordion.desc',
                cmd : 'mceAccordion',
                image : url + '/++resource++collective.sweeteditor.img/accordion.gif'
            });
            
        },
        

        getInfo : function() {
            return {
                longname : 'Accordion Plugin',
                author : 'Davide Moro (@ Abstract srl for EEA)',
                authorurl : 'http://davidemoro.blogspot.it/',
                infourl : 'https://github.com/davidemoro/collective.sweeteditor',
                version : "0.1"
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('accordion', tinymce.plugins.AccordionPlugin);
})(jQuery);
