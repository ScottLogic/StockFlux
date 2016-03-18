#!/usr/bin/env bash
set -eo pipefail
if ([ $TRAVIS_PULL_REQUEST == "false" ]  && [ "${TRAVIS_REPO_SLUG}" == "ScottLogic/StockFlux" ] && ([ $TRAVIS_BRANCH == 'dev' ] || [ $TRAVIS_BRANCH == 'master' ]))
then
    #Clone the latest gh-pages
    git clone https://github.com/ScottLogic/StockFlux.git --branch gh-pages gh-pages

    #Get line with version from the file -> get the second word -> remove quotes around the value
    VERSION=$(grep "version" package.json | awk -v N=$2 '{print $2}' | cut -d \" -f2)

    #Get line with the release type (develop/master) from the file -> get the second word -> remove quotes around the value
    TYPE=$(grep "release-type" package.json | awk -v N=$2 '{print $2}' | cut -d \" -f2)

    if ([ -z '$TYPE' ] || [ -z '$VERSION' ])
    then
        echo 'Version or Type not set in package.json'
        exit 1
    fi

    rm -rf './gh-pages/$TYPE'
    cp -r './public' './gh-pages/$TYPE'
    rm -rf './gh-pages/$VERSION'
    cp -r './public' './gh-pages/$VERSION'
    cd gh-pages

    #Removing git history
    rm -rf .git
    git init

    # inside this git repo we'll pretend to be a new user
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
    git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
fi
