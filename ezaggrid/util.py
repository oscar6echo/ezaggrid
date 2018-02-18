
import os
import re
import collections
import base64

import datetime as dt
import pandas as pd


def json_serial(obj):
    """
    """
    if isinstance(obj, (dt.datetime, dt.date, pd.Timestamp)):
        return obj.isoformat()

    return obj


# def strip_comments(code):
#     if code.startswith('function'):
#         print(code)
#     lines = code.split('\n')
#     if code.startswith('function'):
#         print(lines)
#     lines = [e.strip() for e in lines]
#     if code.startswith('function'):
#         print(lines)
#     lines = [e for e in lines if not e.startswith('//')]
#     if code.startswith('function'):
#         print(lines)
#     code = '\n'.join(lines)
#     if code.startswith('function'):
#         print(code)

#     return code


def strip_comments(code):
    lines = code.split('\n')
    lines = [e.strip() for e in lines]
    lines = [e for e in lines if not e.startswith('//')]
    code = '\n'.join(lines)
    return code


def sanitize_str(string):
    string2 = strip_comments(string)
    string2 = string2.replace('\n', '')
    string2 = string2.replace('\t', ' ')
    string2 = string2.replace('\"', '\'')
    return string2


def sanitize_struct(e):
    #     print('\n', type(e), '\n', e)
    if isinstance(e, list):
        return [sanitize_struct(sub_e) for sub_e in e]
    elif isinstance(e, dict):
        return {k: sanitize_struct(v) for k, v in e.items()}
    elif isinstance(e, str):
        return sanitize_str(e)
    else:
        return e


def update_columnDefs(df, grid_options):
    colDefs = grid_options.get('columnDefs', [])
    li_field = []
    for colDef in colDefs:
        field = colDef.get('field')
        li_field.append(field)
        if field:
            if field in df.columns:
                dic = colDef
                col = df[field]
                if col.dtype.kind in 'O':
                    # string
                    dic['type'] = 'textColumn'
                if col.dtype.kind in 'ifc':
                    # number
                    dic['type'] = 'numberColumn'
                if col.dtype.kind in 'M':
                    # date
                    dic['type'] = 'dateColumn'
    for c in df.columns:
        if c not in li_field:
            dic = {}
            col = df[c]
            if col.dtype.kind in 'O':
                # string
                dic['type'] = 'textColumn'
            if col.dtype.kind in 'ifc':
                # number
                dic['type'] = 'numberColumn'
            if col.dtype.kind in 'M':
                # date
                dic['type'] = 'dateColumn'
            colDefs.append(dic)
    grid_options['columnDefs'] = colDefs
    return grid_options


def update_columnTypes(grid_options):
    columnTypes = grid_options.get('columnTypes', {})

    numberColumn = {
        'filter': 'agNumberColumnFilter'
    }
    if not 'numberColumn' in columnTypes:
        columnTypes['numberColumn'] = numberColumn

    textColumn = {
        'filter': 'agTextColumnFilter'
    }
    if not 'textColumn' in columnTypes:
        columnTypes['textColumn'] = textColumn

    dateColumn = {
        'valueFormatter': 'helpers.dateFormatter',
        'filter': 'agDateColumnFilter',
        'filterParams': {
            'comparator': 'helpers.compareDates'
        }
    }
    if not 'dateColumn' in columnTypes:
        columnTypes['dateColumn'] = dateColumn

    grid_options['columnTypes'] = columnTypes
    return grid_options


def build_css_rules(css_rules):
    css_rules = re.findall(r'[^\{]+\{[^\}]*\}',
                           css_rules,
                           re.MULTILINE)
    css_rules = [sanitize_str(e) for e in css_rules]
    return css_rules


def get_license(filename='.ag_grid_license'):
    path = os.path.join(os.path.expanduser('~'), filename)
    with open(path, 'r') as f:
        license = f.read()
    return license

def encode_b64(string):
    return base64.b64encode(bytes(string, 'utf-8')).decode('utf-8')

