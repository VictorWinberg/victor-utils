# victor-utils

Some neat terminal utils that I use.

Alias to run it from anywhere in zsh:

`.zshrc`
```
function v() {
  service=$1
  if [ -z "$service" ]; then
    echo "usage: v <service>"
    echo "  e.g. v tags"
    return 1
  fi

  cd ~/git/victor-utils
  npm run ${service}
}
```
