start
  = time:time eol distance:distance { return { time, distance } }
  
time
  = "Time:" _ nl:numlistWithBadKerning  { return nl }
  
distance
  = "Distance:" _ nl:numlistWithBadKerning { return nl }
  
numlistWithBadKerning
  = head:intStr tail:(_ intStr)* { return Number([head, ...tail.map(t => t[1])].join("")) }
  
_ "whitespace"
  = " "+

intStr
  = digits:[0-9]+ { return digits.join(""); }

eol
  = "\n"