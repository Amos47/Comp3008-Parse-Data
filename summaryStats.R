# load csv
library(readr)

perUserStats = function(data, title, scheme){
  userTable <- table(data$User)
  print(paste(title, 'Per User for', scheme))
  print(paste('Mean = ', mean(userTable)))
  print(paste('Standard deviation = ', sd(userTable)))
  print(paste('Median = ', median(userTable)))
  hist(table(data$User), main=paste('Histogram of', title, 'Per User for', scheme))
  readline('next?');
}

loginTimeStats = function(data, title, scheme){
  submitTimes = data$`Time to submit (s)`
  timesTable = table(submitTimes)
  print(paste(title, 'Times for', scheme))
  print(paste('Mean = ', mean(timesTable)))
  print(paste('Standard deviation = ', sd(timesTable)))
  print(paste('Median = ', median(timesTable)))
  hist(timesTable, main=paste('Histogram of', title, 'Times for', scheme)); readline('next?')
  boxplot(submitTimes, main=paste('Boxplot of', title, 'Times for', scheme), ylab='Time to submit (s)'); readline('next?')
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
