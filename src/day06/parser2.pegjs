start
  = time:time eol distance:distance { return { time, distance } }
  
time
  = "Time:" _ nl:numlist  { return nl }
  
distance
  = "Distance:" _ nl:numlist { return nl }
  
numlist
  = head:intStr tail:(_ intStr)* { return Number([head, ...tail.map(t => t[1])].join("")) }
  
_ "whitespace"
  = " "+

intStr
  = digits:[0-9]+ { return digits.join(""); }

eol
  = "\n"