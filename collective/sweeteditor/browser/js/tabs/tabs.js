/**
 * Plone snippet Plugin
 *
 * @author Davide Moro (inspired by Maurizio Lupo's redomino.tinymceplugins.snippet)
 */
(function($) {
    var defaultTabsItem, emptyParagraph, tabsItemHeaderSource, tabsItemBodySource,
        tabsItemHeaderTemplate, tabsItemBodyTemplate,
        tabsSource, tabsTemplate, buttons, addTabsCondition, tabsCondition;

    addTabsCondition = function (ed, element) {
        return ! ed.dom.getParent(element, 'div.sweet-tabs');
    };
    tabsCondition = function (ed, element) {
        return ed.dom.getParent(element, 'div.sweet-tabs');
    };

    // buttons
    buttons = [
        ['tabs',
         {title: 'tabs.desc',
          cmd: 'mceTabs',
          image: '/++resource++collective.sweeteditor.img/tabs.gif',
          icon: 'tabs'
         },
         addTabsCondition
        ],
        ['tabsDelete',
         {title: 'tabs.deletedesc',
          cmd: 'mceTabsDelete',
          image: '/++resource++collective.sweeteditor.img/tabs-delete.gif',
          icon: 'tabs-delete'
          },
          tabsCondition
        ],
        ['tabsItemDelete', {
          title: 'tabs.itemdeletedesc',
          cmd: 'mceTabsItemDelete',
          image: '/++resource++collective.sweeteditor.img/tabs-item-delete.gif',
          icon: 'tabs-item-delete'
          },
          tabsCondition
        ],
        ['tabsItemInsertAfter', {
          title: 'tabs.iteminsertafterdesc',
          cmd: 'mceTabsItemInsert',
          ui: true,
          image: '/++resource++collective.sweeteditor.img/tabs-item-insert-after.gif',
          icon: 'tabs-item-insert-after'
          },
          tabsCondition
        ],
        ['tabsItemInsertBefore', {
          title: 'tabs.iteminsertbeforedesc',
          cmd: 'mceTabsItemInsert',
          ui: false,
          image: '/++resource++collective.sweeteditor.img/tabs-item-insert-before.gif',
          icon: 'tabs-item-insert-before'
          },
          tabsCondition
        ]
    ];

    // templates
    defaultTabsItem = {
        header: 'Header',
        body: 'Body'
    };
    emptyParagraph = '<p></p>';
    tabsItemHeaderSource = '<li role="presentation" class="{{#if @first}}active{{/if}}">' +
        '  <a href="#{{random1}}-{{@index}}" aria-controls="{{random1}}-{{@index}}" role="tab" data-toggle="tab">{{header}}</a></li>';
    tabsItemBodySource = '<div role="tabpanel" class="tab-pane {{#if @first}}active{{/if}}" id="{{random1}}-{{@index}}">{{{body}}}</div>';
    tabsSource = emptyParagraph +
        '<div class="sweet-tabs">' +
        '  <ul class="nav nav-tabs" role="tablist">' +
        '    {{#each items}}' +
        '    {{> tabsItemHeader random1=../random1}}' +
        '    {{/each}}' +
        '  </ul>' +
        '  <div class="tab-content">' +
        '    {{#each items}}' +
        '    {{> tabsItemBody random1=../random1}}' +
        '    {{/each}}' +
        '  </div>' +
        '</div>';

    tabsItemHeaderTemplate = Handlebars.compile(tabsItemHeaderSource);
    Handlebars.registerPartial('tabsItemHeader', tabsItemHeaderTemplate);
    tabsItemBodyTemplate = Handlebars.compile(tabsItemBodySource);
    Handlebars.registerPartial('tabsItemBody', tabsItemBodyTemplate);
    tabsTemplate = Handlebars.compile(tabsSource);

    tinymce.PluginManager.requireLangPack('tabs');
    tinymce.create('tinymce.plugins.TabsPlugin', {
        init: function(ed, url) {
            // contextual controls
            ed.onInit.add(function() {
                if (ed && ed.plugins.contextmenu) {
                    ed.plugins.contextmenu.onContextMenu.add(function(plugin, menu, element) {
                        var groupMenu;
                        menu.addSeparator();
                        groupMenu = menu.addMenu({title : 'tabs.group'});
                        tinymce.each(buttons, function (item){
                            var condition;
                            condition = item[2];
                            if (! condition || condition(ed, element)) {
                                groupMenu.add(item[1]);
                            }
                        });
                    });
                }

                // Events
                ed.onKeyDown.add(function(ed, e) {
                    // Prevent undesired tabs markup removals
                    // pressing back delete or canc
                    var range, elem, tabsRoot, textContentLength;

                    if (e.keyCode === 8 || e.keyCode === 46) {
                        range = ed.selection.getRng();
                        elem = ed.selection.getNode();
                        tabsRoot = ed.dom.getParent(elem, '.sweet-tabs');
                        textContentLength = elem.textContent.length;

                        if (tabsRoot &&
                           ((e.keyCode === 8 && range.startOffset === 0) ||
                           (e.keyCode === 46 && range.startOffset === textContentLength))) {
                            e.preventDefault();
                            return false;
                        }
                    }
                });
            });

            // Register commands
            ed.addCommand('mceTabsDelete', function() {
                // remove the whole tabs
                var selected, tabs;

                selected = ed.selection.getNode();
                tabs = ed.dom.getParent(selected, 'div.sweet-tabs');
                ed.dom.remove(tabs);
            });
            ed.addCommand('mceTabsItemDelete', function() {
                // delete the selected tabs item. If it is the last one,
                // the entire tabs will be removed
                var selected, toBeRemoved1, parent1, toBeRemoved2, parent2, index, containerSelectors;

                containerSelectors = '.nav-tabs,.tab-content';

                selected = ed.selection.getNode();
                toBeRemoved1 = ed.dom.getParent(selected, '.nav-tabs li,.tab-pane');
                if (toBeRemoved1) {
                    parent1 = ed.dom.getParent(toBeRemoved1, '.nav-tabs,.tab-content');
                    if (parent1) {
                        parent2 = ed.dom.getNext(parent1, containerSelectors) || ed.dom.getPrev(parent1, containerSelectors);
                        if (parent2) {
                            index = ed.dom.nodeIndex(toBeRemoved1);
                            toBeRemoved2 = parent2.childNodes[index];
                            if (toBeRemoved2) {
                                ed.dom.remove(toBeRemoved1);
                                ed.dom.remove(toBeRemoved2);
                            }
                        }
                    }
                }
            });
            ed.addCommand('mceTabsItemInsert', function(after) {
                return;
                // insert another tabs, after or before the selected item
                var selected, randomString1, randomString2, context, html, tabsItem, el;

                selected = ed.selection.getNode();
                tabsItem = ed.dom.getParent(selected, 'div.panel');
                tabsParent = ed.dom.getParent(tabsItem, 'div.panel-group');
                randomString1 = tabsParent.id.replace('-tabs', '');
                randomString2 = Math.floor(10000 * (Math.random() % 1)).toString();
                context = {};
                context.header = defaultTabsItem.header;
                context.body = defaultTabsItem.body;
                context.random1 = randomString1;
                context.random2 = randomString2;
                html = tabsItemTemplate(context);
                el = ed.dom.create('div');
                if (after) {
                    ed.dom.insertAfter(el, tabsItem);
                } else {
                    tabsParent.insertBefore(el, tabsItem);
                }
                ed.dom.setOuterHTML(el, html);

                if (!after && ed.dom.hasClass(tabsItem.lastChild, 'in')) {
                    // if the current tabs item is the first one and we are
                    // prepending another tabs item, we need to toggle the
                    // "in" class
                    ed.dom.removeClass(tabsItem.lastChild, 'in');
                    ed.dom.addClass(tabsParent.firstChild.lastChild, 'in');
                }
            });

            // Handle node change updates
            ed.onNodeChange.add(function(ed, cm, n) {
                // disable toolbar's buttons depending on the current selection
                tinymce.each(buttons, function (item) {
                    cm.setDisabled(item[0], !item[2](ed, n));
                });
            });

            ed.addCommand('mceTabs', function(length) {
                // add tabs
                var selected, $selected, selectedContent, content,
                    $selectedChildren, template,
                    context, html, index,
                    randomString1 = Math.floor(10000 * (Math.random() % 1)).toString(),
                    randomString2 = Math.floor(10000 * (Math.random() % 1)).toString();
                context = {
                    items: [],
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
                            itemsLength = context.items.length,
                            lastItemIndex = itemsLength ? itemsLength - 1 : 0;
                        if (odd) {
                            // we use the header template
                            if (text) {
                                context.items.push({
                                    header: text
                                });
                            }
                        } else {
                            // we use the body template
                            if (!context.items[lastItemIndex].body) {
                                context.items[lastItemIndex].body = $this.get(0).innerHTML;
                            }
                        }
                    });
                } else {
                    // no selection
                    if (arguments[1] !== undefined) {
                        for (var index=0; index <arguments[1]; index++) {
                            context.items.push(defaultTabsItem);
                        }
                    } else {
                        ed.windowManager.open({
                            file : url + '/tabs.html',
                            width : 430 + parseInt(ed.getLang('media.delta_width', 0)),
                            height : 500 + parseInt(ed.getLang('media.delta_height', 0)),
                            inline : 1
                            }, {
                            plugin_url : url
                           });
                    }

                }
                if (context.items.length) {
                    html = tabsTemplate(context);
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
                longname: 'Tabs Plugin',
                author: 'Davide Moro (@ Abstract srl for EEA)',
                authorurl: 'http://davidemoro.blogspot.it/',
                infourl: 'https://github.com/davidemoro/collective.sweeteditor',
                version: "0.1"
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('tabs', tinymce.plugins.TabsPlugin);
})(jQuery);
