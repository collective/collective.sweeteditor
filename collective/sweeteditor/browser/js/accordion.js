/**
 * Plone snippet Plugin
 *
 * @author Davide Moro (inspired by Maurizio Lupo's redomino.tinymceplugins.snippet)
 */
(function($) {
    var defaultAccordionItem, emptyParagraph, accordionItemSource, accordionItemTemplate,
        accordionSource, accordionTemplate, buttons, addAccordionCondition, accordionCondition;

    addAccordionCondition = function (ed, element) {
        return ! ed.dom.getParent(element, 'div.panel-group');
    };
    accordionCondition = function (ed, element) {
        return ed.dom.getParent(element, 'div.panel');
    };

    // buttons
    buttons = [
        ['accordion',
         {title: 'accordion.desc',
          cmd: 'mceAccordion',
          image: '/++resource++collective.sweeteditor.img/accordion.gif'
         },
         addAccordionCondition
        ],
        ['accordionDelete',
         {title: 'accordion-delete.desc',
          cmd: 'mceAccordionDelete',
          image: '/++resource++collective.sweeteditor.img/accordion.gif'
          },
          accordionCondition
        ],
        ['accordionItemDelete', {
          title: 'accordionitem-delete.desc',
          cmd: 'mceAccordionItemDelete',
          image: '/++resource++collective.sweeteditor.img/accordion.gif'
          },
          accordionCondition
        ],
        ['accordionItemInsertAfter', {
          title: 'accordionitem-insertafter.desc',
          cmd: 'mceAccordionItemInsert',
          ui: true,
          image: '/++resource++collective.sweeteditor.img/accordion.gif'
          },
          accordionCondition
        ],
        ['accordionItemInsertBefore', {
          title: 'accordionitem-insertbefore.desc',
          cmd: 'mceAccordionItemInsert',
          ui: false,
          image: '/++resource++collective.sweeteditor.img/accordion.gif'
          },
          accordionCondition
        ]
    ];

    // templates
    defaultAccordionItem = {
        header: 'Header',
        body: 'Body'
    };
    emptyParagraph = '<p></p>';
    accordionItemSource = '<div class="panel panel-default">' +
        '  <div class="panel-heading" ' +
        '       role="tab" ' +
        '       id="{{random1}}-{{random2}}-heading">' +
        '    <h4 class="panel-title">' +
        '      <a role="button" ' +
        '         data-toggle="collapse" ' +
        '         data-parent="#{{random1}}-accordion" ' +
        '         href="#{{random1}}-{{random2}}-body" ' +
        '         aria-expanded="true" ' +
        '         aria-controls="{{random1}}-{{random2}}-body">' +
        '        {{{header}}}' +
        '      </a>' +
        '    </h4>' +
        '  </div>' +
        '  <div id="{{random1}}-{{random2}}-body" ' +
        '       class="panel-collapse collapse {{#if @first}}in{{/if}}" ' +
        '       role="tabpanel" ' +
        '       aria-labelledby="{{random1}}-{{random2}}-heading">' +
        '    <div class="panel-body">' +
        '      {{{body}}}' +
        '    </div>' +
        '  </div>' +
        '</div>';
    accordionSource = emptyParagraph +
        '<div class="panel-group" ' +
        '     id="{{random1}}-accordion" ' +
        '     role="tablist" ' +
        '     aria-multiselectable="true">' +
        '  {{#each panels}}' +
        '  {{> accordionItem random1=../random1 random2=../random2}}' +
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
                        tinymce.each(buttons, function (item){
                            var condition = item[2];
                            if (! condition || condition(ed, element)) {
                                menu.add(item[1]);
                            }
                        });
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
                // insert another accordion, after or before the selected item
                var selected, randomString1, randomString2, context, html, accordionItem, el;

                selected = ed.selection.getNode();
                accordionItem = ed.dom.getParent(selected, 'div.panel');
                accordionParent = ed.dom.getParent(accordionItem, 'div.panel-group');
                randomString1 = accordionParent.id.replace('-accordion', '');
                randomString2 = Math.floor(10000 * (Math.random() % 1)).toString();
                context = {};
                context.header = defaultAccordionItem.header;
                context.body = defaultAccordionItem.body;
                context.random1 = randomString1;
                context.random2 = randomString2;
                html = accordionItemTemplate(context);
                el = ed.dom.create('div');
                if (after) {
                    ed.dom.insertAfter(el, accordionItem);
                } else {
                    accordionParent.insertBefore(el, accordionItem);
                }
                ed.dom.setOuterHTML(el, html);

                if (!after && ed.dom.hasClass(accordionItem.lastChild, 'in')) {
                    // if the current accordion item is the first one and we are
                    // prepending another accordion item, we need to toggle the
                    // "in" class
                    ed.dom.removeClass(accordionItem.lastChild, 'in');
                    ed.dom.addClass(accordionParent.firstChild.lastChild, 'in');
                }
            });
            ed.addCommand('mceAccordion', function() {
                // add accordion
                var selected, $selected, selectedContent, content,
                    $selectedChildren, template,
                    context, html,
                    randomString1 = Math.floor(10000 * (Math.random() % 1)).toString(),
                    randomString2 = Math.floor(10000 * (Math.random() % 1)).toString();
                context = {
                    panels: [],
                    random1: randomString1,
                    random2: randomString2
                };

                selected = ed.selection.getNode();
                selectedContent = ed.selection.getContent();

                if (selectedContent) {
                    // selection
                    $selected = $(selected);
                    // prepend an extra final paragraph
                    $selectedChildren = $selected.children();
                    $selectedChildren.each(function(index) {
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
                    context.panels.push(defaultAccordionItem);
                }
                if (context.panels.length) {
                    html = accordionTemplate(context);
                    ed.execCommand('mceInsertContent', false, html);
                }
            });

            // Register buttons
            tinymce.each(buttons, function (item){
                ed.addButton(item[0], item[1]);
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
