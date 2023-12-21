start
  = h:instruction t:(eol instruction)* { return [h, ...t.map(t => t[1])] }
  
instruction
  = dir:direction _ count:int _ "(#" colour:colour ")" { return { dir, count, colour } }
  
direction
  = [RLUD]
  
colour
  = id:[0-9a-f]+ { return id.join(""); }
  
id "identifier"
  = id:[0-9A-Z]+ { return id.join(""); }

int "integer"
  = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = " "+
  
eol
  = "\n"