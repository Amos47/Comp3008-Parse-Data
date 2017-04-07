# load csv
library(readr)

printStats = function(data, title){
  print(title)
  m <- mean(data)
  print(paste('Mean = ', m))
  print(paste('Standard deviation = ', sd(data)))
  print(paste('Median = ', median(data)))
  print(t.test(data, mu=m))
  # t.test(data, mu=m)
}

perUserStats = function(data, title, scheme){
  userTable <- table(data$User)
  printStats(userTable, paste(title, 'Per User for', scheme))
  hist(table(data$User), main=paste('Histogram of', title, 'Per User for', scheme), xlab=paste(title, 'Per User'))
  readline('next?');
}

loginTimeStats = function(data, title, scheme){
  submitTimes = data$`Time to submit (ms)`
  printStats(submitTimes, paste(title, 'Times for', scheme))
  hist(submitTimes, main=paste('Histogram of', title, 'Times for', scheme), xlab='Time to submit (ms)'); readline('next?')
  boxplot(submitTimes, main=paste('Boxplot of', title, 'Times for', scheme), ylab='Time to submit (ms)'); readline('next?')
}

runForDataset = function(data, title, scheme){
  perUserStats(data, title, scheme)
  loginTimeStats(data, title, scheme)
}

runForFile = function(file, scheme){
  logins <- read_csv(file)
  successLogins <- subset(logins, Status == 'success')
  failedLogins <- subset(logins, Status == 'failure')

  runForDataset(logins, 'All Logins', scheme)
  runForDataset(successLogins, 'Successful Logins', scheme)
  runForDataset(failedLogins, 'Failed Logins', scheme)
}

## runing the actual stuff
runForFile('./data/WordGenerator_log_out.csv', 'Word Generator');
