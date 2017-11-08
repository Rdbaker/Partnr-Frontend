# -*- coding: utf-8 -*-

"""\
© Copyright 2016, Partnr. All rights reserved.
"""
from deploy import upload as deploy_upload


def upload():
    deploy_upload(['--environment', 'production', '--gitref', 'production'])
