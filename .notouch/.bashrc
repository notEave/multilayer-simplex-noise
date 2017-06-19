#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

alias ls='ls --color=auto'
alias npm-exec='PATH=$(npm bin):$PATH'
alias npm-local='PATH=$(npm bin):$PATH'
alias record='/home/hoki/code/bash/record.sh'
alias xaos='xaos -driver aa -aadriver curses -extended  -autopilot -autorotate on -dim -bold -gamma .9'
alias ...='cd ../..'

function detach {
  $* & disown
}

GREEN_FG="$(tput setaf 10)"
GREEN_BG="$(tput setab 10)"
BLUE_FG="$(tput setaf 4)"
BLUE_BG="$(tput setab 4)"
BLACK_FG="$(tput setaf 16)"
WHITE_FG="$(tput setaf 7)"
RESET="$(tput sgr0)"

# export PS1='${GREEN}\W${RESET} ${BLUE}λ${RESET} '
# export PS1='${BLUE_BG}${BLACK_FG}\W${RESET}${BLUE_FG}${RESET} '
#PS1='\[$(printf "\\u0020%.0s" $(seq 23 $(tput cols))) ${BLUE_FG}${BLUE_BG} ${RESET}${BLUE_BG}\d \t\r${RESET}\u@\h:\w \]\n\$ '
PS1='\[$(printf "\\u0020%.0s" $(seq 24 $(tput cols))) ${BLUE_FG}${BLUE_BG} ${RESET}${BLUE_BG}${WHITE_FG}\d \t \r${RESET}${BLUE_BG}${WHITE_FG} \u@\h:\w ${RESET}${BLUE_FG}${RESET}\]\n '


BROWSER=/usr/bin/chromium
EDITOR=/usr/bin/nano
