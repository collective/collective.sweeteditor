collective.sweeteditor
======================

TinyMCE (vAPI3) plugin for Plone based on Twitter Bootstrap (3.3.x) markup.
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
* move the cursor before an accordion/collapsable or tabs element and delete things
  with ``<canc>``
* move the cursor after an accordion/collapsable or tabs element and start to delete things
  with ``<back delete>``

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
