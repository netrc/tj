
main = ./main.js

jest :
	( cd test ; /home/ric/tmp/jest/2*/node_modules/.bin/jest utils.test.js )

ttest :
	doppler run -- node --no-warnings $(main) -t test\: make ttest

inspect :
	doppler run -- node --no-warnings --inspect-brk=0.0.0.0\:8080 $(main) -t test\: make inspect
