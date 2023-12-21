start
  = h:module t:(eol module)* { return [h,...t.map(t=>t[1])] }
  
module
  = header:moduleHeader _ "->" _ targets:targets { return { ...header, targets } }
  
moduleHeader
  = type:moduleType? name:id {return type ? { type, name } : name === 'broadcaster' ? { type: name, name } : { name }}
  
moduleType
  = [%&]
  
targets
  = h:id t:("," _ id)* { return [h, ...t.map(t => t[2])] }
  
id "identifier"
  = id:[a-z]+ { return id.join(""); }

int "integer"
  = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = " "+
  
eol
  = "\n"