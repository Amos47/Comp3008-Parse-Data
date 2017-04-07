# load csv
library(readr)

printStats = function(data, title){
  m <- mean(data)
  print(title)
  print(paste('Mean = ', m))
  print(paste('Standard deviation = ', sd(data)))
  print(paste('Median = ', median(data)))
  print(t.test(data, mu=m))
}

perUserStats = function(data, title, scheme){
  userTable <- table(data$User)
  printStats(userTable, paste(title, 'Per User for', scheme))
  hist(table(data$User), main=paste('Histogram of', title, 'Per User for', scheme), xlab=paste(title, 'Per User'))
  readline('next?');
}

loginTimeStats = function(data, title, scheme){
  submitTimes = data$`Time to submit (s)`
  printStats(submitTimes, paste(title, 'Times for', scheme))
  hist(submitTimes, main=paste('Histogram of', title, 'Times for', scheme), xlab='Time to submit (s)'); readline('next?')
  boxplot(submitTimes, main=paste('Boxplot of', title, 'Times for', scheme), ylab='Time to submit (s)'); readline('next?')
}

runForDataset = function(data, title, scheme){
  perUserStats(data, title, scheme)
  loginTimeStats(data, title, scheme)
}

runForFile = function(file, scheme){
  logins <- read_csv(file)
  successLogins <- subset(logins, Success == 'true')
  failedLogins <- subset(logins, Success == 'false')

  runForDataset(logins, 'All Logins', scheme)
  runForDataset(successLogins, 'Successful Logins', scheme)
  runForDataset(failedLogins, 'Failed Logins', scheme)
}

## runing the actual stuff
runForFile('./data/Blankpt28_log_out.csv', 'Blank PT')
runForFile('./data/Imagept28_log_out.csv', 'Image PT')
runForFile('./data/Text28_log_out.csv', 'Text')
