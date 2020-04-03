#!/usr/bin/env python3

"""
Script description
"""

import os
import argparse
from os.path import devnull

import colorama
import sys
import subprocess
from termcolor import colored

version = "1.0"

"""Zeigt die Commands nur an - führt sie aber nicht aus"""
dry_run = False

APPNAME = os.path.basename(__file__)
SCRIPT = os.path.realpath(__file__)
SCRIPT_PATH = os.path.dirname(SCRIPT)
WORKING_DIR = os.getcwd()
PROPS_FILE = os.path.splitext(APPNAME)[0].lower() + ".properties"


# ------------------------------------------------------------------------------
# Functions
#

def call_bash_command(param):
    """ Sample
    :param param: Sample param
    """

    print("My param: {}, current dir: {}".format(param, os.curdir))

    # result = 1
    result = execute(param)
    print("Result of '{param}' was {result}".format(param=param, result=result))


def show_script_infos():
    """ Zeigt einige Infos zum Script an"""

    print("AppName:          {}".format(APPNAME))
    print("Script:           {}".format(SCRIPT))
    print("Script-Pfad:      {}".format(SCRIPT_PATH))
    print("Working Dir:      {}".format(WORKING_DIR))
    print("Properties File:  {}".format(PROPS_FILE))


def execute(command, suppress_error=False, check_for_dry_run=True):
    if type(command) is list:
        params = command
    else:
        params = command.split(" ")

    if check_for_dry_run and dry_run:
        print(" ".join(params))
        return 0

    else:
        stderr = sys.stderr
        stdout = sys.stdout

        if suppress_error:
            stderr = subprocess.DEVNULL
            stdout = subprocess.DEVNULL

        try:
            return subprocess.run(params, stdout=stdout, stderr=stderr).returncode

        except FileNotFoundError:
            return -1


# ------------------------------------------------------------------------------
# Options
#

def main():
    """ Main erledigt nur das Eingabehandling
    """

    epilog = """Example:
    \tmyscript -h - Shows {help}-Info!""".format(
        help=colored('{}'.format("Help"), "green"))

    parser = argparse.ArgumentParser(
        description='Template for future scripts ({})'.format(
            colored('v{}'.format(version), "green")),

        epilog=epilog, formatter_class=argparse.RawTextHelpFormatter)

    parser.add_argument('param', nargs='*',
                        help='Add this param for demonstration')

    parser.add_argument('-i', '--info', action='store_true',
                        help='Shows Script infos')

    parser.add_argument('--dry-run', action='store_true', dest='dry_run',
                        help='Does nothing, only shows cmdline output')

    args = parser.parse_args()

    if args.info:
        show_script_infos()
        return

    if not args or len(sys.argv) == 1 or args.param is None:
        parser.print_help()
        parser.exit()
        return

    global dry_run
    dry_run = args.dry_run

    if args.param is not None and len(args.param) != 0:
        call_bash_command(args.param[0])
        return


# -----------------------------------------------------------------------------
if __name__ == "__main__":
    # Damit das Ganze auch unter Windows funktioniert!
    colorama.init()
    main()
