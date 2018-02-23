
import random
import simplejson as json

import pandas as pd

from copy import deepcopy as copy

from .util import Util


class Params:
    """
    """

    def __init__(self,
                 width=700,
                 height=300,
                 theme='ag-theme-fresh',
                 css_rules=None,
                 quick_filter=False,
                 export_csv=False,
                 export_excel=False,
                 implicit_col_defs=True,
                 index=True,
                 keep_multiindex=True,
                 grid_data=None,
                 grid_options=None,
                 license=None,
                 verbose=False,
                 **kwargs):
        """
        Set params incl. defaults
        """
        # attributes
        self.uuid = random.randint(0, int(1e9))
        self.width = width
        self.height = height + 20
        self.theme = theme
        self.css_rules = css_rules
        self.quick_filter = quick_filter
        self.export_csv = export_csv
        self.export_excel = export_excel
        self.implicit_col_defs = implicit_col_defs
        self.index = index
        self.keep_multiindex = keep_multiindex
        self.grid_data = copy(grid_data)
        self.grid_options = copy(grid_options)
        self.license = license

        # if not self.widthIframe:
        #     self.widthIframe = self.width + 2 * self.borderPx
        # if not self.heightIframe:
        #     isTitle = self.titleText is not None
        #     self.heightIframe = self.height + 30 * isTitle + 50 + 2 * self.borderPx + 5

        self.valid = self.check(verbose=verbose)

        if Util.is_multiindex_df(self.grid_data):
            self.grid_data, self.grid_options = Util.prepare_multiindex_df(self.grid_data,
                                                                           self.grid_options,
                                                                           index=self.index,
                                                                           keep_multiindex=self.keep_multiindex,
                                                                           verbose=verbose)
        elif Util.is_df(self.grid_data):
            self.grid_data, self.grid_options = Util.prepare_singleindex_df(self.grid_data,
                                                                            self.grid_options,
                                                                            index=self.index,
                                                                            verbose=verbose)

        self.grid_options = Util.update_columnTypes(self.grid_options,
                                                    verbose=verbose)

        if self.css_rules is not None:
            self.css_rules = Util.build_css_rules(self.css_rules)

        if self.license is not None:
            self.license = Util.encode_b64(self.license)

        self.grid_data_json = Util.build_data(self.grid_data)
        self.grid_options_json = Util.build_options(self.grid_options)

    def check(self, verbose=False):
        """
        """
        msg = 'width must be a number of pixels'
        assert isinstance(self.width, int), msg

        msg = 'height must be a number of pixels'
        assert isinstance(self.height, int), msg

        msg = 'quick_filter must be a boolean'
        assert isinstance(self.quick_filter, bool), msg

        msg = 'export_csv must be a boolean'
        assert isinstance(self.export_csv, bool), msg

        msg = 'exportExport must be a boolean'
        assert isinstance(self.export_excel, bool), msg

        if self.css_rules is not None:
            msg = 'css_rules must be a string'
            assert isinstance(self.css_rules, str), msg

        li_theme = ['ag-theme-fresh',
                    'ag-theme-dark',
                    'ag-theme-blue',
                    'ag-theme-material',
                    'ag-theme-bootstrap']
        msg = 'theme must be one of {}'.format(li_theme)
        assert self.theme in li_theme, msg

        msg = 'grid_data must be a dict or a dataframe'
        assert isinstance(self.grid_data, (list, pd.core.frame.DataFrame)), msg
        if isinstance(self.grid_data, list):
            for e in self.grid_data:
                msg = 'each element of grid_data must be a dict'
                assert isinstance(e, dict), msg

        if verbose:
            print('data is valid')

        return True

    def to_dict(self):
        """
        """
        d = copy(self.__dict__)
        d = {k: v for k, v in d.items() if v is not None}
        return d

    def pprint(self, indent=2):
        """
        """
        d = json.dumps(self.to_dict(),
                       sort_keys=True,
                       indent=indent)
        print(d)

    def __repr__(self):
        return str(self.to_dict())
