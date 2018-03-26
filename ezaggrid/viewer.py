
import os

from IPython.display import display, HTML

from .params import Params
from .template import Template


class AgGrid:
    """
    """

    def __init__(self,
                 width=None,
                 height=None,
                 theme=None,
                 css_rules=None,
                 quick_filter=None,
                 export_csv=None,
                 export_excel=None,
                 implicit_col_defs=None,
                 index=None,
                 keep_multiindex=None,
                 grid_data=None,
                 grid_options=None,
                 license=None,
                 iframe=False,
                 hide_grid=False,
                 verbose=False):

        dic = {'width': width,
               'height': height,
               'theme': theme,
               'css_rules': css_rules,
               'quick_filter': quick_filter,
               'export_csv': export_csv,
               'export_excel': export_excel,
               'index': index,
               'keep_multiindex': keep_multiindex,
               'implicit_col_defs': implicit_col_defs,
               'grid_data': grid_data,
               'grid_options': grid_options,
               'license': license,
               'hide_grid': hide_grid,
               'verbose': verbose
               }
        dic = { k: v for k, v in dic.items() if v is not None}

        self.params = Params(**dic)

        self.template = Template(params=self.params,
                                 iframe=iframe)

        self.html = self.template.content

    def show(self):
        """
        display image tabs
        """
        display(HTML(self.html))

    def export_data(self):
        return self.params.grid_data

    def export_options(self):
        return self.params.grid_options
