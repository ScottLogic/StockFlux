#!/usr/bin/env bash
set -eo pipefail

# Check for release branch - not using grep as set -e means it fails script
RELEASE_BRANCH=$(echo "$TRAVIS_BRANCH" |  sed -n 's/^release\-/&/p')

# Get the release type (dev/master) from the branch name
TYPE="$TRAVIS_BRANCH"

if ([ "$TRAVIS_PULL_REQUEST" == "false" ]  && [ "${TRAVIS_REPO_SLUG}" == "ScottLogic/StockFlux" ] && ([ "$TYPE" == "dev" ] || [ "$TYPE" == "master" ] || [ -n "$RELEASE_BRANCH" ]))
then
    # Clone the latest gh-pages
    git clone https://github.com/ScottLogic/StockFlux.git --branch gh-pages gh-pages

    # Get line with version from the file -> get the second word -> remove quotes around the value
    VERSION=$(grep "\"version\":" package.json | awk -v N=$2 '{print $2}' | cut -d \" -f2)

    echo "Type is: $TYPE"
    echo "Version is: $VERSION"

    if ([ $TYPE == "master" ] || [ $TYPE == "dev" ])
    then
        echo "Preparing to build version $TYPE"
        npm run build:deploy $TYPE

        rm -rf "./gh-pages/$TYPE"
        cp -r "./public" "./gh-pages/$TYPE"
    fi

    if ([ $TYPE == "master" ] || [ -n "$RELEASE_BRANCH" ])
    then
        echo "On $TYPE - building versioned build"
        if ([ -z "$VERSION" ])
        then
            echo "Unable to determine version from package.json."
            exit 1
        fi
        if [ -n "$RELEASE_BRANCH" ]
        then
            # For release branches add rc postfix
            VERSION="$VERSION-rc"
            echo "Release branch - updating version to $VERSION"
        fi
        # Rebuild everything to do $VERSION
        echo "Cleaning build. Targetting $VERSION"
        npm run build:deploy $VERSION

        rm -rf "./gh-pages/$VERSION"
        cp -r "./public" "./gh-pages/$VERSION"
    fi

    cd gh-pages

    # Removing git history
    rm -rf .git
    git init

    # Inside this git repo we'll pretend to be a new user
    git config user.name "Travis CI"
    git config user.email "travis@scottlogic.com"

    # The first and only commit to this new Git repo contains all the
    # files present with the commit message "Deploy to GitHub Pages".
    git add .
    git commit -m "Deploy to GitHub Pages"

    # Force push from the current repo's master branch to the remote
    # repo's gh-pages branch. (All previous history on the gh-pages branch
    # will be lost, since we are overwriting it.) We redirect any output to
    # /dev/null to hide any sensitive credential data that might otherwise be exposed.
    echo "Pushing to Github..."
    git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1

    echo "Cleaning residual gh-pages folder"
    rm -rf ../gh-pages
else
    echo "Nothing needs deploying"
fi
