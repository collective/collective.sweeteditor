from setuptools import find_packages, setup

version = '0.4.dev1'

setup(name='collective.sweeteditor',
      version=version,
      description="TinyMCE style hooks for accordion and tabs",
      long_description=open("README.rst").read() + "\n" +
      open("CHANGES.rst").read(),
      # Get more strings from
      # http://pypi.python.org/pypi?:action=list_classifiers
      classifiers=[
          "Framework :: Plone",
          "Programming Language :: Python",
      ],
      keywords='',
      author='Davide Moro',
      author_email='davide.moro@gmail.com',
      url='https://github.com/davidemoro/collective.sweeteditor',
      license='GPL',
      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['collective'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          # -*- Extra requirements: -*-
      ],
      extras_require={
          'bootstrap': ['plone.app.jquery>=1.9.1'],
      },
      entry_points="""
      # -*- Entry points: -*-

      [z3c.autoinclude.plugin]
      target = plone
      """,
      )
