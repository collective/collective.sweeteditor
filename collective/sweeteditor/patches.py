from Products.TinyMCE.utility import TinyMCE

_original_getValidElements = TinyMCE.getValidElements


def getValidElements(self):
    conf = {
        'div': ['role',
                'aria-multiselectable',
                'aria-labelledby',
                'aria-expanded',
                'aria-controls',
                ],
        'a': ['role',
              'aria-controls',
              ],
        'ul': ['role'],
        'li': ['role'],
    }
    valid_elements = _original_getValidElements(self)
    for key, attrs in conf.items():
        options = valid_elements.get(key, [])
        options.extend(attrs)
    return valid_elements
