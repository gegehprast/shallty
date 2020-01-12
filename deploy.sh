#!/bin/bash
set -x
if [ $TRAVIS_BRANCH == 'deploy' ] ; then
    git init
    git remote add deploy "ssh://deploy@$REMOTE_ADDRESS:/home/deploy/shallty/.git"
    git config user.name "Travis CI"
    git config user.email "travisCI@gmail.com"
    git add .
    git commit -m "Deploy"
    git push deploy deploy --force
else
    echo "Not deploying, since this branch isn't deploy."
fi