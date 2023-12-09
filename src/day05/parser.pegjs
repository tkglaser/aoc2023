{
  function makeInteger(o) {
    return parseInt(o.join(""), 10);
  }
}

start
  = seeds:seeds eol maps:maps { return { seeds, maps } }

seeds
  = "seeds: " seeds:numlist eol { return seeds }

maps
  = m:map t:mapsTail* { return [m, ...t] }

map
  = header:mapHeader mappings:mappingTail* { return { ...header, mappings } }

mapsTail
  = eol eol m:map { return m }

mapHeader
  = from:identifier "-to-" to:identifier " map:" { return { from, to } }

mappingTail
  = eol m:mapping { return m }

mapping
  = dest:integer ws source:integer ws length:integer { return { dest, source, length } }

numlist
  = head:integer tail:numlistTail* { return [head,...tail] } 

numlistTail
  = ws ti:integer { return ti }

ws
  = " "+

identifier
  = id:[a-z]+ { return id.join("") }

integer
  = digits:[0-9]+ { return makeInteger(digits); }

eol
  = "\n"
