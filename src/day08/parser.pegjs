start
  = path:path eol nodes:(eol node)* { return { path, nodes: nodes.map(n => n[1]) } }
  
path
  = [RL]+
  
node
  = curr:id _ "=" _ "(" L:id "," _ R:id ")" { return {curr, L, R} }

id "identifier"
  = id:[0-9A-Z]+ { return id.join(""); }

_ "whitespace"
  = " "+
  
eol
  = "\n"