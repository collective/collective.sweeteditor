/**
 * Plone snippet Plugin
 *
 * @author Davide Moro (inspired by Maurizio Lupo's redomino.tinymceplugins.snippet)
 */
(function($) {
    // tinymce.PluginManager.requireLangPack('accordion');
    tinymce.create('tinymce.plugins.AccordionPlugin', {
        init: function(ed, url) {
            // Register commands
            ed.addCommand('mceAccordion', function() {
                var selected, $selected, selectedContent, content,
                    $selectedChildren, template,
                    context, html,
                    context = {
                        panels: []
                    },
                    defaultHeader = {
                        header: 'Header',
                        body: 'Body'
                    },
                    emptyParagraph = '<p></p>',
                    source = '<div class="panel-group" role="tablist">' +
                    '  {{#each panels}}' +
                    '  <div class="panel panel-default">' +
                    '    <div class="panel-heading" role="tab">' +
                    '      <h4 class="panel-title">' +
                    '        <a role="button" data-toggle="collapse">' +
                    '          {{{header}}}' +
                    '        </a>' +
                    '      </h4>' +
                    '    </div>' +
                    '    <div class="panel-collapse collapse {{#if @first}}in{{/if}}" role="tabpanel">' +
                    '      <div class="panel-body">' +
                    '        {{{body}}}' +
                    '      </div>' +
                    '    </div>' +
                    '  </div>' +
                    '  {{/each}}' +
                    '</div>';
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
                                odd = index % 2 === 0;
                            if (odd) {
                                // we use the header template
                                if (text) {
                                    context.panels.push({
                                        header: text
                                    });
                                }
                            } else {
                                // we use the body template
                                if (!context.panels[context.panels.length - 1].body) {
                                    context.panels[context.panels.length - 1].body = $this.get(0).innerHTML;
                                }
                            }
                        });
                } else {
                    // no selection
                    context.panels.push(defaultHeader);
                }
                if (context.panels.length) {
                    html = template(context);
                    content = emptyParagraph +
                        html +
                        emptyParagraph;
                    ed.execCommand('mceInsertContent', false, content);
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