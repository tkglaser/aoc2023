start
  = workflows:workflows eol eol parts:parts { return { workflows, parts } }
  
workflows
  = h:workflow t:(eol workflow)* { return [h,...t.map(t=>t[1])].reduce((prev,curr) => ({...prev,[curr.name]:curr}),{}) }
  
workflow
  = name:id "{" rules:rules "}" { return { name, rules } }
  
rules
  = h:rule t:("," rule)* { return [h, ...t.map(t=>t[1])] }
  
rule
  = cat:cat op:[<>] val:int ":" outcome:id { return { cat, op, val, outcome } }
  / outcome:id { return { outcome } }
  
parts
  = h:part t:(eol part)* { return [h, ...t.map(t=>t[1])] }
  
part
  = "{x=" x:int ",m=" m:int ",a=" a:int ",s=" s:int "}" { return { x,m,a,s } } 
  
cat "category"
  = [xmas]

id "identifier"
  = id:[A-Za-z]+ { return id.join(""); }

int "integer"
  = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = " "+
  
eol
  = "\n"