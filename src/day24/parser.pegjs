start
  = h:line t:(eol line)* { return [h,...t.map(t=>t[1])] }
  
line
  = p:vec _ "@" _ v:vec { return { p, v } }

vec
 = x:int "," _ y:int "," _ z:int { return [x,y,z] }

int "integer"
  = [-0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = " "+
  
eol
  = "\n"