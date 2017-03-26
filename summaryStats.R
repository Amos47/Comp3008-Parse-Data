# load csv
library(readr)

perUserStats = function(data, title, scheme){
  hist(table(data$User), main=paste('Histogram of', title, 'Per User for', scheme)); readline('next?');
}

loginTimeStats = function(data, title, scheme){
  submitTimes = data$`Time to submit (s)`
  hist(table(submitTimes), main=paste('Histogram of', title, 'for', scheme)); readline('next?')
  boxplot(submitTimes, main=paste('Boxplot of', title, 'for', scheme), ylab='Time to submit (s)'); readline('next?')
}

runForDataset = function(data, title, scheme){
  perUserStats(data, title, scheme)
  loginTimeStats(data, title, scheme)
}

## runing the actual stuff
runForFile = function(file, scheme){
  logins <- read_csv(file)
  successLogins <- subset(logins, Success == 'true')
  failedLogins <- subset(logins, Success == 'false')

  runForDataset(logins, 'All Logins', scheme)
  runForDataset(successLogins, 'Successful Logins', scheme)
  runForDataset(failedLogins, 'Failed Logins', scheme)
}

runForFile('./data/Blankpt28_log_out.csv', 'Blank PT')
runForFile('./data/Imagept28_log_out.csv', 'Image PT')
runForFile('./data/Text28_log_out.csv', 'Text')
