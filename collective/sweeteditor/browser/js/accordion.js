/**
 * Plone snippet Plugin
 *
 * @author Davide Moro (inspired by Maurizio Lupo's redomino.tinymceplugins.snippet)
 */

(function($) {
    // tinymce.PluginManager.requireLangPack('accordion');
    tinymce.create('tinymce.plugins.AccordionPlugin', {
        init : function(ed, url) {
            // contextual controls
            ed.onInit.add(function(ed) {
                ed.onMouseUp.add(function(ed, e) {
                    if (ed && ed.plugins.contextmenu) {
                        ed.plugins.contextmenu.onContextMenu.add(function(th, m, e) {
                            // m.addSeparator();
                            if (! (ed.dom.getParent(e, 'p.accordionBody') || ed.dom.getParent(e, 'p.accordionHeader'))) {
                                // m.removeAll();
                                // TODO: wip code. Implement context menu commands
                                alert(m);
                                m.add({title : 'accordion.desc', icon : 'table', cmd : 'mceAccordion'});
                            }
                        });
                    }
                });
            });

            // Register commands
            ed.addCommand('mceAccordion', function() {
                var $result, selected, $selected, selectedContent, content,
                    templateHeader, templateBody, $selectedChildren,
                    emptyParagraph = '<p></p>',
                    $emptyParagraph = $(emptyParagraph);

                $templateHeader = $('<p class="accordionHeading"></p>')
                $templateBody = $('<p class="accordionBody"></p>')
                selected = ed.selection.getNode();
                selectedContent = ed.selection.getContent();

                if (selectedContent) {
                    // selection
                    $selected = $(selected);
                    $result = $('<div></div>');   // the div will be omitted
                    // prepend an extra final paragraph
                    $emptyParagraph.clone().appendTo($result);
                    $selectedChildren = $selected.children();
                    $selectedChildren
                        .each(function (index) {
                            var $this = $(this).clone(), odd = index % 2 === 0,
                                $templateHeaderClone = $templateHeader.clone(),
                                $templateBodyClone = $templateBody.clone(),
                                $elemToAppend = $this, $template;
                            if (odd) {
                                // we use the header template
                                $template = $templateHeaderClone;
                            } else {
                                // we use the body template
                                $template = $templateBodyClone;
                            }
                            if ($this.is('p')) {
                                // if the elem type is p, we have to
                                // use its text (no good a p inside
                                // another p elem)
                                $template.text($this.text());
                            }
                            else {
                                $this.appendTo($template);
                            }

                            // append to results
                            $template.appendTo($result);
                        });
                    if ($selectedChildren.length % 2 === 1) {
                        // there is a missing body, we add it
                        $templateBody.appendTo($result);
                    }

                    // append an extra final paragraph
                    $emptyParagraph.clone().appendTo($result);
                    content = $result.get(0).innerHTML;
                } else {
                    // no selection
                    content = emptyParagraph + 
                              $templateHeader.get(0).outerHTML +
                              $templateBody.get(0).outerHTML +
                              emptyParagraph;
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
