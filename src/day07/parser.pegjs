start
  = head:game tail:(eol game)* { return [head, ...tail.map(t => t[1])] }
  
game
  = hand:hand _ score:int { return { hand, score } }
  
hand
  = [AKQJT98765432]+
  
int "integer"
  = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = " "+
  
eol
  = "\n"