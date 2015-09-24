/**
 * Plone snippet Plugin
 *
 * @author Davide Moro (inspired by Maurizio Lupo's redomino.tinymceplugins.snippet)
 */
(function($) {
    // TODO: tinymce.PluginManager.requireLangPack('accordion');
    tinymce.create('tinymce.plugins.AccordionPlugin', {
        init: function(ed, url) {
            // contextual controls
            ed.onInit.add(function() {
                if (ed && ed.plugins.contextmenu) {
                    ed.plugins.contextmenu.onContextMenu.add(function(plugin, menu, element) {
                        menu.addSeparator();
                        if (! ed.dom.getParent(element, 'div.panel-group')) {
                            // add new accordion
                            menu.add({title : 'accordion.desc', icon : 'table', cmd : 'mceAccordion'});
                        }
                        /*
                        if (ed.dom.getParent(element, 'div.panel')) {
                            // TODO: add new accordion item up or down
                            menu.add({title : 'accordion.desc', icon : 'table', cmd : 'mceAccordion'});
                        }
                        */
                    });
                }
            });
            // Register commands
            ed.addCommand('mceAccordion', function() {
                var selected, $selected, selectedContent, content,
                    $selectedChildren, template,
                    context, html,
                    randomString = Math.floor(10000 * (Math.random() % 1)).toString(),
                    context = {
                        panels: [],
                        random: randomString
                    },
                    defaultHeader = {
                        header: 'Header',
                        body: 'Body'
                    },
                    emptyParagraph = '<p></p>',
                    source = emptyParagraph +
                        '<div class="panel-group" ' + 
                        '     id="{{random}}-accordion" ' +
                        '     role="tablist" ' +
                        '     aria-multiselectable="true">' +
                        '  {{#each panels}}' +
                        '  <div class="panel panel-default">' +
                        '    <div role="tab" ' +
                        '         class="panel-heading {{#if @first}}first{{/if}}"' +
                        '         id="{{../random}}-{{@index}}-heading">' +
                        '      <h4 class="panel-title">' +
                        '        <a role="button" ' +
                        '           data-toggle="collapse" ' +
                        '           data-parent="#{{../random}}-accordion" ' +
                        '           href="#{{../random}}-{{@index}}-body" ' +
                        '           aria-expanded="true" ' +
                        '           aria-controls="{{../random}}-{{@index}}-body">' +
                        '          {{{header}}}' +
                        '        </a>' +
                        '      </h4>' +
                        '    </div>' +
                        '    <div id="{{../random}}-{{@index}}-body" ' +
                        '         class="panel-collapse collapse {{#if @first}}in{{/if}}" ' +
                        '         role="tabpanel" ' +
                        '         aria-labelledby="{{../random}}-{{@index}}-heading">' +
                        '      <div class="panel-body">' +
                        '        {{{body}}}' +
                        '      </div>' +
                        '    </div>' +
                        '  </div>' +
                        '  {{/each}}' +
                        '</div>' +
                        emptyParagraph;
                template = Handlebars.compile(source);

                selected = ed.selection.getNode();
                selectedContent = ed.selection.getContent();

                if (selectedContent) {
                    // selection
                    $selected = $(selected);
                    // prepend an extra final paragraph
                    $selectedChildren = $selected.children();
                    $selectedChildren
                        .each(function(index) {
                            var $this = $(this),
                                text = $this.text(),
                                odd = index % 2 === 0,
                                panelsLength = context.panels.length,
                                lastPanelIndex = panelsLength ? panelsLength - 1 : 0;
                            if (odd) {
                                // we use the header template
                                if (text) {
                                    context.panels.push({
                                        header: text
                                    });
                                }
                            } else {
                                // we use the body template
                                if (!context.panels[lastPanelIndex].body) {
                                    context.panels[lastPanelIndex].body = $this.get(0).innerHTML;
                                }
                            }
                        });
                } else {
                    // no selection
                    context.panels.push(defaultHeader);
                }
                if (context.panels.length) {
                    html = template(context);
                    ed.execCommand('mceInsertContent', false, html);
                }
            });

            // Register buttons
            ed.addButton('accordion', {
                title: 'accordion.desc',
                cmd: 'mceAccordion',
                image: url + '/++resource++collective.sweeteditor.img/accordion.gif'
            });

        },


        getInfo: function() {
            return {
                longname: 'Accordion Plugin',
                author: 'Davide Moro (@ Abstract srl for EEA)',
                authorurl: 'http://davidemoro.blogspot.it/',
                infourl: 'https://github.com/davidemoro/collective.sweeteditor',
                version: "0.1"
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('accordion', tinymce.plugins.AccordionPlugin);
})(jQuery);
