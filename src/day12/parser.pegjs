start
  = h:row t:(eol row)* { return [h, ...t.map(t => t[1])] }
  
row
  = m:map _ d:dmglist { return { m, d } }
  
map
  = m:[?.#]+ { return m.join(""); }
  
dmglist
  = head:int tail:("," int)* { return [head, ...tail.map(t => t[1])] }
  
int
  = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = " "+
  
eol
  = "\n"