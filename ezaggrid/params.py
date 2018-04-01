
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
                 grid_options_multi=None,
                 license=None,
                 hide_grid=False,
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
        self.grid_data_in = copy(grid_data)
        self.grid_data = None
        self.grid_options = copy(grid_options)
        self.grid_options_multi = copy(grid_options_multi)
        self.license = license
        self.hide_grid = hide_grid

        # if not self.widthIframe:
        #     self.widthIframe = self.width + 2 * self.borderPx
        # if not self.heightIframe:
        #     isTitle = self.titleText is not None
        #     self.heightIframe = self.height + 30 * isTitle + 50 + 2 * self.borderPx + 5

        self.valid = self.check(verbose=verbose)

        if self.css_rules is not None:
            self.css_rules = Util.build_css_rules(self.css_rules)

        if self.license is not None:
            self.license = Util.encode_b64(self.license)

        self.is_grid_options_multi = True if grid_options_multi is not None else False
        self.is_grid_options_multi = int(self.is_grid_options_multi)

        if self.is_grid_options_multi:
            grid_options_multi_2 = []
            for name, options in self.grid_options_multi:
                self.grid_data, options_2 = self.preprocess_input(
                    self.grid_data_in,
                    options,
                    index=self.index,
                    keep_multiindex=self.keep_multiindex,
                    verbose=verbose)
                grid_options_multi_2.append((name, options_2))
            self.grid_options_multi = grid_options_multi_2

        else:
            self.grid_data, self.grid_options = self.preprocess_input(
                self.grid_data_in,
                self.grid_options,
                index=self.index,
                keep_multiindex=self.keep_multiindex,
                verbose=verbose)


        self.grid_data_json = Util.build_data(self.grid_data)

        if self.is_grid_options_multi:
            self.grid_options_multi_json = Util.build_options({'data': self.grid_options_multi})
            # self.grid_options_multi_json = Util.build_options(self.grid_options_multi)
            # print(self.grid_options_multi_json)
        else:
            self.grid_options_json = Util.build_options(self.grid_options)
            # print(self.grid_options_json)



    def preprocess_input(self,
                         grid_data,
                         grid_options,
                         index,
                         keep_multiindex,
                         verbose=False):
        """
        """
        if Util.is_multiindex_df(grid_data):
            grid_data_2, grid_options_2 = Util.prepare_multiindex_df(
                grid_data,
                grid_options,
                index=index,
                keep_multiindex=keep_multiindex,
                verbose=verbose)

        elif Util.is_df(grid_data):
            grid_data_2, grid_options_2 = Util.prepare_singleindex_df(
                grid_data,
                grid_options,
                index=index,
                verbose=verbose)

        else:
            grid_options_2 = grid_options

        grid_options_2 = Util.update_columnTypes(
            grid_options_2,
            verbose=verbose)

        return grid_data_2, grid_options_2

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

        msg = 'export_excel must be a boolean'
        assert isinstance(self.export_excel, bool), msg

        msg = 'hide_grid must be a boolean'
        assert isinstance(self.hide_grid, bool), msg

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
        assert isinstance(self.grid_data_in, (list, pd.core.frame.DataFrame)), msg
        if isinstance(self.grid_data_in, list):
            msg = 'each element of grid_data must be a dict'
            for e in self.grid_data_in:
                assert isinstance(e, dict), msg

        msg = 'both grid_options and grid_options_multi cannot be set'
        assert (self.grid_options is None) or (self.grid_options_multi is None), msg

        msg = 'one exactly of grid_options or grid_options_multi mut be set'
        assert not((self.grid_options is None) and (self.grid_options_multi is None)), msg

        if self.grid_options is not None:
            msg = 'grid_options must be a dict'
            assert isinstance(self.grid_options, dict), msg

        if self.grid_options_multi is not None:
            msg = 'grid_options_multi must be a list or tuple'
            assert isinstance(self.grid_options_multi, (list, tuple)), msg
            msg1 = 'each element of grid_options_multi must be a list or tuple of length 2'
            msg2 = 'in each grid_options_multi element of length 2, the first one must be a string'
            msg3 = 'in each grid_options_multi element of length 3, the second one must be a dict'
            for e in self.grid_options_multi:
                assert isinstance(e, (list, tuple)) and len(e) == 2, msg1
                assert isinstance(e[0], str), msg2
                assert isinstance(e[1], dict), msg3

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
