collective.sweeteditor
======================

TinyMCE (vAPI3) plugin for Plone (v4.x) based on Twitter Bootstrap (3.3.x) markup.
Basically it adds a set of new TinyMCE commands in order to manage the
following Twitter elements:

* accordions, vertical stacked list with exactly one or zero expanded items at the same time
* collapsable, vertical stacked list with more than one items expanded at the same time
* tabs

How to manage accordions or tabs:

* add new accordion/collapsable/tabs

  * click on the ``Create new accordion/collapsable/tabs button``
    and choose the accordion/collapsable/tabs length
  * select one or more paragraphs and click on
    the ``Create new accordion/collapsable/tabs button``. Each selected
    paragraph will be converted to header or body
    elements
* manage existing accordion/collapsable/tabs.
  There are both buttons and contextual menus (right click),
  depending on the selected node one or more buttons could
  be disabled or not shown:

  * ``Remove entire accordion/collapsable/tab``
  * ``Remove accordion/collapsable/tab item``
  * ``Insert new accordion/collapsable/tab item up``
  * ``Insert new accordion/collapsable/tab item down``

The initialization based on text selection only makes
sense for simple markup like the following:

.. code-block:: html

    <p>header1</p>
    <p>body1</p>
    <p>header2</p>
    <p>body2</p>

Special notes
=============

The plugin tries to protect bootstrap markup against unwanted deletion and
it tries to prevent broken markup but TinyMCE is still an editor so it is
always possible to break things.

This plugin offers the following protection against:

* markup removal when pressing ``<canc>`` or ``<back delete>`` keys
* protect inserting content in areas where anything should be inserted
* prevent adding a tab inside a tab (button conditions)
* move the cursor before an accordion/collapsable or tabs element and delete things with ``<canc>``
* move the cursor after an accordion/collapsable or tabs element and start to delete things with ``<back delete>``

So you should consider ``collective.sweeteditor`` as a useful editor plugin
if you want to manage accordions, collapsables or tabs inside a rich text
editor but be prepared to play with HTML source code in case you broke something.
Nothing wrong with ``collective.sweeteditor``, it is just because it is impossible
to prevent all situations. Even with a plain ``TinyMCE`` instance sometimes it happens
the need to change things in HTML mode.

You can broke things in several ways, for example:

* copy and paste a tab inside a tab
* copy and paste complex html inside a header (where obviously Bootstrap supposes there
  should be only a simple string)
* probably there are other ways to broke things

Install
=======

* Add ``collective.sweeteditor`` to your eggs section in your buildout and re-run buildout.
* Install ``collective.sweeteditor`` within ``Site Setup > Add-ons``

By default collective.sweeteditor does not install the Twitter Bootstrap Javascript and css, so
it's up to you enabling Twitter Bootstrap in your Diazo theme.

If you want to enable Twitter Bootstrap you can install the optional
profile ``collective.sweeteditor optional bootstrap (Enable twitter bootstrap)``.

Generated markup
================

Accordion
---------
.. code-block:: html

    <div aria-multiselectable="true" class="panel-group" id="8466-accordion"
    role="tablist">
      <div class="panel panel-default">
        <div class="panel-heading" id="8466-37230-heading" role="tab">
          <h4 class="panel-title"><a aria-controls="8466-37230-body" data-parent=
          "#8466-accordion" data-toggle="collapse" href="#8466-37230-body" role=
          "button">Header 1</a></h4>
        </div>
        <div aria-labelledby="8466-37230-heading" class=
        "panel-collapse collapse in" id="8466-37230-body" role="tabpanel">
          <div class="panel-body">
            <p>Body 1</p>
          </div>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading" id="8466-37231-heading" role="tab">
          <h4 class="panel-title"><a aria-controls="8466-37231-body" data-parent=
          "#8466-accordion" data-toggle="collapse" href="#8466-37231-body" role=
          "button">Header 1</a></h4>
        </div>
        <div aria-labelledby="8466-37231-heading" class="panel-collapse collapse"
        id="8466-37231-body" role="tabpanel">
          <div class="panel-body">
            <p>Body 2</p>
          </div>
        </div>
      </div>
    </div>

Collapsable
-----------
.. code-block:: html

    <div aria-multiselectable="true" class="panel-group sweet-collapsable" id=
    "5973-accordion" role="tablist">
      <div class="panel panel-default">
        <div class="panel-heading" id="5973-11350-heading" role="tab">
          <h4 class="panel-title"><a aria-controls="5973-11350-body" data-toggle=
          "collapse" href="#5973-11350-body" role="button">Header 1</a></h4>
        </div>
        <div aria-labelledby="5973-11350-heading" class=
        "panel-collapse collapse in" id="5973-11350-body" role="tabpanel">
          <div class="panel-body">
            <p>Body 1</p>
          </div>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading" id="5973-11351-heading" role="tab">
          <h4 class="panel-title"><a aria-controls="5973-11351-body" data-toggle=
          "collapse" href="#5973-11351-body" role="button">Header 1</a></h4>
        </div>
        <div aria-labelledby="5973-11351-heading" class="panel-collapse collapse"
        id="5973-11351-body" role="tabpanel">
          <div class="panel-body">
            <p>Body 2</p>
          </div>
        </div>
      </div>
    </div>

Tabs
----
.. code-block:: html

    <div class="sweet-tabs">
      <ul class="nav nav-tabs" role="tablist">
        <li class="active" role="presentation">
          <a aria-controls="8571-0" data-toggle="tab" href="#8571-0" role=
          "tab">Header 1</a>
        </li>
        <li role="presentation">
          <a aria-controls="8571-1" data-toggle="tab" href="#8571-1" role=
          "tab">Header 2</a>
        </li>
      </ul>
      <div class="tab-content">
        <div class="tab-pane active" id="8571-0" role="tabpanel">
          <p>Body 1</p>
        </div>
        <div class="tab-pane" id="8571-1" role="tabpanel">
          <p>Body 2</p>
        </div>
      </div>
    </div>

Copyright and license
=====================
The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

The EEA Tags (the Original Code) is free software;
you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation;
either version 2 of the License, or (at your option) any later
version.

Contributor(s)
--------------
- Davide Moro (Abstract)
- Tiberiu Ichim (Eau de Web)

Funding
=======

EEA_ - European Enviroment Agency (EU)

.. _EEA: http://www.eea.europa.eu/
