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
        return ! ed.dom.getParent(element, '.sweet-tabs') && ! ed.dom.getParent(element, '.panel-heading') && ! ed.dom.getParent(element, '.nav-tabs');
    };
    tabsCondition = function (ed, element) {
        return ed.dom.getParent(element, '.sweet-tabs');
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
        '</div>' + emptyParagraph;

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
                        if (! ed.dom.getParent(element, '.panel-heading')) {
                            // Don't add the tabs contextmenu if we are
                            // inside an accordion/collapsable header
                            if (ed.dom.getParent(element, '.nav-tabs')) {
                                menu.removeAll();
                            } else {
                                menu.addSeparator();
                            }
                            groupMenu = menu.addMenu({title : 'tabs.group'});
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
                    var range, elem, tabsRootSelector, textContentLength, keyCode, moveKeys;

                    keyCode = e.keyCode;
                    tabsRootSelector = '.sweet-tabs';
                    moveKeys = [37, 38, 39, 40];
                    elem = ed.selection.getNode();

                    // Prevent edit where it shouldn't be possible (mceNotEditable/mceEditable doesn't
                    // work on older versions of TinyMCE)
                    if (ed.dom.getParent(elem, tabsRootSelector)) {
                        if (moveKeys.indexOf(keyCode) === -1) {
                            // Ignore movement keys (arrows)
                            if (ed.dom.getParent(elem, '.nav-tabs li a') || ed.dom.getParent(elem, '.tab-pane')) {
                                // Prevent element duplication due to "return" key or undesired
                                // editing in not allowed areas (mceNonEditable does not work as
                                // expected on this particular version).
                                if (keyCode === 13) {
                                    if (! e.shiftKey) {
                                        if (ed.dom.getParent(elem, tabsRootSelector)) {
                                            return tinymce.dom.Event.cancel(e);
                                        }
                                    } else {
                                        // we should prevent shift+enter if we are inside of .panel-heading
                                        if (ed.dom.getParent(elem, '.nav-tabs')) {
                                            return tinymce.dom.Event.cancel(e);
                                        }
                                    }
                                }
                                // Prevent undesired tabs markup removals
                                // pressing back delete or canc
                                if (keyCode === 8 || keyCode === 46) {
                                    range = ed.selection.getRng();
                                    textContentLength = elem.textContent.length;
            
                                    if (ed.dom.getParent(elem, tabsRootSelector) &&
                                       ((keyCode === 8 && range.startOffset === 0) ||
                                       (keyCode === 46 && range.startOffset === textContentLength))) {
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
            ed.addCommand('mceTabsDelete', function() {
                // remove the whole tabs
                var selected, tabs;

                selected = ed.selection.getNode();
                tabs = ed.dom.getParent(selected, '.sweet-tabs');
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
                // insert another tabs, after or before the selected item
                var selected, randomString1, context, htmlHeader, htmlBody,
                    parent1, parent2, tabsItem1, tabsItem2, index, el1, el2, swap, containerSelectors;

                containerSelectors = '.nav-tabs,.tab-content';
                selected = ed.selection.getNode();
                parent1 = ed.dom.getParent(selected, containerSelectors);
                if (parent1) {
                    parent2 = ed.dom.getNext(parent1, containerSelectors) || ed.dom.getPrev(parent1, containerSelectors);
                    if (parent2) {
                        if (! ed.dom.hasClass(parent1, 'nav-tabs')) {
                            // parent1 -> header container
                            // parent2 -> body container
                            swap = parent2;
                            parent2 = parent1;
                            parent1 = swap;
                            tabsItem2 = ed.dom.getParent(selected, '.tab-pane');
                            index = ed.dom.nodeIndex(tabsItem2);
                            tabsItem1 = parent1.childNodes[index];
                        } else {
                            tabsItem1 = ed.dom.getParent(selected, '.nav-tabs li');
                            index = ed.dom.nodeIndex(tabsItem1);
                            tabsItem2 = parent2.childNodes[index];
                        }
                        randomString1 = Math.floor(10000 * (Math.random() % 1)).toString();
                        context = {};
                        context.header = defaultTabsItem.header;
                        context.body = defaultTabsItem.body;
                        context.random1 = randomString1;
                        htmlHeader = tabsItemHeaderTemplate(context);
                        htmlBody = tabsItemBodyTemplate(context);
                        el1 = ed.dom.create('div');
                        el2 = ed.dom.create('div');
                        if (after) {
                            ed.dom.insertAfter(el1, tabsItem1);
                            ed.dom.insertAfter(el2, tabsItem2);
                        } else {
                            parent1.insertBefore(el1, tabsItem1);
                            parent2.insertBefore(el2, tabsItem2);
                        }
                        ed.dom.setOuterHTML(el1, htmlHeader);
                        ed.dom.setOuterHTML(el2, htmlBody);

                        if (!after && ed.dom.hasClass(tabsItem1, 'active')) {
                            // if the current tabs item is the first one and we are
                            // prepending another tab item, we need to toggle the
                            // "active" class
                            ed.dom.removeClass(tabsItem1, 'active');
                            ed.dom.removeClass(tabsItem2, 'active');
                            ed.dom.addClass(parent1.firstChild, 'active');
                            ed.dom.addClass(parent2.firstChild, 'active');
                        }
                    }
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
                    context, html, index, iter,
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

                    if ($selected.is('p,table,b,a,br')) {
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
                    $selectedChildren = $selected.children();
                    $selectedChildren.each(function(index) {
                        var $this = $(this),
                            text = $this.text(),
                            odd = index % 2 === 0,
                            itemsLength = context.items.length,
                            lastItemIndex = itemsLength ? itemsLength - 1 : 0;
                        if (odd) {
                            // we use the header template
                            context.items.push({
                                header: text ? text : 'Header'
                            });
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
                        for (iter=0; iter<arguments[1]; iter++) {
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
