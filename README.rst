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
