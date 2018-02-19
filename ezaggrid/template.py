
import sys
import os
import re
import jinja2 as jj

from .params import Params


class Template:
    """
    """

    def __init__(self,
                 params=None,
                 iframe=True):
        """
        """

        dir_file = os.path.dirname(os.path.abspath(__file__))
        dir_template = os.path.join(dir_file, 'templates')

        loader = jj.FileSystemLoader(dir_template)

        env = jj.Environment(loader=loader,
                             variable_start_string='__$',
                             variable_end_string='$__',
                             block_start_string='{-%',
                             block_end_string='%-}'
                             )

        if iframe:
            template_name = 'iframe.tpl.html'
        else:
            template_name = 'main.tpl.html'

        template = env.get_template(template_name)

        msg = 'params must be an instance of Param'
        assert isinstance(params, Params), msg
        data = params.to_dict()

        self.content = template.render(data=data)

        # with open('index.html', 'w') as f:
        #     f.write(self.content)
