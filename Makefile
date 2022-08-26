
main = ./main.js

ttest :
	doppler run -- node --no-warnings $(main) -t test\: make ttest

inspect :
	doppler run -- node --no-warnings --inspect-brk=0.0.0.0\:8080 $(main) -t test\: make inspect
