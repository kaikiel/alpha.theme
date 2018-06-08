# -*- coding: utf-8 -*-
"""Setup tests for this package."""
from plone import api
from plone.app.testing import setRoles
from plone.app.testing import TEST_USER_ID
from alpha.theme.testing import ALPHA_THEME_INTEGRATION_TESTING  # noqa

import unittest


class TestSetup(unittest.TestCase):
    """Test that alpha.theme is properly installed."""

    layer = ALPHA_THEME_INTEGRATION_TESTING

    def setUp(self):
        """Custom shared utility setup for tests."""
        self.portal = self.layer['portal']
        self.installer = api.portal.get_tool('portal_quickinstaller')

    def test_product_installed(self):
        """Test if alpha.theme is installed."""
        self.assertTrue(self.installer.isProductInstalled(
            'alpha.theme'))

    def test_browserlayer(self):
        """Test that IAlphaThemeLayer is registered."""
        from alpha.theme.interfaces import (
            IAlphaThemeLayer)
        from plone.browserlayer import utils
        self.assertIn(IAlphaThemeLayer, utils.registered_layers())


class TestUninstall(unittest.TestCase):

    layer = ALPHA_THEME_INTEGRATION_TESTING

    def setUp(self):
        self.portal = self.layer['portal']
        self.installer = api.portal.get_tool('portal_quickinstaller')
        roles_before = api.user.get_roles(username=TEST_USER_ID)
        setRoles(self.portal, TEST_USER_ID, ['Manager'])
        self.installer.uninstallProducts(['alpha.theme'])
        setRoles(self.portal, TEST_USER_ID, roles_before)

    def test_product_uninstalled(self):
        """Test if alpha.theme is cleanly uninstalled."""
        self.assertFalse(self.installer.isProductInstalled(
            'alpha.theme'))

    def test_browserlayer_removed(self):
        """Test that IAlphaThemeLayer is removed."""
        from alpha.theme.interfaces import \
            IAlphaThemeLayer
        from plone.browserlayer import utils
        self.assertNotIn(
            IAlphaThemeLayer,
            utils.registered_layers(),
        )
