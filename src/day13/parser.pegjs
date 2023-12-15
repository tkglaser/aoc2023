start
  = h:map t:(eol eol map)* { return [h, ...t.map(m => m[2])] }
  
map
  = h:line t:(eol line)* { return [h, ...t.map(l => l[1])] }

line
  = [.#]+ { return text() }
  
eol
  = "\n"