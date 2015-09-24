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
    return valid_elements
