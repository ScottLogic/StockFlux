from json import load, dump
from os.path import dirname, realpath, abspath, join
from os import environ
import sys


def load_package_json(path):
    """
    Load the given package.json file into a dict.
    """
    with open(path, 'r') as file:
        return load(file)


def write_package_json(path, package):
    """
    Write the given package dict into JSON using the path provided.
    """
    with open(path, 'w') as file:
        dump(package, file, indent=2)


modules = sys.argv[1:]
base_path = dirname(dirname(abspath(__file__)))
if 'CIRCLE_BUILD_NUM' in environ.keys() and len(modules) > 0:
    # Get the build number from the CIRCLE_BUILD_NUM environment variable.
    build_number = environ['CIRCLE_BUILD_NUM']

    # Load the root package.json file and extract its version.
    root_path = realpath(join(base_path, modules[0], 'package.json'))
    root_package = load_package_json(root_path)
    version = root_package['version'] + '.' + build_number

    # Update the root package.json
    root_package['version'] = version
    write_package_json(root_path, root_package)

    # Update the package.json of each of the modules with the new version.
    for module in modules[1:]:
        module_path = join(base_path, module, 'package.json')
        module_package = load_package_json(module_path)
        module_package['version'] = version
        write_package_json(module_path, module_package)

    # Output the new version to the terminal so that it can be captured.
    print(version)
else:
    raise ValueError(
        "Build number expected as CIRCLE_BUILD_NUM environment variable"
    )