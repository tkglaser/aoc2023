start
  = head:game tail:(eol game)* { return [head, ...tail.map(t => t[1])] }
  
game
  = "Game " game:integer ":" rounds:rounds { return { game, rounds } }
  
rounds
  = _ head:round tail:(";" _ round)* {return [head, ...tail.map(t => t[2])]}

round
  = head:dice tail:("," _ dice)* { return [head, ... tail.map(t => t[2])]}
  
dice
  = count:integer _ colour:identifier { return { count, colour } }

_ "whitespace"
  = " "+

identifier
  = id:[a-z]+ { return id.join("") }

integer
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

eol
  = "\n"