from Products.TinyMCE.utility import TinyMCE

_original_getValidElements = TinyMCE.getValidElements


def getValidElements(self):
    valid_elements = _original_getValidElements(self)
    div_options = valid_elements.get('div', [])
    div_options.extend(['role',
                        'aria-multiselectable',
                        'aria-labelledby',
                        'aria-expanded',
                        'aria-controls',
                        ])
    a_options = valid_elements.get('a', [])
    a_options.extend(['role',
                      'aria-controls',
                      ])
    ul_options = valid_elements.get('ul', [])
    ul_options.extend(['role'])
    li_options = valid_elements.get('li', [])
    li_options.extend(['role'])
    return valid_elements
