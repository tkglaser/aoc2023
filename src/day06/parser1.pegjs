start
  = time:time eol distance:distance 
  {
    return time.map((t,i) => ({ time: t, distance: distance[i] }))
  }
  
time
  = "Time:" _ nl:numlist  { return nl }
  
distance
  = "Distance:" _ nl:numlist { return nl }
  
numlist
  = head:int tail:(_ int)* { return [head, ...tail.map(t => t[1])] }
  
_ "whitespace"
  = " "+

int
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

eol
  = "\n"