import sys

import json

from deriva.core import ErmrestCatalog, AttrDict, get_credential, DEFAULT_CREDENTIAL_FILE, tag, urlquote, DerivaServer, get_credential, BaseCLI

from deriva.core.ermrest_model import builtin_types, Schema, Table, Column, Key, ForeignKey

from deriva.core import urlquote, urlunquote

from deriva.chisel import Model, Schema, Table, Column, Key, ForeignKey, builtin_types

cred = get_credential('dev.eye-ai.org')

print(cred)

catalog = ErmrestCatalog('https', 'dev.eye-ai.org', 'eye-ai',cred)