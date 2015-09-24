/**
 * Plone snippet Plugin
 *
 * @author Davide Moro (inspired by Maurizio Lupo's redomino.tinymceplugins.snippet)
 */
(function($) {
    var emptyParagraph, accordionItemSource, accordionItemTemplate,
        accordionSource, accordionTemplate;

    // templates
    emptyParagraph = '<p></p>',
    accordionItemSource = '<div class="panel panel-default">' +
        '  <div class="panel-heading" ' +
        '       role="tab" ' +
        '       id="{{../random}}-{{@index}}-heading">' +
        '    <h4 class="panel-title">' +
        '      <a role="button" ' +
        '         data-toggle="collapse" ' +
        '         data-parent="#{{../random}}-accordion" ' +
        '         href="#{{../random}}-{{@index}}-body" ' +
        '         aria-expanded="true" ' +
        '         aria-controls="{{../random}}-{{@index}}-body">' +
        '        {{{header}}}' +
        '      </a>' +
        '    </h4>' +
        '  </div>' +
        '  <div id="{{../random}}-{{@index}}-body" ' +
        '       class="panel-collapse collapse {{#if @first}}in{{/if}}" ' +
        '       role="tabpanel" ' +
        '       aria-labelledby="{{../random}}-{{@index}}-heading">' +
        '    <div class="panel-body">' +
        '      {{{body}}}' +
        '    </div>' +
        '  </div>' +
        '</div>';
    accordionSource = emptyParagraph +
        '<div class="panel-group" ' +
        '     id="{{random}}-accordion" ' +
        '     role="tablist" ' +
        '     aria-multiselectable="true">' +
        '  {{#each panels}}' +
        '  {{> accordionItem }}' +
        '  {{/each}}' +
        '</div>' +
        emptyParagraph;

    accordionItemTemplate = Handlebars.compile(accordionItemSource);
    Handlebars.registerPartial('accordionItem', accordionItemTemplate);
    accordionTemplate = Handlebars.compile(accordionSource);

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
                        if (ed.dom.getParent(element, 'div.panel')) {
                            // TODO: add new accordion item up or down
                            menu.add({title : 'accordion-delete.desc', icon : 'table', cmd : 'mceAccordionDelete'});
                            menu.add({title : 'accordionitem-delete.desc', icon : 'table', cmd : 'mceAccordionItemDelete'});
                        }
                    });
                }
            });
            // Register commands
            ed.addCommand('mceAccordionDelete', function() {
                // remove the whole accordion
                var selected, accordion;

                selected = ed.selection.getNode();
                accordion = ed.dom.getParent(selected, 'div.panel-group');
                ed.dom.remove(accordion);
            });
            ed.addCommand('mceAccordionItemDelete', function() {
                // delete the selected accordion item. If it is the last one,
                // the entire accordion will be removed
                var selected, toBeRemoved;

                selected = ed.selection.getNode();
                toBeRemoved = ed.dom.getParent(selected, 'div.panel');
                if (! ed.dom.getNext(toBeRemoved, 'div.panel') && ! ed.dom.getPrev(toBeRemoved, 'div.panel')) {
                    toBeRemoved = ed.dom.getParent(selected, 'div.panel-group');
                }
                ed.dom.remove(toBeRemoved);
            });
            ed.addCommand('mceAccordionItemInsert', function(after) {
                // insert another accordion, after or before the selected
                // item
            });
            ed.addCommand('mceAccordion', function() {
                // add accordion
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
                    html = accordionTemplate(context);
                    ed.execCommand('mceInsertContent', false, html);
                }
            });

            // Register buttons
            ed.addButton('accordion', {
                title: 'accordion.desc',
                cmd: 'mceAccordion',
                image: url + '/++resource++collective.sweeteditor.img/accordion.gif'
            });
            ed.addButton('accordionDelete', {
                title: 'accordion-delete.desc',
                cmd: 'mceAccordionDelete',
                image: url + '/++resource++collective.sweeteditor.img/accordion.gif'
            });
            ed.addButton('accordionItemDelete', {
                title: 'accordionitem-delete.desc',
                cmd: 'mceAccordionItemDelete',
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
