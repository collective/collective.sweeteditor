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
                var $result, selected, $selected, selectedContent, content,
                    templateHeader, templateBody, $selectedChildren;

                $templateHeader = $('<p class="accordionHeading"></p>')
                $templateBody = $('<p class="accordionBody"></p>')
                selected = ed.selection.getNode();
                selectedContent = ed.selection.getContent();

                if (selectedContent) {
                    // selection
                    $selected = $(selected);
                    $result = $('<div></div>');
                    $selectedChildren = $selected.children();
                    $selectedChildren
                        .each(function (index) {
                            var $this = $(this).clone(), odd = index % 2 === 0,
                                $templateHeaderClone = $templateHeader.clone(),
                                $templateBodyClone = $templateBody.clone(),
                                $elemToAppend = $this, $template;
                            if (odd) {
                                $template = $templateHeaderClone;
                            } else {
                                $template = $templateBodyClone;
                            }
                            if ($this.is('p')) {
                                $template.text($this.text());
                            }
                            else {
                                $this.appendTo($template);
                            }

                            $template.appendTo($result);
                        });
                    if ($selectedChildren.length % 2 === 1) {
                        $templateBody.appendTo($result);
                    }
                    content = $result.get(0).innerHTML;
                    alert(content);
                } else {
                    // no selection
                    content = $templateHeader.get(0).outerHTML + $templateBody.get(0).outerHTML;
                }
                ed.execCommand('mceInsertContent', false, content);
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
