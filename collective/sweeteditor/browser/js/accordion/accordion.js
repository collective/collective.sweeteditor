/**
 * Plone snippet Plugin
 *
 * @author Davide Moro (inspired by Maurizio Lupo's redomino.tinymceplugins.snippet)
 */
(function() {
    var defaultAccordionItem, emptyParagraph, accordionItemSource, accordionItemTemplate,
        accordionSource, accordionTemplate, addAccordionCondition, accordionCondition, version;

    version = '0.1';

    addAccordionCondition = function (ed, element) {
        return ! (ed.dom.getParent(element, '.panel-group') || ed.dom.getParent(element, '.nav-tabs'));
    };
    accordionCondition = function (ed, element) {
        return ed.dom.getParent(element, '.panel');
    };

    // templates
    defaultAccordionItem = {
        header: 'Header',
        body: '<p>Body</p>'
    };
    emptyParagraph = '<p></p>';
    accordionItemSource = '<div class="panel panel-default">' +
        '  <div class="panel-heading" ' +
        '       role="tab" ' +
        '       id="{{random1}}-{{random2}}{{@index}}-heading">' +
        '    <h4 class="panel-title">' +
        '      <a role="button" ' +
        '         data-toggle="collapse" ' +
        '         {{#unless collapsable}}data-parent="#{{random1}}-accordion"{{/unless}} ' +
        '         href="#{{random1}}-{{random2}}{{@index}}-body" ' +
        '         aria-expanded="true" ' +
        '         aria-controls="{{random1}}-{{random2}}{{@index}}-body">{{{header}}}</a>' +
        '    </h4>' +
        '  </div>' +
        '  <div id="{{random1}}-{{random2}}{{@index}}-body" ' +
        '       class="panel-collapse collapse {{#if @first}}in{{/if}}" ' +
        '       role="tabpanel" ' +
        '       aria-labelledby="{{random1}}-{{random2}}{{@index}}-heading">' +
        '    <div class="panel-body">{{{body}}}</div>' +
        '  </div>' +
        '</div>';
    accordionSource = emptyParagraph +
        '<div class="panel-group {{#if collapsable}}sweet-collapsable{{/if}}" ' +
        '     id="{{random1}}-accordion" ' +
        '     role="tablist" ' +
        '     aria-multiselectable="true">' +
        '  {{#each items}}' +
        '  {{> accordionItem random1=../random1 random2=../random2 collapsable=../collapsable}}' +
        '  {{/each}}' +
        '</div>' +
        emptyParagraph;

    accordionItemTemplate = Handlebars.compile(accordionItemSource);
    Handlebars.registerPartial('accordionItem', accordionItemTemplate);
    accordionTemplate = Handlebars.compile(accordionSource);

    tinymce.PluginManager.requireLangPack('accordion');
    tinymce.create('tinymce.plugins.AccordionPlugin', {
        init: function(ed, url) {
            var buttons;

            // buttons
            buttons = [
                ['accordion',
                 {title: 'accordion.desc',
                  cmd: 'mceAccordion',
                  ui: false,
                  value: {},
                  image: url + '/img/accordion.gif',
                  icon: 'accordion'
                 },
                 addAccordionCondition
                ],
                ['accordionDelete',
                 {title: 'accordion.deletedesc',
                  cmd: 'mceAccordionDelete',
                  image: url + '/img/accordion-delete.gif',
                  icon: 'accordion-delete'
                  },
                  accordionCondition
                ],
                ['accordionItemDelete', {
                  title: 'accordion.itemdeletedesc',
                  cmd: 'mceAccordionItemDelete',
                  image: url + '/img/accordion-item-delete.gif',
                  icon: 'accordion-item-delete'
                  },
                  accordionCondition
                ],
                ['accordionItemInsertAfter', {
                  title: 'accordion.iteminsertafterdesc',
                  cmd: 'mceAccordionItemInsert',
                  ui: false,
                  value: {after: true},
                  image: url + '/img/accordion-item-insert-after.gif',
                  icon: 'accordion-item-insert-after'
                  },
                  accordionCondition
                ],
                ['accordionItemInsertBefore', {
                  title: 'accordion.iteminsertbeforedesc',
                  cmd: 'mceAccordionItemInsert',
                  ui: false,
                  value: {after: false},
                  image: url + '/img/accordion-item-insert-before.gif',
                  icon: 'accordion-item-insert-before'
                  },
                  accordionCondition
                ]
            ];

            // contextual controls
            ed.onInit.add(function() {
                if (ed && ed.dom.loadCSS) {
                    // load plugin's css
                    ed.dom.loadCSS(url + '/css/accordion.css?version=' + version);
                }
                if (ed && ed.plugins.contextmenu) {
                    ed.plugins.contextmenu.onContextMenu.add(function(plugin, menu, element) {
                        var groupMenu;
                        if (! ed.dom.getParent(element, '.nav-tabs')) {
                            // Don't add the accordion/collapsable contextmenu if we are
                            // inside a tabs header
                            if (ed.dom.getParent(element, '.panel-heading')) {
                                menu.removeAll();
                            } else {
                                menu.addSeparator();
                            }
                            groupMenu = menu.addMenu({title : 'accordion.group'});
                            tinymce.each(buttons, function (item){
                                var condition;
                                condition = item[2];
                                if (! condition || condition(ed, element)) {
                                    groupMenu.add(item[1]);
                                }
                            });
                        }
                    });
                }

                // Events
                ed.onKeyDown.add(function(ed, e) {
                    // Safe editing mode
                    var range, elem, accordionRootSelector, textContentLength, keyCode, moveKeys;

                    keyCode = e.keyCode;
                    accordionRootSelector = '.panel-group';
                    moveKeys = [37, 38, 39, 40];
                    elem = ed.selection.getNode();

                    // Prevent edit where it shouldn't be possible (mceNotEditable/mceEditable doesn't
                    // work on older versions of TinyMCE)
                    if (ed.dom.getParent(elem, accordionRootSelector)) {
                        if (moveKeys.indexOf(keyCode) === -1) {
                            // Ignore movement keys (arrows)
                            if (ed.dom.getParent(elem, '.panel-heading a') || ed.dom.getParent(elem, '.panel-body')) {
                                // Prevent element duplication due to "return" key or undesired
                                // editing in not allowed areas (mceNonEditable does not work as
                                // expected on this particular version).
                                if (keyCode === 13) {
                                    // we should prevent shift+enter if we are inside of .panel-heading
                                    if (ed.dom.getParent(elem, '.panel-heading')) {
                                        return tinymce.dom.Event.cancel(e);
                                    }
                                }
                                // Prevent undesired accordion markup removals
                                // pressing back delete or canc
                                if (keyCode === 8 || keyCode === 46) {
                                    range = ed.selection.getRng();
                                    textContentLength = elem.textContent.length;

                                    if ((keyCode === 8 && range.startOffset === 0) ||
                                       (keyCode === 46 && range.startOffset === textContentLength)) {
                                        return tinymce.dom.Event.cancel(e);
                                    }
                                }
                            } else {
                                return tinymce.dom.Event.cancel(e);
                            }
                        }
                    }
                });
            });

            // Register commands
            ed.addCommand('mceAccordionDelete', function() {
                // remove the whole accordion
                var selected, accordion;

                selected = ed.selection.getNode();
                accordion = ed.dom.getParent(selected, '.panel-group');
                ed.dom.remove(accordion);
            });
            ed.addCommand('mceAccordionItemDelete', function() {
                // delete the selected accordion item. If it is the last one,
                // the entire accordion will be removed
                var selected, toBeRemoved, next;

                selected = ed.selection.getNode();
                toBeRemoved = ed.dom.getParent(selected, '.panel');
                next = ed.dom.getNext(toBeRemoved, '.panel');
                if (! next && ! ed.dom.getPrev(toBeRemoved, '.panel')) {
                    toBeRemoved = ed.dom.getParent(selected, '.panel-group');
                }

                if (toBeRemoved === ed.dom.getParent(selected, '.panel-group').firstChild && next) {
                    ed.dom.addClass(next.lastChild, 'in');
                }
                ed.dom.remove(toBeRemoved);
            });
            ed.addCommand('mceAccordionItemInsert', function(ui, conf) {
                // insert another accordion, after or before the selected item
                var selected, randomString1, randomString2, context, html, accordionItem, el, after;

                after = conf.after;

                selected = ed.selection.getNode();
                accordionItem = ed.dom.getParent(selected, '.panel');
                accordionParent = ed.dom.getParent(accordionItem, '.panel-group');
                randomString1 = accordionParent.id.replace('-accordion', '');
                randomString2 = Math.floor(10000 * (Math.random() % 1)).toString();
                context = {};
                context.header = defaultAccordionItem.header;
                context.body = defaultAccordionItem.body;
                context.random1 = randomString1;
                context.random2 = randomString2;
                context.collapsable = ed.dom.hasClass(accordionParent, 'sweet-collapsable');
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

            // Handle node change updates
            ed.onNodeChange.add(function(ed, cm, n) {
                // disable toolbar's buttons depending on the current selection
                tinymce.each(buttons, function (item) {
                    cm.setDisabled(item[0], !item[2](ed, n));
                });
            });

            ed.addCommand('mceAccordion', function(ui, conf) {
                // add accordion
                var selected, selectedContent, content,
                    template,
                    context, html, index, iter,
                    itemsLength = conf ? conf.itemsLength : undefined,
                    collapsable = conf ? conf.collapsable : undefined,
                    randomString1 = Math.floor(10000 * (Math.random() % 1)).toString(),
                    randomString2 = Math.floor(10000 * (Math.random() % 1)).toString();
                context = {
                    items: [],
                    collapsable: collapsable,
                    random1: randomString1,
                    random2: randomString2
                };

                selected = ed.selection.getNode();
                selectedContent = ed.selection.getContent();

                if (conf.node || selectedContent) {
                    // There is a selected content OR a node passed by the initialization popup
                    if (! conf.node) {
                        // There is no node in conf, let's open the popup and choose if we
                        // want to create an accordion or collapsable elem
                        ed.windowManager.open({
                            file : url + '/accordion.html',
                            width : 430 + parseInt(ed.getLang('media.delta_width', 0)),
                            height : 500 + parseInt(ed.getLang('media.delta_height', 0)),
                            inline : 1
                            }, {
                            node : selected,
                            plugin_url : url
                        });
                        return;
                    } else {
                        // There is a node in conf passed by the popup, let's proceed
                        selected = conf.node;
                    }

                    if (['p', 'table', 'b', 'a', 'br'].indexOf(selected.nodeName) !== -1) {
                        /* The initialization based on text selection only makes
                           sense for simple markup like the following:
                               <p>header1</p>
                               <p>body1</p>
                               <p>header2</p>
                               <p>body2</p>

                           Not like:
                               <p>header1<br />body1<br />header2<br />body2</p>
                        */
                        return;
                    }
                    tinymce.each(ed.selection.getSelectedBlocks(), function(child, index) {
                        var text = child.textContent,
                            odd = index % 2 === 0,
                            contextItemsLength = context.items.length,
                            lastItemIndex = contextItemsLength ? contextItemsLength - 1 : 0;
                        if (odd) {
                            // we use the header template
                            context.items.push({
                                header: text ? text : 'Header'
                            });
                        } else {
                            // we use the body template
                            if (!context.items[lastItemIndex].body) {
                                context.items[lastItemIndex].body = child.outerHTML;
                            }
                        }
                    });
                } else {
                    // no selection
                    if (itemsLength !== undefined) {
                        for (iter=1; iter<=itemsLength; iter++) {
                            context.items.push({header: 'Header 1', body: '<p>Body ' + iter + '</p>'});
                        }
                    } else {
                        ed.windowManager.open({
                            file : url + '/accordion.html',
                            width : 430 + parseInt(ed.getLang('media.delta_width', 0)),
                            height : 500 + parseInt(ed.getLang('media.delta_height', 0)),
                            inline : 1
                            }, {
                            plugin_url : url
                           });
                    }

                }
                if (context.items.length) {
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
                infourl: 'https://github.com/collective/collective.sweeteditor',
                version: version
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('accordion', tinymce.plugins.AccordionPlugin);
})();
