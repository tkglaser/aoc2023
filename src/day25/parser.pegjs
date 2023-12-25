start
  = h:line t:(eol line)* { return [h, ...t.map(t=>t[1])] }
  
line
  = name:id ":" conn:(_ id)+ { return { name, connections: conn.map(c => c[1]) } }
  
id "identifier"
  = id:[a-z]+ { return id.join(""); }

_ "whitespace"
  = " "+
  
eol
  = "\n"