start
  = h:brick t:(eol brick)* { return [h, ...t.map(t => t[1])] }
  
brick
  = a:point "~" b:point { return {a,b} }
  
point
  = a:int "," b:int "," c:int { return[a,b,c] } 
  
int "integer"
  = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = " "+
  
eol
  = "\n"